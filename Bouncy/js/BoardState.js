const EMERGENCY_BREAK_TIME = 200;
const EFFECT_TICK_DELAY = 20;

const DO_TURNS_SIMULTANEOUSLY = true;
const SIMULTANEOUS_DELAY = 50;

class BoardState {
  constructor(boardSize, stage, boardState) {
    this.boardSize = boardSize;

    this.stage = stage;

    this.borderWalls = [
      new BorderWallLine(0, -this.boardSize.height, 0, this.boardSize.height * 2,  BorderWallLine.LEFT),
      new BorderWallLine(-this.boardSize.width, 0, this.boardSize.width * 2, 0,  BorderWallLine.TOP),
      new BorderWallLine(this.boardSize.width, this.boardSize.height * 2, this.boardSize.width, -this.boardSize.height,  BorderWallLine.RIGHT),
      new BorderWallLine(-this.boardSize.width, this.boardSize.height, this.boardSize.width * 2, this.boardSize.height, BorderWallLine.BOTTOM),
    ];
    this.playerCastPoints = [];
    this.effects = [];

    this.boardStateAtStartOfTurn = null;
    this.lastSpawnTurn = 0;

    this.gameStats = new GameStats();

    var columns = Math.floor(this.boardSize.width / Unit.UNIT_SIZE);
    var rows = Math.floor(this.boardSize.height / Unit.UNIT_SIZE);
    this.sectors = new UnitSectors(rows, columns, this.boardSize.width, this.boardSize.height);

    this.reset();
    this.deserialize(boardState);

    this.projectiles = [];
    this.unitsToSpawn = new UnitsToSpawn();

    this.noActionKillLimit = 0;
    this.currPhase = null;

    this.runEffectTicks();
  }

  storeRandomSeeds() {
    this.storedRandomSeeds = { ...this.randomSeeds };
  }

  recoverRandomSeeds() {
    if (!this.storedRandomSeeds) { throw new Error("Trying to recover random seeds when they weren't saved."); }
    this.randomSeeds = { ...this.storedRandomSeeds };
  }

  getRandom(seedType = BoardState.RNG_TYPES.DEFAULT) {
    if (this.randomSeeds[seedType] === undefined) {
      throw new Error(`Trying to get invalid random seed: ${seedType}`);
    }
    var max_value = 6781335567;
    var large_prime = 18485345523457;
    var toRet = (this.randomSeeds[seedType] + large_prime) % max_value;
    this.randomSeeds[seedType] += toRet;
    return toRet / max_value;
  }

  reset() {
    this.units = [];
    this.projectiles = [];
    this.sectors.reset();
    this.gameStats.reset();
    this.turn = 1;
    this.tick = 0;
    this.UNIT_ID_INDEX = 1;
    var health = NumbersBalancer.getPlayerStat(
      NumbersBalancer.PLAYER_STATS.PLAYER_HEALTH
    );
    this.teamHealth = [health, health];
    this.wavesSpawned = 0;
    this.enemyUnitCount = 0;
    this.resetRandomSeeds();
    this.resetNoActionKillSwitch();
  }

  sortUnitsByPosition() {
    this.units.sort((unit, unit2) => {
      if (unit.y !== unit2.y) {
        return unit.y < unit2.y ? 1 : -1;
      }

      // They have the same Y
      if (unit.x !== unit2.x) {
        return unit.x < unit2.x ? 1 : -1;
      }

      // They have the same Y and X.
      if (unit.sortIndex !== unit.sortIndex) {
        return unit.sortIndex < unit2.sortIndex ? 1 : -1;
      }

      // They have the same Y, X, and sortIndex.
      return unit.id < unit2.id ? 1 : -1;
    });
  }

  resetStage() {
    while(this.stage.children.length > 0){
      this.stage.removeChild(
        this.stage.getChildAt(0)
      );
    }
  }

