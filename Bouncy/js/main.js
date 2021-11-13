import { BoardState } from "./BoardState.js";
import { PlayerInput } from "./PlayerInput.js";
import { UIListeners } from "./UIListeners.js";

/*
 * 7/20/2018 todo list;
 * Ability with player movement
    - Run and gun (move and shoot while moving)
    - Teleport
 * Add chests to levels
 * Unlock abilities from chests
 * Figure out what to do with the UI for post-level system (show level ups?), and the deck editor
 * ********************
 * Progression thoughts;
 * Do a combination of clash royale & EDF.
 * When you win a fight, you roll a chest and get 3 abilities from it.
 * You choose one of those abilities to keep.  If you don't know the ability, you learn it.
 * If you do know it, you gain exp for it.
 * You also gain a bit of exp for cards based on damage dealt.
 * Cards damage / # of shots is determined by their level, and that's the only change.
 * ALTERNATIVE;
 * quest-based level up system.  In order to level up a card, you must complete a quest.
 * TODO;
    split freeze into two status ailments -- stun and immobilize

 ******
 * New enemies
 * Elite enemies -- they sit at the top of the screen like bosses and use abilities each turn.
 * Causes all nearby basic enemies to turn into weak bombers
 * All players target this enemy
 * Infected.  When it dies, it explodes into a bunch of smaller minions.
 ***************************
 * Attribute bonus damage back the buff creator
 * Add google ads to the sides
 * Have the knight throw up his shield to the left and right if the front is full.
 * Background of a person in a square
 * Make freeze spread across all shields.  They take double damage
 */
export default class MainGameHandler {
  constructor(turnControllerClass) {
    this.ticksPerTurn = 20;
    this.gameID = $('#gameBoard').attr('data-gameID');
    this.missionProgramCanvas = $('#missionProgramDisplay');
    this.userToken = getUrlParameter('userToken');
    this.isHost = $('#gameContainer').attr('host') === 'true';
    this.playerID = $('#gameContainer').attr('playerID');
    this.isFinalized = false;
    this.turnController = new turnControllerClass(this);

    this.aimPreviews = {};// <-- adding this
    this.gameStarted = false;

    this.tickLoopTimeout = null;

    //Create the renderer
    var mad = $('#missionActionDisplay');

    let canvasWidth = Math.floor(mad.width() / Unit.UNIT_SIZE) * Unit.UNIT_SIZE;
    let canvasHeight = Math.floor((mad.height()) / Unit.UNIT_SIZE) * Unit.UNIT_SIZE;

    this.boardSize = {width: canvasWidth, height: canvasHeight};
    this.renderer = PIXI.autoDetectRenderer(canvasWidth, canvasHeight);
    this.stage = new PIXI.Container();
    this.renderContainers = {
      terrain: new PIXI.Container(),
      
      boardState: {
        units: new PIXI.Container(),
        abilityForecasts: new PIXI.Container(),
        projectiles: new PIXI.Container(),
        effects: new PIXI.Container(),
      },

      aimIndicators: new PIXI.Container(),
      debug: new PIXI.Container(),
    }
    this.stage.addChild(this.renderContainers.terrain);
    this.stage.addChild(this.renderContainers.boardState.units);
    this.stage.addChild(this.renderContainers.boardState.abilityForecasts);
    this.stage.addChild(this.renderContainers.boardState.projectiles);
    this.stage.addChild(this.renderContainers.boardState.effects);
    this.stage.addChild(this.renderContainers.aimIndicators);
    this.stage.addChild(this.renderContainers.debug);
    
    //Add the canvas to the HTML document
    mad.append(this.renderer.view);

    this.playerCommands = [];
    this.players = [];

    this.DEBUG_SPEED = 1;

    UIListeners.setupPlayerInitListeners();
  }

  addLine(line, color) {
    // Create a new Graphics object and add it to the scene
    var lineGraphic = new PIXI.Graphics();
    this.renderContainers.debug.addChild(lineGraphic);

    // Move it to the beginning of the line
    lineGraphic.position.set(line.x1, line.y1);

    // Draw the line (endPoint should be relative to myGraph's position)
    lineGraphic.lineStyle(1, color)
           .moveTo(0, 0)
           .lineTo(line.x2 - line.x1, line.y2 - line.y1);
    return lineGraphic;
  }

