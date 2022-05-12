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
          this.spawnUnitAtCoord(unitList[y][x], { x, y });
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

  spawnUnitAtCoord(unitClass, targetCoord) {
    var spawningUnit = new unitClass(0, 0, 0);
    let spawnCoord = { x: targetCoord.x, y: targetCoord.y };
    while (!this.boardState.canUnitsSpawnAtCoord([spawningUnit], spawnCoord.x, spawnCoord.y)) {
      spawnCoord.y += 1;
    }

    if (!this.tryToShoveUnitsOutOfWay(unitClass, spawnCoord)) {
      throw new Error("failed spawning!");
    }

    let spawnPos = this.boardState.sectors.getPositionFromGrid(spawnCoord);

    var newUnit = new unitClass(spawnPos.x, targetCoord.y - Unit.UNIT_SIZE, 0);
    const newUnitSize = newUnit.getSize();
    newUnit.setMoveTarget(spawnPos.x, spawnPos.y + newUnitSize.top * Unit.UNIT_SIZE);
    this.boardState.addUnit(newUnit);
  }

  tryToShoveUnitsOutOfWay(unitClass, spawnCoord) {
    const spawnPos = this.boardState.sectors.getPositionFromGrid(spawnCoord);
    const newUnit = new unitClass(spawnPos.x, - Unit.UNIT_SIZE, 0);
    const newUnitSize = newUnit.getSize();

    let unableToShove = false;
    for (let xOffset = -newUnitSize.left; xOffset <= newUnitSize.right; xOffset ++) {
      for (let shoveTimes = 0; shoveTimes < newUnitSize.top + newUnitSize.bottom + 1; shoveTimes += 1) {
        if (
          !this.boardState.forceShoveUnitFromSquare([newUnit], { x: spawnCoord.x + xOffset, y: spawnCoord.y + shoveTimes}, { x: 0, y: 1 })
        ) {
          unableToShove = true;
        }
      }
    }
    // Should only happen if two bosses try to spawn on top of each other
    if (unableToShove) {
      console.log("WARNING: TRYING TO SPAWN TWO BOSSES ON TOP OF EACH OTHER");
    }
    return !unableToShove;
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
          spawnList.push([null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
          validSpawnSpots = validSpawnSpots.concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
        }
        
        var spawnPosIndex = Math.floor(this.boardState.getRandom(this.boardState.constructor.RNG_TYPES.SPAWN) * validSpawnSpots.length);

        spawnList[spawnList.length - 1][validSpawnSpots.splice(spawnPosIndex, 1)[0]] = unitData.unit;
      }
    });
    return spawnList;
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
        - Math.floor(this.boardState.getRandom(BoardState.RNG_TYPES.SPAWN) * 3) // 0-2
        - 1
        ;
    }

    this.isValidSpawn = null;
  }

  getSpawnList() {
    let spawnList = [];
    let validSpawnSpots = [];
    for (var i = 0; i < this.unitsToSpawn; i++) {
      if (validSpawnSpots.length === 0) {
        spawnList.push([null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
        validSpawnSpots = validSpawnSpots.concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
      }
      var spawnPosIndex = Math.floor(this.boardState.getRandom(this.boardState.constructor.RNG_TYPES.SPAWN) * validSpawnSpots.length);

      const unitClass = this.getRandomUnitToSpawn();

      spawnList[spawnList.length - 1][validSpawnSpots.splice(spawnPosIndex, 1)[0]] = unitClass;
    }
    return spawnList;
  }

  getRandomUnitToSpawn() {
    var spawnWeights = this.getBasicUnitSpawnWeights();
    return getRandomFromWeightedList(this.boardState.getRandom(this.boardState.constructor.RNG_TYPES.SPAWN), spawnWeights);
  }

  getSpawnDelay() {
    return 1;
  }
}

class AdvancedUnitWaveSpawnFormation extends BasicUnitWaveSpawnFormation {
  constructor(boardState, totalWaves, waveDef) {
    super(boardState, totalWaves, waveDef);
    this.advancedUnitsToSpawn = waveDef.advanced;
    this.unitSpawnBucket = [];
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

  calculateNumSpecialsToSpawn() {
    if (this.advancedUnitsToSpawn !== null) {
      return this.advancedUnitsToSpawn.length;
    }
    return 2;
  }

  refillSpawnBucket() {
    const advancedUnitsToSpawn = Math.min(this.calculateNumSpecialsToSpawn(), this.unitsToSpawn);
    const regularUnitsToSpawn = this.unitsToSpawn - advancedUnitsToSpawn;
    for (let i = 0; i < advancedUnitsToSpawn; i++) {
      var spawnWeights = this.getAdvancedUnitSpawnWeights(i);
      var unitClass = getRandomFromWeightedList(this.boardState.getRandom(this.boardState.constructor.RNG_TYPES.SPAWN), spawnWeights);
      this.unitSpawnBucket.push(unitClass);
    }

    for (let i = 0; i < regularUnitsToSpawn; i++) {
      let unitClass = null;;
      if (
        this.advancedUnitsToSpawn &&
        this.advancedUnitsToSpawn.length > i &&
        this.advancedUnitsToSpawn[i] !== null
      ) {
        unitClass = this.advancedUnitsToSpawn[i]
      } else {
        var spawnWeights = this.getBasicUnitSpawnWeights(advancedUnitsToSpawn - i);
        const rn = this.boardState.getRandom(this.boardState.constructor.RNG_TYPES.SPAWN);
        unitClass = getRandomFromWeightedList(rn, spawnWeights);
      }
      this.unitSpawnBucket.push(unitClass);
    }
  }

  getRandomUnitToSpawn() {
    if (this.unitSpawnBucket.length === 0) {
      this.refillSpawnBucket();
    }
    var unitIndex = Math.floor(this.boardState.getRandom(this.boardState.constructor.RNG_TYPES.SPAWN) * this.unitSpawnBucket.length);
    return this.unitSpawnBucket.splice(unitIndex, 1)[0];
  }

  getSpawnList() {
    this.unitSpawnBucket = [];
    return super.getSpawnList();
  }
}

class UnitFormationSpawnFormation extends SpawnFormation {
  constructor(boardState, waveDef) {
    super(boardState, 0, waveDef);
    this.unitList = waveDef.units;
    this.useRandomOffset = idx(waveDef, 'randomOffset', false);
    this.spawnHeight = this.unitList.length;
    this.spawnWidth = 0;
    this.forceSpawn = waveDef.forceSpawn ? waveDef.forceSpawn : false;
    this.unitList.forEach((unitRow) => {
      this.spawnWidth = Math.max(this.spawnWidth, unitRow.length);
    });
  }

  getSpawnList() {
    if (!this.useRandomOffset || this.spawnWidth >= this.boardState.sectors.columns) {
      return this.unitList;
    }
    
    const offset = Math.floor(
      this.boardState.getRandom(this.boardState.constructor.RNG_TYPES.SPAWN) * (
        this.boardState.sectors.columns - this.spawnWidth
      )
    );

    const spawnList = [];
    for (let i = 0; i < this.unitList.length; i++) {
      spawnList.push([...this.unitList[i]]);
      for (let j = 0; j < offset; j++) {
        spawnList[i].unshift(null);
      }
    }

    return spawnList;
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