  resetRandomSeeds() {
    this.randomSeeds = {
      [BoardState.RNG_TYPES.DEFAULT]: Math.floor(Math.random() * 4432561237),
      [BoardState.RNG_TYPES.SPAWN]: Math.floor(Math.random() * 4432561237),
    };
  }

  deserialize(boardState) {
    if (!boardState) { return; }
    if (boardState.game_stats) { this.gameStats.load(boardState.game_stats); }
    if (boardState.turn) { this.turn = boardState.turn; }
    if (boardState.tick) { this.tick = boardState.tick; }
    if (boardState.unit_id_index) { this.UNIT_ID_INDEX = boardState.unit_id_index; }
    if (boardState.team_health) { this.teamHealth = boardState.team_health; }
    if (boardState.waves_spawned) { this.wavesSpawned = boardState.waves_spawned; }
    if (boardState.units_to_spawn) {
      this.unitsToSpawn = UnitsToSpawn.deserialize(boardState.units_to_spawn);
    }
    if (boardState.last_spawn_turn) { this.lastSpawnTurn = boardState.last_spawn_turn; }
    if (boardState.random_seeds) {
      this.randomSeeds = { ...boardState.random_seeds };
    } else {
      this.resetRandomSeeds();
    }
    if (boardState.player_data) {
      this.deserializePlayerData(boardState.player_data);
    }
  }

  saveState() {
    this.boardStateAtStartOfTurn = this.serializeBoardState();
  }

  loadState() {
    this.reset();
    this.resetStage();

    this.deserialize(this.boardStateAtStartOfTurn);
    if (this.boardStateAtStartOfTurn.units) {
      this.loadUnits(this.boardStateAtStartOfTurn.units);
    }
    UIListeners.updateTeamHealth(this.teamHealth[0], this.teamHealth[1]);
  }

  loadUnits(serverData) {
    for (var i = 0; i < serverData.length; i++) {
      var unitData = serverData[i];
      var newUnit = Unit.loadFromServerData(unitData);
      this.addUnit(newUnit);
    }
    UIListeners.refreshAbilityDisplay();
  }

  addInitialPlayers(players) {
    var numPlayers = 0;
    for (var key in players) { numPlayers += 1; }
    var playerGap = this.boardSize.width / numPlayers;
    var playerOn = 0;
    for (var key in players) {
      var player = players[key];
      var newCore = new UnitCore(
        playerGap / 2 + playerOn * playerGap,
        this.boardSize.height - 20,
        player.getUserID()
      );
      this.addUnit(newCore);
      playerOn += 1;
    }
  }

  endPhase() {
    this.tick = 0;

    var i = 0;
    while (i < this.projectiles.length) {
      if (true) {
        this.projectiles[i].removeFromStage(this.stage);
        this.projectiles.splice(i, 1);
      } else {
        i ++;
      }
    }
  }

  incrementTurn(players) {
    this.turn += 1;
    UIListeners.updatePlayerStatus(this, players);
  }

  resetNoActionKillSwitch() {
    this.noActionKillLimit = 0;
  }

  serializeBoardState() {
    return {
      'units': this.units.map(function (unit) { return unit.serialize() }),
      'turn': this.turn,
      'tick': this.tick,
      'random_seeds': { ...this.randomSeeds },
      'unit_id_index': this.UNIT_ID_INDEX,
      'team_health': this.teamHealth,
      'waves_spawned': this.wavesSpawned,
      'player_data': this.serializePlayerData(),
      'units_to_spawn': this.unitsToSpawn.serializeData(),
      'last_spawn_turn': this.lastSpawnTurn,
      'game_stats': this.gameStats.serialize(),
    };
  }

  serializePlayerData() {
    var player_data = {};
    for (var key in MainGame.players) {
      var player = MainGame.players[key];
      player_data[key] = player.serializeData();
    }
    return player_data;
  }

