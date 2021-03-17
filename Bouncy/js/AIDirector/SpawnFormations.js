class SpawnFormation {
  constructor(boardState, totalWaves, waveDef) {
    this.boardState = boardState;
    this.totalWaves = totalWaves;
  }

  spawn() {
    const unitList = this.getSpawnList();
    for (var y = 0; y < unitList.length; y++) {
      for (var x = 0; x < unitList[y].length; x++) {
        if (unitList[y][x] !== null) {
          this.spawnUnitAtCoord(
            unitList[y][x],
            {x, y}
          );
        }
      }
    }
  }

  getSpawnList() {
    return [
      [UnitBasicDiamond, UnitShooter, UnitBasicSquare],
      [null, UnitKnight, null],
    ];
  }

  getBasicUnitSpawnWeights() {
    var wavesSpawned = this.boardState.getWavesSpawned();
    var pctDone = wavesSpawned / this.totalWaves;
    return [
      {weight: lerp(200, 100, pctDone), value: UnitBasicSquare},
      {weight: lerp(200, 100, pctDone), value: UnitBasicDiamond},
      {weight: triangle(0, 100, 50, pctDone), value: UnitFast},
      {weight: lerp(0, 100, pctDone), value: UnitShover},
      {weight: triangle(0, 0, 100, pctDone), value: UnitHeavy}
    ];
  }

  spawnUnitAtCoord(unitClass, spawnCoord) {
    this.spawnUnitAtLocation(unitClass,
      this.boardState.sectors.getPositionFromGrid(spawnCoord)
    );
  }

  spawnUnitAtLocation(unitClass, spawnPos) {
    var newUnit = new unitClass(spawnPos.x, spawnPos.y - Unit.UNIT_SIZE, 0);
    newUnit.setMoveTarget(spawnPos.x, spawnPos.y);
    this.boardState.addUnit(newUnit);
  }

  getSpawnDelay() {
    return 1;
  }
}

class UnitListSpawnFormation extends SpawnFormation {
  constructor(boardState, waveDef) {
    super(boardState, 1, waveDef);
    this.unitList = waveDef.units;
    this.unitsToSpawn = 0;
    this.unitList.forEach((unitData) => {
      this.unitsToSpawn += unitData.count;
    });
    this.isValidSpawn = null;
  }