  testReflection(x1, y1, angle, distance, lines, color) {
    var returnLines = [];
    var reflectionLines = Physics.doLineReflections(x1, y1, angle, distance, lines, undefined, () => { return true; });
    reflectionLines.reflection_lines.forEach((line) => {
      returnLines.push(this.addLine(line, color));
    });

    return returnLines;
  }

  runLineTester() {
    UIListeners.showGameBoard();
    this.testlines = [
      //new Line(0, 0, 0, 9999999),
      //new Line(0, 0, 9999999, 0),
      //new Line(500, 9999999, 500, 0),
      new Line(475, 50, 500, 75),
    ];
    for (var i = 0; i < this.testlines.length; i++) {
      var line = this.testlines[i];
      this.addLine(line, 0x00ff00);
    }

    this.testReflection(480.1107320268968, 53.816015252685766, 1.87667519819892,
      6, this.testlines, 0xffffff);
  }

  start() {
    var self = this;

    GameInitializer.setHostNewGameCallback(() => {
      self.updateBoardState(null, this.boardSize, self.renderContainers.boardState);
      self.boardState.addInitialPlayers(self.players);
      AIDirector.createInitialUnits(self.boardState);
      self.players.forEach((player) => {
        player.drawInitialHand(this.boardState);
        UIListeners.createAbilityDisplay(this.players);
      });

      ServerCalls.SetupBoardAtGameStart(self.boardState, self, AIDirector);
    })
    .setLoadCompleteCallback(this.gameReadyToBegin.bind(this))
    .setLoadServerDataCallback(this.deserializeGameData.bind(this))
    .setPlayerDataLoadedCallback(this.playerDataLoadedCallback.bind(this))
    .setGameNotStartedCallback(this.gameNotStartedCallback.bind(this));

    this.loadImages(() => { GameInitializer.start() });
  }

  loadImages(callback) {
    ImageLoader.loadImages(callback);
  }

  // Step 3 -- deserialize the board state from the server
  deserializeGameData(gameData) {
    var serverBoardData = JSON.parse(gameData.board_state);
    
    let serverBoardState = new BoardState(
      this.boardSize,
      this.renderContainers.boardState,
      serverBoardData
    );

    if (this.boardState && serverBoardState && this.boardState.turn > serverBoardState.turn) {
      // We're descynched because we're faster than the server
      console.log("server too slow.  Retrying");
      window.setTimeout(this.resyncAtTurnEnd.bind(this), 1000);
      return false;
    }

    let lastBoardState = this.boardState;

    if (this.boardState) {
      this.boardState.resetStage();
    }

    this.updateBoardState(serverBoardState);
    this.isFinalized = gameData.finalized;

    this.boardState.loadUnits(serverBoardData.units);
    UIListeners.updateTeamHealth(this.boardState.teamHealth[0], this.boardState.teamHealth[1]);
    UIListeners.createAbilityDisplay(this.players);

    if (lastBoardState) {
      let desyncReason = this.boardState.checkForDesync(lastBoardState);
      if (desyncReason) {
        console.log(this.boardState.turn, lastBoardState.turn);
        Errors.show("Desync.  Reason: " + desyncReason)
        console.log("--------my board state--------", lastBoardState);
        console.log("--------server board state--------", this.boardState);
      }
    }

    var player_command_list = JSON.parse(gameData.player_commands);
    this.deserializePlayerCommands(player_command_list, true);
    return true;
  }