  deserializePlayerData(dataJSON) {
    for (var key in MainGame.players) {
      var player = MainGame.players[key];
      if (key in dataJSON) {
        player.deserializeData(dataJSON[key]);
      }
    }
  }

  getUnitID() {
    this.UNIT_ID_INDEX += 1;
    return this.UNIT_ID_INDEX - 1;
  }

  isEnemyUnit(unit) {
    if (unit instanceof UnitCore) {
      return false;
    }

    if (unit instanceof Turret) {
      return false;
    }

    if ((unit instanceof ZoneEffect) && unit.owningPlayerID !== 'enemy') {
      return false;
    }

    return true;
  }

  addUnit(unit) {
    if (unit instanceof UnitCore) {
      this.playerCastPoints[unit.owner] = unit;
    } else {
      this.sectors.addUnit(unit);
    }
    if (this.isEnemyUnit(unit) && unit.isRealUnit()) {
      this.enemyUnitCount += 1;
    }
    unit.addToStage(this.stage);
    this.units.push(unit);
  }

  findUnit(unitID) {
    for (var i = 0; i < this.units.length; i++) {
      if (this.units[i].id == unitID) {
        return this.units[i];
      }
    }
    return null;
  }

  canUnitsSpawnAtCoord(spawningUnits, column, row) {
    var existingUnits = this.sectors.getUnitsAtGridSquare(column, row).map(unitIndex => this.findUnit(unitIndex));
    return !this.doUnitsBlockEachOther(spawningUnits, existingUnits);
  }

  unitEntering(unit, target) {
    var unitsInSector = this.sectors.getUnitsAtPosition(target.x, target.y);
    var allowUnitThrough = true;
    for (var i = 0; i < unitsInSector.length; i++) {
      if (unit.id !== unitsInSector[i]) {
        var occupyingUnit = this.findUnit(unitsInSector[i]);
        allowUnitThrough = allowUnitThrough && occupyingUnit.otherUnitEntering(this, unit);
      }
    }

    for (var player_id in this.playerCastPoints) {
      let castPointCoord = this.sectors.getGridCoord(this.playerCastPoints[player_id]);
      let targetCoord = this.sectors.getGridCoord(target);
      if (castPointCoord.x == targetCoord.x && castPointCoord.y == targetCoord.y) {
        this.playerCastPoints[player_id].touchedByEnemy(this, unit);
      }
    }

    return allowUnitThrough;
  }

  unitLeaving(unit, target) {
    var unitsInSector = this.sectors.getUnitsAtPosition(target.x, target.y);
    var allowUnitThrough = true;
    for (var i = 0; i < unitsInSector.length; i++) {
      if (unit.id !== unitsInSector[i]) {
        var occupyingUnit = this.findUnit(unitsInSector[i]);
        allowUnitThrough = allowUnitThrough && occupyingUnit.otherUnitLeaving(this, unit);
      }
    }
    return allowUnitThrough;
  }

  getPlayerUnitsAtPosition(position) {
    const positionCoord = this.sectors.getGridCoord(position);
    let playerUnits = [];
    for (var key in this.playerCastPoints) {
      var playerCoord = this.sectors.getGridCoord(this.playerCastPoints[key]);
      if (positionCoord.x == playerCoord.x && positionCoord.y == playerCoord.y) {
        playerUnits.push(this.playerCastPoints[key]);
      }
    }
    return playerUnits;
  }

  getAllUnitsByCondition(conditionFunction) {
    var toReturn = [];
    for (var unit in this.units) {
      if (conditionFunction(this.units[unit])) {
        toReturn.push(this.units[unit]);
      }
    }
    return toReturn;
  }

  callOnAllUnits(funcToCall) {
    var toReturn = [];
    for (var unit in this.units) {
      if (funcToCall(this.units[unit])) {
        toReturn.push(unit);
      }
    }
    return toReturn;
  }

  getAllPlayerUnits() {
    return this.playerCastPoints;
  }

