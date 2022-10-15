class AIDirector {
  constructor() {
    this.level = "1-1";
    this.levelDef = null;
  }

  extractWorld(level) {
    return level.split("-")[0];
  }

  extractStage(level) {
    return level.split("-")[1];
  }

  setLevel(level) {
    this.level = level;
  }

  loadLevelDef() {
    if (!this.levelDef) {
      let world = this.extractWorld(this.level);
      let stage = this.extractStage(this.level);
      this.levelDef = LevelDefs.getLevelDef(world, stage);
      NumbersBalancer.setPowerLevelBase(this.levelDef.getPowerLevel(world, stage));
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

  getFormationAndSpawnPointForTurn(boardState) {
    var formation = this.getFormationForTurn(boardState);
    if (formation === null) {
      return { spawnLocation: {x: 0, y: 0 }, formation: null };
    }

    return { spawnLocation: { x: 0, y: 0}, formation };
  }

  spawnForTurn(boardState) {
    if (boardState.wavesSpawned >= this.getWavesToSpawn()) {
      return;
    }
    const { spawnLocation, formation } = this.getFormationAndSpawnPointForTurn(boardState);

    if (formation === null) {
      return;
    }

    if (boardState.turn < boardState.lastSpawnTurn + formation.getSpawnDelay()) {
      return;
    }

    if (formation instanceof SkipSpawnFormation) {
      boardState.incrementWavesSpawned(this);
      return;
    }

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
    let levelDef = this.getLevelDef();
    if (levelDef && levelDef.initialSpawn) {
      for (let y = 0; y < levelDef.initialSpawn.length; y++) {
        for (let x = 0; x < levelDef.initialSpawn[y].length; x++) {
          var unitClass = levelDef.initialSpawn[y][x];
          if (!unitClass) { continue; }
          var newUnit = new unitClass(
            x * squareSize + squareSize / 2,
            y * squareHeight + squareHeight / 2,
            0
          );
          newUnit.doAbilityForecasting(boardState);
          boardState.addUnit(newUnit);
        }
      }
    } else {
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

    boardState.callOnAllUnits((unit) => {
      unit.doSpawnEffect(boardState);
    });

    boardState.callOnAllUnits((unit) => {
      unit.playSpawnEffectAtPct(boardState, 1);
      unit.moveTarget = null;
    });
  }

  endOfPhase(phase, boardState) {
    if (phase === TurnPhasesEnum.ENEMY_SPAWN) {
      this.setupBasicAttacks(boardState);
    }
  }

  setupBasicAttacks(boardState) {
    const NUM_ENEMIES_ATTACKING = 5;
    const basicAttackingEnemies = boardState.units.filter((unit) => 
      unit.canBasicAttack && unit.canBasicAttack()
    )

    const numUnitsToOrder = Math.min(basicAttackingEnemies.length, NUM_ENEMIES_ATTACKING);
    for (let i = 0; i < numUnitsToOrder; i++) {
      const index = Math.floor(boardState.getRandom() * basicAttackingEnemies.length);
      const orderedEnemy = basicAttackingEnemies.splice(index, 1);
      orderedEnemy[0].forecastBasicAttackAbility(boardState);
      orderedEnemy[0].addAbilityForecastsToStage(boardState, boardState.renderContainers.abilityForecasts);
    }
  }

  giveUnitsOrders(boardState) {
    boardState.sortUnitsByPosition();
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