  deserializePlayerCommands(player_command_list, ignoreSelf = false, checkForTurnEnd = true) {
    this.removeAllPlayerCommands();
    let previousPlayerCommands = this.getPlayerCommandController(this.playerID);
    if (ignoreSelf && this.playerCommands[this.playerID]) {
      previousPlayerCommands = this.playerCommands[this.playerID]
    }
    this.playerCommands = [];
    var self = this;
    for (var player_id in player_command_list) {
      if (
        player_command_list.hasOwnProperty(player_id) &&
        (!ignoreSelf || player_id != this.playerID || !previousPlayerCommands.getCommands().length)
      ) {
        var command_list = player_command_list[player_id];
        if (command_list) {
          command_list.forEach(function(commandJSON) {
            self.setPlayerCommand(
              PlayerCommand.FromServerData(commandJSON),
              false
            );
          });
        }
      }
    }

    if (ignoreSelf && previousPlayerCommands.getCommands().length > 0) {
      this.playerCommands[this.playerID] = previousPlayerCommands;
      var commands = this.playerCommands[this.playerID].getCommands();
      commands.forEach(function(command) {
        self.setPlayerCommand(command, false);
      });
    }

    if (checkForTurnEnd) {
      this.checkForAutoEndTurn();
    }

    for (var player_id in this.playerCommands) {
      this.playerCommands[player_id].updateValidTargetChecks();
    }

    UIListeners.updatePlayerCommands(this.playerCommands, this.players);
  }

  checkForAutoEndTurn() {
    if (!this.gameStarted || this.turnController.isPlayingOutTurn() || !this.isHost || this.isFinalizing || this.isFinalized) { return; }

    if (
      this.players.length > 0 &&
      this.turnController.readyForTurnEnd(this.players, this.playerCommands)
    ) {
      TurnControls.setPlayState(false);
      this.finalizeTurn();
    }
  }

  removeAllPlayerCommands() {
    for (var key in this.playerCommands) {
      this.playerCommands[key].getCommands().forEach((command) => {
        command.removeAimIndicator(this.renderContainers.aimIndicators);
      })
    }
  }

  playerDataLoadedCallback(player_data) {
    this.updatePlayerData(player_data);

    UIListeners.createPlayerStatus(this.players);
    UIListeners.createAbilityDisplay(this.players);
  }

  updatePlayerData(player_data) {
    this.players = [];
    var num_players = 0;
    AbilityManager.reinitializeAbilities();
    UnitBasic.createAbilityDefs();
    for (var key in player_data) {
      if (!player_data[key]) {
        continue;
      }
      num_players += 1;
      var playerData = JSON.parse(player_data[key]);
      var newPlayer = new Player(playerData, key);
      this.players[key] = newPlayer;
    }
    NumbersBalancer.setNumPlayers(num_players);
  }

  gameNotStartedCallback(metaData) {
    this.updatePlayerData(metaData.player_data);
    UIListeners.setOtherDecks(metaData.other_decks);
    NumbersBalancer.setDifficulty(metaData.difficulty ? metaData.difficulty : NumbersBalancer.DIFFICULTIES.MEDIUM);
    AIDirector.setLevel(metaData.level);
    UIListeners.updateGameSetupScreen(this.players, metaData.difficulty, metaData.level);
  }

  gameReadyToBegin(finalized) {
    UIListeners.updatePlayerStatus(this.boardState, this.players);
    UIListeners.updateTeamHealth(this.boardState.teamHealth[0], this.boardState.teamHealth[1]);
    this.updateActionHint();
    UIListeners.showGameBoard();
    this.boardState.saveState();
    this.boardState.updateWavesSpawnedUI(AIDirector);

    UIListeners.setupUIListeners(this.boardState);
    this.renderer.render(this.stage);
    this.gameStarted = true;
    if (this.isFinalized) {
      this.turnController.playOutTurn();
    } else {
      this.getTurnStatus();
      this.checkForAutoEndTurn();
    }

    if (this.boardState.isGameOver(AIDirector)) {
      $('#missionEndTurnButton').prop("disabled", true).removeClass("flashing");
      UIListeners.showGameOverScreen(this.boardState.didPlayersWin(AIDirector), this.boardState.gameStats);
      this.updateActionHint();
    }
  }

  getTurnStatus() {
    if (!this.boardState.isGameOver(AIDirector)) {
      ServerCalls.GetTurnStatus(this.recieveTurnStatus, this);
    }
  }

  recieveTurnStatus(response) {
    var turnData = JSON.parse(response);

    if (this.turnController.isPlayingOutTurn()) { return; }
    if (this.boardState.turn > turnData.current_turn) {
      window.setTimeout(this.getTurnStatus.bind(this), 1000);
      return;
    }

    var player_command_list = JSON.parse(turnData.player_commands);
    this.deserializePlayerCommands(player_command_list, true);
    this.isFinalized = turnData.finalized;
    if (
      turnData.finalized &&
      this.boardState.turn <= turnData.current_turn &&
      !this.isHost
    ) {
      this.turnController.playOutTurn();
    } else if (!this.turnController.isPlayingOutTurn()) {
      window.setTimeout(this.getTurnStatus.bind(this), 1000);
    }
  }

