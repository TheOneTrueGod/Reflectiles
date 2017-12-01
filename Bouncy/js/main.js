/*
 * TODO;
 * Add google ads to the sides
 * Bomber should have a timer, after which he explodes.  This means that he can deal lots of damage from the top of the screen.
 * Make projectiles that can pass through the border walls based on gravity
 * The rain ability feels kinda shitty.  Make it bounce off the left and right walls.
 * Test out shrinking the enemies.
 * Invulnerable enemies that deal no damage as a wall
 * New enemy type -- infected.  When it dies, it explodes into a bunch of smaller minions.
 * New enemy -- Healer.  Heals other units.
 * New enemy -- protection pylons.  Creates a shield zone between the two that reflects bullets.
 * Enemy Tooltips
 * Have the knight throw up his shield to the left and right if the front is full.
 * Test out letting players move.
 * Add first boss -- He alternates between summoning a wave of goons, and attacking.
 * Fix the projectile bug on the shield ability
 * Highlight first player
 * Add a back button
 * Background of a person in a square
 * Make freeze spread across all shields.  They take double damage
 * Clarence Deck updates
 */
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

    //Create the renderer
    var mad = $('#missionActionDisplay');

    let canvasWidth = Math.floor(mad.width() / Unit.UNIT_SIZE) * Unit.UNIT_SIZE;
    let canvasHeight = Math.floor(mad.height() / Unit.UNIT_SIZE) * Unit.UNIT_SIZE;

    this.boardSize = {width: canvasWidth, height: canvasHeight}
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

    if (lastBoardState) {
      if (this.boardState.checkForDesync(lastBoardState)) {
        console.log(this.boardState.turn, lastBoardState.turn);
        alert("Desync");
        console.log("--------my board state--------", lastBoardState);
        console.log("--------server board state--------", this.boardState);
      }
    }

    var player_command_list = JSON.parse(gameData.player_commands);
    this.deserializePlayerCommands(player_command_list, true);
    return true;
  }

  deserializePlayerCommands(player_command_list, ignoreSelf = false) {
    this.removeAllPlayerCommands();
    this.playerCommands = [];
    var self = this;
    for (var player_id in player_command_list) {
      if (
        player_command_list.hasOwnProperty(player_id) &&
        (!ignoreSelf ||
          player_id != this.playerID ||
          !this.playerCommands[player_id]
        )
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

    this.checkForAutoEndTurn();

    UIListeners.updatePlayerCommands(player_command_list, this.players);
  }

  checkForAutoEndTurn() {
    if (!this.gameStarted || this.playingOutTurn || !this.isHost) { return; }
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
    AbilityDef.ABILITY_DEF_INDEX = 0;
    AbilityDef.abilityDefList = {};
    UnitBasic.createAbilityDefs();
    for (var key in player_data) {
      if (!player_data[key]) {
        continue;
      }
      num_players += 1;
      var playerData = JSON.parse(player_data[key]);
      var newPlayer = Player(playerData, key);
      this.players[key] = newPlayer;
    }
    NumbersBalancer.setNumPlayers(num_players);
  }

  gameNotStartedCallback(metaData) {
    this.updatePlayerData(metaData.player_data);
    UIListeners.setOtherDecks(metaData.other_decks);
    NumbersBalancer.setDifficulty(metaData.difficulty ? metaData.difficulty : NumbersBalancer.MEDIUM);
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
      UIListeners.showGameOverScreen(this.boardState.didPlayersWin(AIDirector));
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
    this.deserializePlayerCommands(player_command_list);
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
    this.boardState.loadState();
    $('#missionEndTurnButton').prop("disabled", true);
    ServerCalls.FinalizeTurn(this.boardState.turn, this, this.turnFinalizedOnServer);
  }

  turnFinalizedOnServer(data) {
    if (data.error || !data.player_commands) { return; }
    this.deserializePlayerCommands(
      $.parseJSON(data.player_commands)
    );
    // phases
    this.playOutTurn();
  }

  playOutTurn(currPhase) {
    if (this.playingOutTurn && !currPhase) { return; }
    if (!currPhase) {
      $('#gameContainer').addClass("turnPlaying");
      this.removeAllPlayerCommands();
    }

    this.playingOutTurn = true;
    if (currPhase) {
      this.boardState.endOfPhase(this.players, currPhase);
    }
    var phase = !!currPhase ?
      TurnPhasesEnum.getNextPhase(currPhase) :
      TurnPhasesEnum.PLAYER_ACTION_1;

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
      window.setTimeout(this.loopTicksForPhase.bind(this, phase), this.TICK_DELAY);
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
    if (abilityIndex !== null) {
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
        )
      );
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
      UIListeners.showGameOverScreen(this.boardState.didPlayersWin(AIDirector));
    }

    this.boardState.incrementTurn(this.players);
    this.boardState.saveState();
    if (this.isHost) {
      ServerCalls.SetBoardStateAtStartOfTurn(this.boardState, this, AIDirector);
    } else {
      $('#gameContainer').addClass("turnPlaying");
      this.resyncAtTurnEnd();
    }
    this.removeAllPlayerCommands();
    this.playerCommands = [];
    this.isFinalized = false;
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
