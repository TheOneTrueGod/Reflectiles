class AIDirector {
  constructor() {
    this.level = "1-1";
    this.levelDef = null;
  }

  setLevel(level) {
    this.level = level;
  }

  loadLevelDef() {
    if (!this.levelDef) {
      this.levelDef = LevelDefs.getLevelDef(this.level);
    }
  }

  getLevelDef() {
    if (!this.levelDef) { this.loadLevelDef(); }

    return this.levelDef;
  }

  getFormationForTurn(boardState) {
    let spawnFormation = this.getLevelDef().getSpawnFormation(boardState);
    return spawnFormation;
    if (
      boardState.getWavesSpawned() / this.getWavesToSpawn() == 0.5 ||
      boardState.getWavesSpawned() == this.getWavesToSpawn() - 1
    ) {
      return new KnightAndShooterSpawnFormation(boardState, this.getWavesToSpawn());
    }
    if (boardState.getWavesSpawned() % 2 == 0) {
      return new AdvancedUnitWaveSpawnFormation(boardState, this.getWavesToSpawn());
    }
    return new BasicUnitWaveSpawnFormation(boardState, this.getWavesToSpawn());
  }

  spawnForTurn(boardState) {
    if (boardState.wavesSpawned >= this.getWavesToSpawn()) {
      return;
    }

    var formation = this.getFormationForTurn(boardState);
    if (formation === null) { return; }
    if (boardState.turn < boardState.lastSpawnTurn + formation.getSpawnDelay()) {
      return;
    }

    var validSpawnSpots = [];
    for (var x = 0; x < boardState.sectors.columns; x++) {
      var targ = new Victor(x, 0);
      if (formation.isValidSpawnSpot(targ)) {
        validSpawnSpots.push(targ);
      }
    }

    if (validSpawnSpots.length <= 0) {
      return;
    }
    var index = Math.floor(boardState.getRandom() * validSpawnSpots.length);
    var spawnLocation = validSpawnSpots[index];

    formation.spawn(spawnLocation);
    boardState.incrementWavesSpawned(this);
  }

  tryToSpawn(boardState, position, triedShoving) {
    const HORIZONTAL_SQUARES = boardState.sectors.columns;
    const squareSize = boardState.boardSize.width / HORIZONTAL_SQUARES;
    const squareHeight = Unit.UNIT_SIZE;

    if (position.x < 0 || position.x >= HORIZONTAL_SQUARES * squareSize) {
      return false;
    }

    if (
      boardState.sectors.getUnitsAtPosition(position.x, position.y).length > 0
    ) {
      if (position.y > squareHeight) {
        return this.tryToSpawn(
          boardState,
          {x: position.x, y: position.y - squareHeight}
        );
      } else if (!triedShoving) {
        // TODO: Try this later
        //boardState.shoveUnits({x: position.x, y: position.y}, {x: 0, y: 1});
        /*return this.tryToSpawn(
          boardState,
          {x: position.x, y: position.y},
          true
        );*/
      }

      return false;
    }

    var pctDone = boardState.getWavesSpawned() / this.getWavesToSpawn();
    var spawnWeights = [
      {weight: lerp(200, 100, pctDone), value: UnitBasicSquare},
      {weight: lerp(200, 100, pctDone), value: UnitBasicDiamond},
      {weight: triangle(0, 100, 50, pctDone), value: UnitFast},
      {weight: lerp(0, 100, pctDone), value: UnitHeavy},
      {weight: triangle(0, 100, 50, pctDone), value: UnitShover},
      {weight: triangle(0, 10, 50, pctDone), value: UnitShooter},
      {weight: triangle(0, 0, 25, pctDone), value: UnitBomber},
      {weight: triangle(0, 0, 25, pctDone), value: UnitKnight},
      {weight: triangle(0, 0, 25, pctDone), value: UnitProtector},
    ];
    var unitClass = getRandomFromWeightedList(boardState.getRandom(), spawnWeights);

    var newUnit = new unitClass(position.x, position.y - squareHeight * 2, 0);
    newUnit.setMoveTarget(position.x, position.y);
    boardState.addUnit(newUnit);
    return true;
  }

  getWavesToSpawn() {
    return this.getLevelDef().totalWaves;
  }

  getGameProgress(boardState) {
    return this.getLevelDef().getGameProgress(boardState);
  }

  createInitialUnits(boardState) {
    const INITIAL_ROWS = 4;
    const HORIZONTAL_SQUARES = boardState.sectors.columns;
    const squareSize = boardState.boardSize.width / HORIZONTAL_SQUARES;
    const squareHeight = Unit.UNIT_SIZE;

    for (var y = INITIAL_ROWS - 1; y >= 0; y--) {
      for (var x = 0; x < HORIZONTAL_SQUARES; x++) {
        var shouldSpawn = boardState.getRandom() <= 0.3;
        if (!shouldSpawn) { continue; }

        var unitClass = UnitBasicSquare;
        var newUnit = new unitClass(
          x * squareSize + squareSize / 2,
          y * squareHeight + squareHeight / 2,
          0
        );
        boardState.addUnit(newUnit);
      }
    }
  }

  giveUnitsOrders(boardState) {
    boardState.units.sort((unit, unit2) => {
      return unit.y < unit2.y ? 1 : -1;
    });
    for (var i = 0; i < boardState.units.length; i++) {
      var unit = boardState.units[i];
      if (!(unit instanceof UnitCore)) {
        unit.doMovement(boardState);
      }
    }
  }

  levelComplete(boardState) {
    return boardState.wavesSpawned > this.getWavesToSpawn();
  }
}

AIDirector = new AIDirector();