  finalizeTurn() {
    this.isFinalizing = true;
    this.boardState.loadState();
    $('#missionEndTurnButton').prop("disabled", true).removeClass("flashing");
    ServerCalls.FinalizeTurn(this.boardState.turn, this, this.turnFinalizedOnServer);
  }

  turnFinalizedOnServer(data) {
    this.isFinalizing = false;
    if (data.error || !data.player_commands) { return; }
    this.deserializePlayerCommands(
      $.parseJSON(data.player_commands),
      false,
      false
    );
    PlayerInput.setSelectedAbility(null);
    // phases
    this.turnController.playOutTurn();
  }

  doTick(phase) {
    this.boardState.runTick(this.players, this.playerCommands, phase);
    return this.boardState.atEndOfPhase(this.players, this.playerCommands, phase);
  }

  getPlayerCommandController(playerID) {
    if (!this.playerCommands[playerID]) {
      this.playerCommands[playerID] = new PlayerCommandController(playerID);
    }
    return this.playerCommands[playerID];
  }

  getMajorAimPreviewCommand() {
    if (this.aimPreviewCommand && this.aimPreviewCommand.isMajorAction()) {
      return this.aimPreviewCommand;
    }
    if (this.playerCommands[this.playerID] && this.playerCommands[this.playerID].hasMajor()) {
      return this.playerCommands[this.playerID].getMajorAction();
    }
    return null;
  }

  getMinorAimPreviewCommand() {
    if (this.aimPreviewCommand && this.aimPreviewCommand.isMinorAction()) {
      return this.aimPreviewCommand;
    }

    if (this.playerCommands[this.playerID] && this.playerCommands[this.playerID].hasMinor()) {
      return this.playerCommands[this.playerID].getMinorAction();
    }
    return null;
  }

  redrawAimPreviews() {
    if (this.majorAimPreviewCommand) { this.majorAimPreviewCommand.removeAimIndicator(this.renderContainers.aimIndicators); }
    if (this.minorAimPreviewCommand) { this.minorAimPreviewCommand.removeAimIndicator(this.renderContainers.aimIndicators); }

    this.majorAimPreviewCommand = this.getMajorAimPreviewCommand();
    this.minorAimPreviewCommand = this.getMinorAimPreviewCommand();
    if (this.majorAimPreviewCommand) {
      this.majorAimPreviewCommand.updateValidTargetCheck();
      this.majorAimPreviewCommand.addAimIndicator(this.boardState, this.renderContainers.aimIndicators, this.players);
    }

    if (this.minorAimPreviewCommand) {
      this.minorAimPreviewCommand.updateValidTargetCheck();
      this.minorAimPreviewCommand.addAimIndicator(this.boardState, this.renderContainers.aimIndicators, this.players);
    }
  }

  clearAimPreviewNEW() {
    this.aimPreviewCommand = null;
    this.getPlayerCommandController(this.playerID).setPreviewCommand(this.aimPreviewCommand);
    this.redrawAimPreviews();
  }

  setAimPreviewNEW(command) {
    this.aimPreviewCommand = command;
    let commandController = this.getPlayerCommandController(this.playerID);
    commandController.setPreviewCommand(this.aimPreviewCommand);
    if (command.isMajorAction() && commandController.hasMajor()) {
      commandController.getMajorAction().removeAimIndicator(this.renderContainers.aimIndicators);
    } else if (command.isMinorAction() && commandController.hasMinor()) {
      commandController.getMinorAction().removeAimIndicator(this.renderContainers.aimIndicators);
    }
    /*this.getPlayerCommandController(this.playerID).getCommands().forEach((command) => {
      command.addAimIndicator(this.boardState, this.renderContainers.aimIndicators, this.players);
    });*/
    this.redrawAimPreviews();
  }

