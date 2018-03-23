/*
 * TODO;
    You can still change your selected ability after the round has ended
    split freeze into two status ailments -- stun and immobilize
 ******
 * New enemies
 * After taking X damage in a turn, it doesn't take any more damage for the rest of the turn.
 * Causes all nearby basic enemies to turn into weak bombers
 * All players target this enemy
 ***************************
 * Add Minor Actions
 * Actions should be able to move you
 * Attribute bonus damage back the buff creator
 * Needs more player interaction
 * Add google ads to the sides
 * Invulnerable enemies that deal no damage as a wall
 * New enemy type -- infected.  When it dies, it explodes into a bunch of smaller minions.
 * Have the knight throw up his shield to the left and right if the front is full.
 * Add a back button
 * Background of a person in a square
 * Make freeze spread across all shields.  They take double damage
 */
const DEBUG_MODE = false;

class MainGame {
  constructor() {
    this.ticksPerTurn = 20;
    this.gameID = $('#gameBoard').attr('data-gameID');
    this.missionProgramCanvas = $('#missionProgramDisplay');
    this.userToken = getUrlParameter('userToken');
    this.isHost = $('#gameContainer').attr('host') === 'true';
    this.playerID = $('#gameContainer').attr('playerID');
    this.isFinalized = false;
    this.playingOutTurn = false;

    this.aimPreview = null;
    this.gameStarted = false;

    this.tickLoopTimeout = null;

    //Create the renderer
    var mad = $('#missionActionDisplay');

    let canvasWidth = Math.floor(mad.width() / Unit.UNIT_SIZE) * Unit.UNIT_SIZE;
    let canvasHeight = Math.floor(mad.height() / Unit.UNIT_SIZE) * Unit.UNIT_SIZE;

    this.boardSize = {width: canvasWidth, height: canvasHeight};
    this.renderer = PIXI.autoDetectRenderer(canvasWidth, canvasHeight);
    this.stage = new PIXI.Container();

    //Add the canvas to the HTML document
    mad.append(this.renderer.view);

    this.playerCommands = [];
    this.players = {};

    this.TICK_DELAY = 20;
    this.DEBUG_SPEED = 1;

    UIListeners.setupPlayerInitListeners();
  }

  addLine(line, color) {
    // Create a new Graphics object and add it to the scene
    var lineGraphic = new PIXI.Graphics();
    this.stage.addChild(lineGraphic);

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
      self.boardState = new BoardState(this.boardSize, self.stage);
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
      this.stage,
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

    this.boardState = serverBoardState;
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
    let previousPlayerCommands = [];
    if (ignoreSelf && this.playerCommands[this.playerID]) {
      previousPlayerCommands = this.playerCommands[this.playerID]
    }
    this.playerCommands = [];
    var self = this;
    for (var player_id in player_command_list) {
      if (
        player_command_list.hasOwnProperty(player_id) &&
        (!ignoreSelf || player_id != this.playerID)
      ) {
        var command_list = player_command_list[player_id];
        command_list.forEach(function(commandJSON) {
          self.setPlayerCommand(
            PlayerCommand.FromServerData(commandJSON),
            false
          );
        });
      }
    }
    if (checkForTurnEnd) {
      this.checkForAutoEndTurn();
    }

    if (ignoreSelf) {
      this.playerCommands[this.playerID] = previousPlayerCommands;
      var commands = this.playerCommands[this.playerID];
      commands.forEach(function(command) {
        self.setPlayerCommand(command, false);
      });
    }

    UIListeners.updatePlayerCommands(this.playerCommands, this.players);
  }

  checkForAutoEndTurn() {
    if (!this.gameStarted || this.playingOutTurn || !this.isHost || this.isFinalizing || this.isFinalized) { return; }
    var allPlayersHaveCommand = true;
    for (var key in this.players) {
      var playerHasCommand = false;
      if (this.playerCommands[this.players[key].getUserID()]) {
        var pc = this.playerCommands[this.players[key].getUserID()];
        for (var i = 0; i < pc.length; i++) {
          if (pc[i].commandEndsTurn()) {
            playerHasCommand = true;
          }
        }
      }
      if (!playerHasCommand) {
        allPlayersHaveCommand = false;
      }
    }

    if (allPlayersHaveCommand && this.players.length > 0) {
      TurnControls.setPlayState(false);
      this.finalizeTurn();
    }
  }