  getSpawnList() {
    let spawnList = [];
    let validSpawnSpots = [];
    this.unitList.forEach((unitData) => {
      for (var i = 0; i < unitData.count; i++) {
        if (validSpawnSpots.length === 0) {
          spawnList.unshift([null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          validSpawnSpots = validSpawnSpots.concat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
        }

        var spawnPosIndex = Math.floor(this.boardState.getRandom() * validSpawnSpots.length);

        spawnList[0][validSpawnSpots.splice(spawnPosIndex, 1)[0]] = unitData.unit;
      }
    });
    console.log(spawnList);
    return spawnList;
  }

  getRandomSpawnLocation(validSpawnSpots) {
    var spawnPosIndex = Math.floor(this.boardState.getRandom() * validSpawnSpots.length);
    var spawnGridPos = validSpawnSpots.splice(spawnPosIndex, 1)[0];
    var spawnPos = this.boardState.sectors.getPositionFromGrid(
      spawnGridPos
    );

    return spawnPos;
  }

  getSpawnDelay() {
    return 1;
  }
}

class BasicUnitWaveSpawnFormation extends SpawnFormation {
  constructor(boardState, totalWaves, waveDef) {
    super(boardState, totalWaves, waveDef);

    if (waveDef.count) {
      this.unitsToSpawn = waveDef.count;
    } else {
      var pctDone = this.boardState.getWavesSpawned() / this.totalWaves;
      this.unitsToSpawn = this.boardState.sectors.columns
        - Math.floor((1 - pctDone) * 3) // 0-2
        - Math.floor(this.boardState.getRandom() * 3) // 0-2
        - 1
        ;
    }

    this.isValidSpawn = null;
  }

  spawn() {
    for (var i = 0; i < this.unitsToSpawn; i++) {
      var spawnPos = this.getRandomSpawnLocation();

      var spawnWeights = this.getBasicUnitSpawnWeights();
      var unitClass = getRandomFromWeightedList(this.boardState.getRandom(), spawnWeights);
      this.spawnUnitAtLocation(unitClass, spawnPos);
    }
  }

  getRandomSpawnLocation() {
    var spawnPos = this.boardState.sectors.getPositionFromGrid(
      { x: 0, y: 0 }
    );

    return spawnPos;
  }

  getSpawnDelay() {
    return 1;
  }
}

class AdvancedUnitWaveSpawnFormation extends BasicUnitWaveSpawnFormation {
  constructor(boardState, totalWaves, waveDef) {
    super(boardState, totalWaves, waveDef);
    this.advancedUnitsToSpawn = waveDef.advanced;
  }

  getAdvancedUnitSpawnWeights(unitsLeft) {
    let unitList = [
      {weight: 1, value: UnitShooter},
      {weight: 1, value: UnitBomber},
      {weight: 1, value: UnitKnight},
      {weight: 1, value: UnitProtector},
    ];

    if (unitsLeft > 1) {
      unitList.push({weight: 1, value: UnitBlocker});
    }

    return unitList;
  }

  calculateNumSpecialsToSpawn(unitClass) {
    if (this.advancedUnitsToSpawn !== null) {
      return this.advancedUnitsToSpawn.length;
    }
    var wavesSpawned = this.boardState.getWavesSpawned();
    var pctDone = wavesSpawned / this.totalWaves;

    switch (unitClass) {
      case UnitShooter:
        Math.floor(pctDone * 3) + 1;
        break;
      default:
        return Math.floor(pctDone) + 1;
    }
  }

  spawn() {
    const ADVANCED_UNITS_TO_SPAWN = this.calculateNumSpecialsToSpawn();
    this.unitsToSpawn -= ADVANCED_UNITS_TO_SPAWN;
    super.spawn();
    this.unitsToSpawn += ADVANCED_UNITS_TO_SPAWN;

    let i = 0;
    while (i < ADVANCED_UNITS_TO_SPAWN) {
      let unitClass;
      if (this.advancedUnitsToSpawn !== null && this.advancedUnitsToSpawn[i] !== null) {
        unitClass = this.advancedUnitsToSpawn[i];
      } else {
        var spawnWeights = this.getAdvancedUnitSpawnWeights(ADVANCED_UNITS_TO_SPAWN - i);
        unitClass = getRandomFromWeightedList(this.boardState.getRandom(), spawnWeights);
        if (unitClass == UnitBlocker) {
          this.spawnUnitAtLocation(unitClass, this.getRandomSpawnLocation());
          i += 1;
        }
      }

      this.spawnUnitAtLocation(unitClass, this.getRandomSpawnLocation());
      i += 1;
    }
  }
}

class UnitFormationSpawnFormation extends SpawnFormation {
  constructor(boardState, waveDef) {
    super(boardState, 0, waveDef);
    this.unitList = waveDef.units;
    this.spawnHeight = this.unitList.length;
    this.spawnWidth = 0;
    this.forceSpawn = waveDef.forceSpawn ? waveDef.forceSpawn : false;
    this.unitList.forEach((unitRow) => {
      this.spawnWidth = Math.max(this.spawnWidth, unitRow.length);
    });
  }

  getSpawnList() {
    return this.unitList;
  }

  getSpawnDelay() {
    return 1;
  }
}

class KnightAndShooterSpawnFormation extends SpawnFormation {
  constructor(boardState, totalWaves) {
    super(boardState, totalWaves, {});
    this.spawnWidth = 1;
    if (boardState.getWavesSpawned() > totalWaves * 0.5) {
      this.spawnWidth = 2;
    }
  }

  spawn() {
    for (var x = -this.spawnWidth; x <= this.spawnWidth; x++) {
      var spawnPos = this.boardState.sectors.getPositionFromGrid(
        {x, y}
      );
      if (this.spawnWidth == 2 && x == 0) {
        this.spawnUnitAtCoord(UnitProtector, {x, y});
      } else {
        this.spawnUnitAtCoord(UnitShooter, {x, y});
      }
      spawnPos.y += Unit.UNIT_SIZE;
      this.spawnUnitAtCoord(UnitKnight, {x, y: 1});
    }

    this.spawnUnitAtCoord(UnitHeavy, {x:  - (this.spawnWidth + 1), y});
    this.spawnUnitAtCoord(UnitHeavy, {x: (this.spawnWidth + 1), y});
    this.spawnUnitAtCoord(UnitHeavy, {x: - (this.spawnWidth + 1), y: 1});
    this.spawnUnitAtCoord(UnitHeavy, {x: (this.spawnWidth + 1), y: 1});

  }

  getSpawnDelay() {
    return 2;
  }
}

class SkipSpawnFormation extends SpawnFormation {

}

class SpawnFormationUtils {
  static isSpawnOutOfRange(boardState, topLeft, bottomRight) {
    if (
      topLeft.x > bottomRight.x || topLeft.y > bottomRight.y ||
      topLeft.x < 0 || bottomRight.x > boardState.sectors.columns
    ) {
      return true;
    }
    return false;
  }

  static isBoxClearForSpawn(boardState, topLeft, bottomRight) {
    if (SpawnFormationUtils.isSpawnOutOfRange(boardState, topLeft, bottomRight)) {
      return false;
    }

    for (var x = topLeft.x; x < bottomRight.x; x++) {
      for (var y = topLeft.y; y < bottomRight.y; y++) {
        var spot = Victor(x, y);
        if (!boardState.sectors.canUnitEnter(
          boardState, null,
          boardState.sectors.getPositionFromGrid(spot)
        )) {
          return false;
        }
      }
    }
    return true;
  }
}