  setAimPreview(x, y, abilityIndex, commandTurn) {
    if (this.aimPreviews[commandTurn]) {
      this.aimPreviews[commandTurn].removeAimIndicator();
      this.playerCommands[this.playerID] &&
        this.playerCommands[this.playerID].getCommands().forEach((command) => {
        if (
          command.getCommandPhase() === commandTurn ||
          command.isMinorAction() && commandTurn === TurnPhasesEnum.PLAYER_PRE_MINOR ||
          command.isMinorAction() && commandTurn === TurnPhasesEnum.PLAYER_MINOR
        ) {
          if (abilityIndex === null) {
            command.updateValidTargetCheck();
            command.addAimIndicator(this.boardState, this.renderContainers.aimIndicators, this.players);
          } else {
            command.removeAimIndicator(this.renderContainers.aimIndicators);
          }
        }
      });
    }
    if (abilityIndex == "move") {
      var validMove = PlayerCommandMove.findValidMove(
        this.boardState,
        $('#gameContainer').attr('playerID'),
        x, y
      );
      if (validMove) {
        this.aimPreviews[commandTurn] = new PlayerCommandMove(validMove.x, validMove.y);
        this.aimPreviews[commandTurn].updateValidTargetCheck();
        this.aimPreviews[commandTurn].addAimIndicator(this.boardState, this.renderContainers.aimIndicators, this.players);
      }
    } else if (abilityIndex !== null) {
      this.aimPreviews[commandTurn] = new PlayerCommandUseAbility(x, y, abilityIndex, $('#gameContainer').attr('playerID'));
      this.aimPreviews[commandTurn].updateValidTargetCheck();
      this.aimPreviews[commandTurn].addAimIndicator(this.boardState, this.renderContainers.aimIndicators, this.players);
    } else {
      this.aimPreviews[commandTurn] = null;
    }
  }

  getHintState() {
    if (PlayerInput.selectedAbility) {
      return "abilityselected";
    } else if (!this.playerCommands[this.playerID]) {
      return "nomajor";
    } else {
      let pc = this.playerCommands[this.playerID];
      if (!pc.hasMajor()) { return "nomajor"; }
      if (!pc.hasMinor()) { return "nominor"; }
      if (!pc.isDoneTurn()) { return "notdone"; }
    }
    return 'done';
  }

  getActionHint() {
    let state = this.getHintState();
    switch (state) {
      case 'nomajor':
        return "Select an action card below";
      case 'nominor':
        return "Select a minor action card below";
      case 'notdone':
        return "Press the 'Finish Turn' button to end your turn";
      case 'abilityselected':
        return "Click on the game area to use the selected ability";
      case 'done':
      default:
        return "";
    }
  }

  setPlayerCommand(playerCommand, saveCommand) {
    var pID = playerCommand.getPlayerID();
    if (!this.playerCommands[pID]) {
      this.playerCommands[pID] = new PlayerCommandController(pID);
    } else {
      this.playerCommands[pID].getCommands().forEach((command) => {
        command.removeAimIndicator(this.renderContainers.aimIndicators);
      });
    }
    this.playerCommands[pID].addCommand(playerCommand);

    if (!$('#gameContainer').hasClass("turnPlaying")) {
      this.playerCommands[pID].getCommands().forEach((command) => {
        let aimPreview = this.aimPreviews[command.getCommandPhase()];
        let newAimPreview = null;
        if (
          pID === this.playerID &&
          this.aimPreviewCommand &&
          (
            this.aimPreviewCommand.isMinorAction() === command.isMinorAction() ||
            this.aimPreviewCommand.isMajorAction() === command.isMajorAction()
          )
        ) {
          newAimPreview = this.aimPreviewCommand;
        }
        if (newAimPreview) {
          // nothing;
        } else if (pID !== this.playerID || !aimPreview) {
          command.updateValidTargetCheck();
          command.addAimIndicator(this.boardState, this.renderContainers.aimIndicators, this.players);
        } else if (pID == this.playerID && aimPreview) {
          aimPreview.updateValidTargetCheck();
          aimPreview.addAimIndicator(this.boardState, this.renderContainers.aimIndicators, this.players);
        }
      });
    }

    if (
      pID == this.playerID &&
      (saveCommand === true || saveCommand === undefined)
    ) {
      UIListeners.updatePlayerCommands(this.playerCommands, this.players);
      ServerCalls.SavePlayerCommands(
        this.boardState,
        this.playerCommands[pID].serialize(),
        this,
        this.playerCommandsSaved
      );
    }

    if (pID == this.playerID) {
      this.updateActionHint();
    }
    return playerCommand;
  }