  getPlayerUnit(playerID) {
    if (playerID in this.playerCastPoints) {
      return this.playerCastPoints[playerID];
    }
  }

  getPlayerCastPoint(playerID, turnPhase, usePreviews) {
    usePreviews = (usePreviews === undefined) ? false : usePreviews;
    if (playerID in this.playerCastPoints) {
      let castPoint = {
        x: this.playerCastPoints[playerID].x,
        y: this.playerCastPoints[playerID].y
      };

      if (!MainGame.playerCommands[playerID]) {
        return castPoint;
      }
      return MainGame.playerCommands[playerID].getCastPoint(castPoint, this.currPhase, turnPhase, usePreviews);
    }

    throw new Error(
      "Trying to get a player Cast Point for a player that doesn't exist. " +
      "Player ID: [" + playerID + "] " +
      "Cast Points: [" + this.playerCastPoints + "]"
    );
  }

  getSimultaneousDelay(phase) {
    if (phase == TurnPhasesEnum.PLAYER_MINOR) {
      return 20;
    }

    return SIMULTANEOUS_DELAY;
  }

  getOffsetTickForPlayer(phase, commands, playerID, players) {
    var playerTurns = this.getTurnOrderByPlayerIDs(commands, playerID, players)
    if (playerID in playerTurns) {
      return this.tick - playerTurns[playerID] * this.getSimultaneousDelay(phase);
    }
    return this.tick;
  }

  atEndOfPhase(players, playerCommands, phase) {
    /*if (this.noActionKillLimit > EMERGENCY_BREAK_TIME) {
      return true;
    }*/

    if (this.projectiles.length > 0) {
      return false;
    }

    for (var i = 0; i < this.units.length; i++) {
      if (!this.units[i].isFinishedDoingAction(this, phase)) {
        return false;
      }
    }

    if (TurnPhasesEnum.isPlayerCommandPhase(phase)) {
      var commands = this.getPlayerActionsInPhase(players, playerCommands, phase);

      if (commands) {
        for (var i = 0; i < commands.length; i++) {
          if (commands[i] && !commands[i].hasFinishedDoingEffect(
            this.getOffsetTickForPlayer(phase, commands, commands[i].playerID, players))
          ) {
            return false;
          }
        }
      }
    }

    if (phase === TurnPhasesEnum.END_OF_TURN) {
      UIListeners.updateSpawnPreview(this);
    }

    return true;
  }

  startOfPhase(phase) {
    this.resetNoActionKillSwitch();
    for (var unit in this.units) {
      this.units[unit].startOfPhase(this, phase);
    }
    this.currPhase = phase;
    if (phase === TurnPhasesEnum.ENEMY_SPAWN) {
      UIListeners.hideSpawnPreview();
    }
    if (phase === TurnPhasesEnum.END_OF_TURN) {
      UIListeners.showSpawnPreview();
      UIListeners.updateSpawnPreview(this);
    }
    this.doDeleteChecks();
  }

  endOfPhase(players, phase) {
    this.resetNoActionKillSwitch();
    for (var unit in this.units) {
      this.units[unit].endOfPhase(this, phase);
    }
    this.doDeleteChecks();
  }

  doDeleteChecks() {
    var i = 0;
    while (i < this.units.length) {
      if (this.units[i].readyToDelete()) {
        EffectFactory.createUnitDyingEffect(this, this.units[i]);
        this.units[i].onDelete(this);
        this.units[i].removeFromStage();
        this.sectors.removeUnit(this.units[i]);
        if (this.isEnemyUnit(this.units[i]) && this.units[i].isRealUnit()) {
          this.enemyUnitCount -= 1;
        }
        let dyingUnit = this.units[i];
        this.units.splice(i, 1);
        if (dyingUnit.isRealUnit()) {
          for (var j = 0; j < this.units.length; j++) {
            if (!this.units[j].onUnitDying(this, dyingUnit)) {
              break;
            }
          }
        }
      } else {
        i ++;
      }
    }
  }