  removeAllPlayerCommands() {
    for (var key in this.playerCommands) {
      this.playerCommands[key].forEach((command) => {
        command.removeAimIndicator(this.stage);
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
    UIListeners.showGameBoard();
    this.boardState.saveState();
    this.boardState.updateWavesSpawnedUI(AIDirector);

    UIListeners.setupUIListeners();
    this.renderer.render(this.stage);
    this.gameStarted = true;
    if (this.isFinalized) {
      this.playOutTurn();
    } else {
      this.getTurnStatus();
      this.checkForAutoEndTurn();
    }

    if (this.boardState.isGameOver(AIDirector)) {
      $('#missionEndTurnButton').prop("disabled", true);
      UIListeners.showGameOverScreen(this.boardState.didPlayersWin(AIDirector), this.boardState.gameStats);
    }
  }

  getTurnStatus() {
    if (!this.boardState.isGameOver(AIDirector)) {
      ServerCalls.GetTurnStatus(this.recieveTurnStatus, this);
    }
  }

  recieveTurnStatus(response) {
    var turnData = JSON.parse(response);

    if (this.playingOutTurn) { return; }
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
      this.playOutTurn();
    } else if (!this.playingOutTurn) {
      window.setTimeout(this.getTurnStatus.bind(this), 1000);
    }
  }

  finalizeTurn() {
    this.isFinalizing = true;
    this.boardState.loadState();
    $('#missionEndTurnButton').prop("disabled", true);
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
    // phases
    this.playOutTurn();
  }

  playOutTurn(currPhase) {
    if (this.playingOutTurn && !currPhase) { return; }
    if (!currPhase) {
      $('#gameContainer').addClass("turnPlaying");
      this.removeAllPlayerCommands();
      for (let pid in this.playerCommands) {
        for (let command of this.playerCommands[pid]) {
          if (command instanceof PlayerCommandUseAbility) {
            this.boardState.gameStats.addAbilityUseCount(pid, command.abilityID);
          }
        }
      }
    }

    this.playingOutTurn = true;
    if (currPhase) {
      this.boardState.endOfPhase(this.players, currPhase);
    }
    var phase = !!currPhase ?
      TurnPhasesEnum.getNextPhase(currPhase) :
      TurnPhasesEnum.START_TURN;

    this.startOfPhase(phase);

    if (phase == TurnPhasesEnum.NEXT_TURN) {
      this.finalizedTurnOver();
    } else {
      this.loopTicksForPhase(phase);
    }
  }

  startOfPhase(phase) {
    if (phase == TurnPhasesEnum.ENEMY_MOVE) {
      AIDirector.giveUnitsOrders(this.boardState);
    }
    if (phase == TurnPhasesEnum.ENEMY_MOVE) {
      AIDirector.spawnForTurn(this.boardState);
    }

    if (phase == TurnPhasesEnum.ENEMY_ACTION) {
      this.boardState.doUnitActions(this.boardState);
    }

    this.boardState.startOfPhase(phase);
  }

  loopTicksForPhase(phase) {
    var result = this.doTick(phase);
    if (result) {
      this.boardState.endPhase();
      this.playOutTurn.call(this, phase);
    } else {
      this.tickLoopTimeout = window.setTimeout(this.loopTicksForPhase.bind(this, phase), this.TICK_DELAY);
    }
  }

  doTick(phase) {
    this.boardState.runTick(this.players, this.playerCommands, phase);
    return this.boardState.atEndOfPhase(this.players, this.playerCommands, phase);
  }

  setAimPreview(x, y, abilityIndex) {
    if (this.aimPreview) {
      this.aimPreview.removeAimIndicator();
    }
    if (abilityIndex == "move") {
      var validMove = PlayerCommandMove.findValidMove(
        this.boardState,
        $('#gameContainer').attr('playerID'),
        event.offsetX,
        event.offsetY
      );
      if (validMove) {
        this.aimPreview = new PlayerCommandMove(validMove.x, validMove.y);
        this.aimPreview.addAimIndicator(this.boardState, this.stage, this.players);
      }
    } else if (abilityIndex !== null) {
      this.aimPreview = new PlayerCommandUseAbility(x, y, abilityIndex, $('#gameContainer').attr('playerID'));
      this.aimPreview.addAimIndicator(this.boardState, this.stage, this.players);
    } else {
      this.aimPreview = null;
    }
  }

  setPlayerCommand(playerCommand, saveCommand) {
    var pID = playerCommand.getPlayerID();
    if (!this.playerCommands[pID]) {
      this.playerCommands[pID] = [];
    } else {
      this.playerCommands[pID].forEach((command) => {
        command.removeAimIndicator(this.stage);
      });
    }
    var replaced = false;
    for (var i = 0; i < this.playerCommands[pID].length; i++) {
      if (this.playerCommands[pID][i].constructor.name === playerCommand.constructor.name) {
        this.playerCommands[pID][i] = playerCommand;
        replaced = true;
      }
    }
    if (!replaced) {
      this.playerCommands[pID].push(playerCommand);
    }

    if (!$('#gameContainer').hasClass("turnPlaying")) {
      if (pID !== this.playerID || !this.aimPreview) {
        this.playerCommands[pID].forEach((command) => {
          command.addAimIndicator(this.boardState, this.stage, this.players);
        });
      } else if (pID == this.playerID && this.aimPreview) {
        this.aimPreview.addAimIndicator(this.boardState, this.stage, this.players);
      }
    }

    if (
      pID == this.playerID &&
      (saveCommand === true || saveCommand === undefined)
    ) {
      UIListeners.updatePlayerCommands(this.playerCommands, this.players);
      ServerCalls.SavePlayerCommands(
        this.boardState,
        this.playerCommands[pID].map(
          function(playerCommand) {
            return playerCommand.serialize();
          }
        ),
        this,
        this.playerCommandsSaved
      );
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
      $('#missionEndTurnButton').prop("disabled", false);
    } else {
      UIListeners.showGameOverScreen(this.boardState.didPlayersWin(AIDirector), this.boardState.gameStats);
    }

    this.players.forEach((player) => {
      let discardedCards = 0;
      if (player.user_id in this.playerCommands) {
        this.playerCommands[player.user_id].forEach((command) => {
          if (command instanceof PlayerCommandUseAbility) {
            if (player.discardCard(command.abilityID)) {
              discardedCards += 1;
            }
          }
        });
      }
      player.endOfTurn();
      player.drawCard(this.boardState);
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
    this.playingOutTurn = false;

    UIListeners.updatePlayerCommands(this.playerCommands, this.players);
    this.getTurnStatus();
  }

  debugSpeed() {
    this.TICK_DELAY = 40;
    this.DEBUG_SPEED = 2;
  }

  runRandomTester() {
    var boardState = new BoardState(this.boardSize);
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