  updateActionHint() {
    if (this.boardState.isGameOver(AIDirector)) {
      UIListeners.updateActionHint("");
    } else if (this.turnController.isPlayingOutTurn()) {
      UIListeners.updateActionHint("");
    } else {
      UIListeners.updateActionHint(this.getActionHint());
    }
  }

  playerCommandsSaved(data) {
    let parsed = $.parseJSON(data.player_commands)
    this.deserializePlayerCommands(parsed);
    let self = this;
    if (parsed[this.playerID]) {
      var command_list = parsed[this.playerID];
      command_list.forEach(function(commandJSON) {
        self.setPlayerCommand(
          PlayerCommand.FromServerData(commandJSON),
          false
        );
      });
    }
  }

  redraw() {
    this.renderer.render(this.stage);
    window.requestAnimationFrame(this.redraw.bind(this));
  }

  resyncAtTurnEnd() {
    ServerCalls.LoadInitialBoard((serializedGameData) => {
      var gameData = JSON.parse(serializedGameData);
      if (this.deserializeGameData(gameData)) {
        $('#gameContainer').removeClass("turnPlaying");
      }
    }, this);
  }

  finalizedTurnOver() {
    $('#gameContainer').removeClass("turnPlaying");
    if (!this.boardState.isGameOver(AIDirector)) {
      $('#missionEndTurnButton').prop("disabled", false).removeClass("flashing");
    } else {
      UIListeners.showGameOverScreen(this.boardState.didPlayersWin(AIDirector), this.boardState.gameStats);
    }

    this.players.forEach((player) => {
      let discardedCards = 0;
      if (player.user_id in this.playerCommands) {
        this.playerCommands[player.user_id].getCommands().forEach((command) => {
          if (command instanceof PlayerCommandUseAbility) {
            if (player.discardCard(command.abilityID)) {
              discardedCards += 1;
            }
          }
        });
      }
      player.endOfTurn();
      player.refillHand(this.boardState);
    });

    UIListeners.createAbilityDisplay(this.players);

    this.boardState.incrementTurn(this.players);
    this.boardState.saveState();
    if (this.isHost) {
      let experienceGained = this.boardState.gameStats.getExperienceEarned();
      ServerCalls.SetBoardStateAtStartOfTurn(this.boardState, this, AIDirector, experienceGained);
    } else {
      $('#gameContainer').addClass("turnPlaying");
      this.resyncAtTurnEnd();
    }
    this.removeAllPlayerCommands();
    this.playerCommands = [];
    this.isFinalized = false;
    this.isFinalizing = false;
    this.turnController.setPlayingOutTurn(false);

    UIListeners.updatePlayerCommands(this.playerCommands, this.players);
    this.getTurnStatus();
    UIListeners.resetHintBox();
    this.updateActionHint();
  }

  debugSpeed() {
    this.turnController.debugSpeed();
    this.DEBUG_SPEED = 2;
  }

  updateBoardState(boardState, boardSize, stage, boardData) {
    if (boardState) {
      this.boardState = boardState;
    } else {
      this.boardState = new BoardState(boardSize, stage, boardData);
    }

    this.turnController.setBoardState(this.boardState);
    UIListeners.resetSpawnPreview(this.boardState);

    return this.boardState;
  }

  runRandomTester() {
    var boardState = this.updateBoardState();
    var buckets = {};
    var wl = [
      {value: 1, weight: 5},
      {value: 2, weight: 2},
      {value: 3, weight: 2},
      {value: 4, weight: 1}
    ];
    for (var i = 0; i < 100; i++) {
      var r = AIDirector.getRandomFromWeightedList(Math.random(), wl);

      if (!(r in buckets)) {
        buckets[r] = 0;
      }
      buckets[r] += 1;
    }
    var key = {};
    for (var i = 0; i < wl.length; i++) {
      key[wl[i].value] = wl[i].weight;
    }
  }
}