  doUnitActions() {
    for (var unit in this.units) {
      this.units[unit].doUnitActions(this);
    }

    this.doDeleteChecks();
  }

  // startSquare: { x, y }
  // direction: { x, y }.  Must be unit vectors.
  forceShoveUnitFromSquare(enteringUnitList, startSquare, direction) {
    if (
      direction.x !== 1 && direction.x !== -1 && 
      direction.y !== 1 && direction.y !== -1 &&
      Math.abs(direction.x) + Math.abs(direction.y) !== 1
    ) {
      throw new Error(`Can't shove in a non unit-direction.  direction: ${direction}`);
    }
    let enteringUnits = [...enteringUnitList];

    const shoveList = [];
    let exitCondition = false;
    let i = 0;
    while (!exitCondition) {
      if (shoveList.length) {
        enteringUnits = shoveList[shoveList.length - 1].unitsInSquare;
      }

      const currentSquare = { 
        x: startSquare.x + direction.x * i,
        y: startSquare.y + direction.y * i
      };
      let unitsInSquare = this.sectors.getUnitsAtGridSquare(currentSquare.x, currentSquare.y).map((unitId) => this.findUnit(unitId));
      if (!unitsInSquare.length) {
        exitCondition = 'empty';
      } else if (this.doUnitsPreventEntry(enteringUnits, unitsInSquare)) {
        // The units in this square either can't be shoved, or they block movement.
        // Let's figure out which one
        if (unitsInSquare.some(unit => !unit.canBeShoved())) {
          // There's a unit that can't be shoved.
          // Slide the previously moving units past it.
          if (shoveList.length) {
            shoveList[shoveList.length - 1].shoveBy += 1;
          }
        } else {
          // None of these units can't be shoved.  Shove them.
          shoveList.push({ unitsInSquare, shoveBy: 1 });
        }
        // the previously entering units need to move their target down a bit.
      } else {
        // The units in the square don't block the existing units.
        exitCondition = 'empty';
      }

      if (i >= 30) {
        throw new Error("{i} just keeps on going...");
        exitCondition = 'error';
      }
      i += 1;
    }
    
    for (let i = shoveList.length - 1; i >= 0; i--) {
      shoveList[i].unitsInSquare.forEach((unit) => {
        var currPos = unit.getCurrentPosition();

        var targetPos = { 
          x: currPos.x + Unit.UNIT_SIZE * shoveList[i].shoveBy * direction.x,
          y: currPos.y + Unit.UNIT_SIZE * shoveList[i].shoveBy * direction.y
        };
        unit.moveToPosition(this, targetPos);
      })
    }
    return true;
  }

  doUnitsBlockEachOther(movingUnits, existingUnits) {
    for (let j = 0; j < existingUnits.length; j++) {
      if (existingUnits[j].canBeShoved()) {
        // It can be shoved, so it doesn't block
        continue;
      }
      for (let i = 0; i < movingUnits.length; i++) {
        if (
          existingUnits[j].preventsUnitEntry(movingUnits[i]) &&
          movingUnits[i].preventsUnitEntry(existingUnits[j])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  doUnitsPreventEntry(movingUnits, existingUnits) {
    for (let j = 0; j < existingUnits.length; j++) {
      for (let i = 0; i < movingUnits.length; i++) {
        if (
          existingUnits[j].preventsUnitEntry(movingUnits[i]) &&
          movingUnits[i].preventsUnitEntry(existingUnits[j])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  runTick(players, playerCommands, phase) {
    this.runUnitTicks(phase);

    this.runProjectileTicks();

    this.doPlayerActions(players, playerCommands, phase);

    this.tick += 1;
    this.noActionKillLimit += 1;
  }

  runUnitTicks(phase) {
    for (var unit in this.units) {
      this.units[unit].runTick(this, phase);
    }

    this.doDeleteChecks();
  }

  runProjectileTicks() {
    for (var projectile in this.projectiles) {
      this.projectiles[projectile].runTick(
        this, this.boardSize.width, this.boardSize.height
      );
    }
    var i = 0;
    while (i < this.projectiles.length) {
      if (this.projectiles[i].readyToDelete()) {
        this.projectiles[i].removeFromStage(this.stage);
        this.projectiles.splice(i, 1);
      } else {
        i ++;
      }
    }
  }

  runEffectTicks() {
    for (var effect in this.effects) {
      this.effects[effect].runTick(
        this, this.boardSize.width, this.boardSize.height
      );
    }

    var i = 0;
    while (i < this.effects.length) {
      if (this.effects[i].readyToDelete()) {
        this.effects[i].removeFromStage(this.stage);
        this.effects.splice(i, 1);
      } else {
        i ++;
      }
    }
    window.setTimeout(this.runEffectTicks.bind(this), EFFECT_TICK_DELAY);
  }

  getTurnOrder(players) {
    var player_order = [];
    for (var i = 0; i < players.length; i++) {
      player_order.push((parseInt(players[i].player_index) + this.turn - 1) % players.length);
    }
    return player_order;
  }

  getAllPlayerActions(players, playerCommands, filterFunction) {
    var commands = [];
    for (var key in players) {
      var pc = playerCommands[players[key].getUserID()];
      if (pc) {
        commands = commands.concat(pc.getCommands().filter(filterFunction));
      }
    }
    return commands;
  }

  getPlayerActionsInPhase(players, playerCommands, phase) {
    if (phase == TurnPhasesEnum.PLAYER_PRE_MINOR) {
      return this.getAllPlayerActions(players, playerCommands, (command) => {
        return command.getCommandPhase() == TurnPhasesEnum.PLAYER_PRE_MINOR;
      });
    }
    if (phase == TurnPhasesEnum.PLAYER_MINOR) {
      return this.getAllPlayerActions(players, playerCommands, (command) => {
        return command.getCommandPhase() == TurnPhasesEnum.PLAYER_MINOR;
      });
    }
    if (phase === TurnPhasesEnum.PLAYER_ACTION) {
      return this.getAllPlayerActions(players, playerCommands, (command) => {
        return command.getCommandPhase() == TurnPhasesEnum.PLAYER_ACTION;
      });
    }
    return null;
  }

  getTurnOrderByPlayerIDs(playerCommands, playerID, players) {
    var turnOrder = this.getTurnOrder(players);
    var playerTurnOrder = {};
    var playersAssigned = 0;
    for (var i = 0; i < turnOrder.length; i++) {
      var currPlayer = players[turnOrder[i]];
      if (currPlayer) {
        var commandByPlayer = playerCommands.find((command) => { return command.playerID === currPlayer.user_id});
        if (commandByPlayer) {
          playerTurnOrder[players[turnOrder[i]].getUserID()] = playersAssigned;
          playersAssigned += 1;
        }
      }
    }
    return playerTurnOrder;
  }

  doPlayerActions(players, playerCommands, phase) {
    var commands = this.getPlayerActionsInPhase(players, playerCommands, phase);

    if (commands) {
      for (var i = 0; i < commands.length; i++) {
        var command = commands[i];
        if (command) {
          command.doActionOnTick(
            this.getOffsetTickForPlayer(phase, commands, commands[i].playerID, players),
            this
          );
        }
      }
    }
  }

  addProjectile(projectile) {
    projectile.addToStage(this.stage);
    this.projectiles.push(projectile);
    if (!(projectile instanceof Effect)) {
      let unitsAtPos =
        this.sectors.getUnitsAtPosition(projectile.x, projectile.y);
      unitsAtPos.forEach((unitID) => {
        let unit = this.findUnit(unitID);
        if (unit instanceof ZoneEffect) {
          unit.triggerHit(this, unit, null, projectile);
        }
      });
    }
  }

  addEffect(effect) {
    effect.addToStage(this.stage);
  }

  getGameWalls() {
    return this.borderWalls.slice(0);
  }

  getUnitThreshold() {
    return this.boardSize.height - Unit.UNIT_SIZE * 1.4;
  }

  getMaxColumn() {
    return this.sectors.columns - 1;
  }

  dealDamage(amount) {
    this.teamHealth[0] = Math.max(this.teamHealth[0] - amount, 0);
    UIListeners.updateTeamHealth(this.teamHealth[0], this.teamHealth[1]);
  }

  isGameOver(aiDirector) {
    if (this.teamHealth[0] <= 0) { // Players Lost
      return true;
    }

    if (
      this.enemyUnitCount <= 0 &&
      this.wavesSpawned >= aiDirector.getWavesToSpawn()
    ) {
      return true;
    }

    return false;
  }

  didPlayersWin(aiDirector) {
    if (this.teamHealth[0] <= 0) {
      return false;
    }
    if (
      this.enemyUnitCount <= 0 &&
      this.wavesSpawned >= aiDirector.getWavesToSpawn()
    ) {
      return true;
    }

    return false;
  }

  getWavesSpawned() {
    return this.wavesSpawned;
  }

  addWavesSpawned(waves) {
    this.wavesSpawned += waves;
  }

  incrementWavesSpawned(aiDirector) {
    this.wavesSpawned += 1;
    this.lastSpawnTurn = this.turn;
    this.updateWavesSpawnedUI(aiDirector);
  }

  updateWavesSpawnedUI(aiDirector) {
    UIListeners.updateGameProgress(aiDirector.getGameProgress(this));
  }

  checkForDesync(otherBoardState) {
    let rngTypes = Object.keys(BoardState.RNG_TYPES);
    for (let i = 0; i < rngTypes.length; i++) {
      const rngType = BoardState.RNG_TYPES[rngTypes[i]];
      if (
        otherBoardState.randomSeeds[BoardState.RNG_TYPES[rngType]] !== 
        this.randomSeeds[BoardState.RNG_TYPES[rngType]]
      ) {
        console.warn("Desync due to random seed mismatch.  Server: [" + this.randomSeeds + "] Client: [" + otherBoardState.randomSeeds + "]");
        return "Random Seed Mismatch";
      }
    };

    if (otherBoardState.units.length != this.units.length) {
      console.warn("Desync due to different unit count.  Server: [" + this.units.length + "] Client: [" + otherBoardState.units.length + "]");
      return "Different Unit Count";
    }
    for (var i = 0; i < this.units.length; i++) {
      var myUnit = this.units[i];
      var serverUnit = otherBoardState.units[i];
      if (serverUnit.constructor.name !== myUnit.constructor.name) {
        console.warn("Desync due to different unit type.  Index: [" + i + "] Server: [" + serverUnit.constructor.name + "] Client: [" + myUnit.constructor.name + "]");
        return "Different Unit Type";
      }

      if (serverUnit.health.current !== myUnit.health.current) {
        console.warn("Desync due to different unit health.  Index: [" + i + "] Server: [" + serverUnit.health.current + "] Client: [" + myUnit.health.current + "]");
        return "Different Unit Health";
      }

      if (serverUnit.x !== myUnit.x || serverUnit.y !== myUnit.y) {
        console.warn("Desync due to different unit position.  Index: [" + i +
          "] Server: [" + serverUnit.x + ", " + serverUnit.y +
          "] Client: ["  + myUnit.x + ", " + myUnit.y + "]");
        return "Different Unit Position";
      }
    }
    return false;
  }
}

BoardState.RNG_TYPES = {
  DEFAULT: 'default',
  SPAWN: 'spawn',
};
