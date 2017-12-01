class SpawnFormation {
  constructor(boardState, totalWaves) {
    this.boardState = boardState;
    this.totalWaves = totalWaves;
  }

  isValidSpawnSpot(spawnPosition) {
    return true;
  }

  spawn(spawnPosition) {

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
    return 2;
  }
}

class UnitListSpawnFormation extends SpawnFormation {
  constructor(boardState, unitList) {
    super(boardState, 1);
    this.unitList = unitList;
    this.unitsToSpawn = 0;
    this.unitList.forEach((unitData) => {
      this.unitsToSpawn += unitData.count;
    });
    this.isValidSpawn = null;
    this.validSpawnSpots = [];
  }
  
  isValidSpawnSpot(spawnPosition) {
    if (this.isValidSpawn !== null) { return this.isValidSpawn; }
    var y = 0;
    for (var x = 0; x < this.boardState.sectors.columns; x++) {
      var spot = Victor(x, y);
      if (this.boardState.sectors.canUnitEnter(
        this.boardState, null,
        this.boardState.sectors.getPositionFromGrid(spot)
      )) {
        this.validSpawnSpots.push(spot);
      }
    }
    this.isValidSpawn = this.validSpawnSpots.length >= this.unitsToSpawn;
    return this.isValidSpawn;
  }
  
  spawn(spawnPosition) {
    this.unitList.forEach((unitData) => {
      for (var i = 0; i < unitData.count; i++) {
        var spawnPos = this.getRandomSpawnLocation();
        this.spawnUnitAtLocation(unitData.unit, spawnPos);
      }
    });
  }

  getRandomSpawnLocation() {
    var spawnPosIndex = Math.floor(this.boardState.getRandom() * this.validSpawnSpots.length);
    var spawnGridPos = this.validSpawnSpots.splice(spawnPosIndex, 1)[0];
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
  constructor(boardState, totalWaves, unitsToSpawn = null) {
    super(boardState, totalWaves);

    if (unitsToSpawn) {
      this.unitsToSpawn = unitsToSpawn;
    } else {
      var pctDone = this.boardState.getWavesSpawned() / this.totalWaves;
      this.unitsToSpawn = this.boardState.sectors.columns
        - Math.floor((1 - pctDone) * 3) // 0-2
        - Math.floor(this.boardState.getRandom() * 3) // 0-2
        - 1
        ;
    }
    
    this.validSpawnSpots = [];
    this.isValidSpawn = null;
  }

  isValidSpawnSpot(spawnPosition) {
    if (this.isValidSpawn !== null) { return this.isValidSpawn; }
    var y = 0;
    for (var x = 0; x < this.boardState.sectors.columns; x++) {
      var spot = Victor(x, y);
      if (this.boardState.sectors.canUnitEnter(
        this.boardState, null,
        this.boardState.sectors.getPositionFromGrid(spot)
      )) {
        this.validSpawnSpots.push(spot);
      }
    }
    this.isValidSpawn = this.validSpawnSpots.length >= this.unitsToSpawn;
    return this.isValidSpawn;
  }

  spawn(spawnPosition) {
    for (var i = 0; i < this.unitsToSpawn; i++) {
      var spawnPos = this.getRandomSpawnLocation();

      var spawnWeights = this.getBasicUnitSpawnWeights();
      var unitClass = getRandomFromWeightedList(this.boardState.getRandom(), spawnWeights);
      this.spawnUnitAtLocation(unitClass, spawnPos);
    }
  }

  getRandomSpawnLocation() {
    var spawnPosIndex = Math.floor(this.boardState.getRandom() * this.validSpawnSpots.length);
    var spawnGridPos = this.validSpawnSpots.splice(spawnPosIndex, 1)[0];
    var spawnPos = this.boardState.sectors.getPositionFromGrid(
      spawnGridPos
    );

    return spawnPos;
  }

  getSpawnDelay() {
    return 1;
  }
}

class AdvancedUnitWaveSpawnFormation extends BasicUnitWaveSpawnFormation {
  constructor(boardState, totalWaves, unitsToSpawn = null, advancedToSpawn = null) {
    super(boardState, totalWaves, unitsToSpawn);
    this.advancedUnitsToSpawn = advancedToSpawn;
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

  spawn(spawnPosition) {
    const ADVANCED_UNITS_TO_SPAWN = this.calculateNumSpecialsToSpawn();
    this.unitsToSpawn -= ADVANCED_UNITS_TO_SPAWN;
    super.spawn(spawnPosition);
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
  constructor(boardState, unitList) {
    super(boardState, 0);
    this.unitList = unitList;
    this.spawnHeight = this.unitList.length;
    this.spawnWidth = 0;
    this.unitList.forEach((unitRow) => {
      this.spawnWidth = Math.max(this.spawnWidth, unitRow.length);
    });
  }
  
  isValidSpawnSpot(spawnPosition) {
    return SpawnFormationUtils.isBoxClearForSpawn(
      this.boardState, 
      {x: spawnPosition.x, y: 0},
      {x: spawnPosition.x + this.spawnWidth, y: this.spawnHeight},
    );
  }
  
  spawn(spawnPosition) {
    for (var y = 0; y < this.unitList.length; y++) {
      for (var x = 0; x < this.unitList[y].length; x++) {
        if (this.unitList[y][x] !== null) {
          this.spawnUnitAtCoord(
            this.unitList[y][x], 
            {x: spawnPosition.x + x, y: spawnPosition.y + y}
          );
        }
      }
    }
  }
}

class KnightAndShooterSpawnFormation extends SpawnFormation {
  constructor(boardState, totalWaves) {
    super(boardState, totalWaves);
    this.spawnWidth = 1;
    if (boardState.getWavesSpawned() > totalWaves * 0.5) {
      this.spawnWidth = 2;
    }
  }

  isValidSpawnSpot(spawnPosition) {
    if (!(spawnPosition.x > 3 && spawnPosition.x < this.boardState.sectors.columns - 3)) {
      return false;
    }
    return SpawnFormationUtils.isBoxClearForSpawn(
      this.boardState, 
      {x: spawnPosition.x - this.spawnWidth, y: 0},
      {x: spawnPosition.x + this.spawnWidth, y: 1},
    );
  }

  spawn(spawnPosition) {
    for (var x = -this.spawnWidth; x <= this.spawnWidth; x++) {
      var spawnPos = this.boardState.sectors.getPositionFromGrid(
        {x: spawnPosition.x + x, y: spawnPosition.y}
      );
      if (this.spawnWidth == 2 && x == 0) {
        this.spawnUnitAtCoord(UnitProtector, {x: spawnPosition.x + x, y: spawnPosition.y});
      } else {
        this.spawnUnitAtCoord(UnitShooter, {x: spawnPosition.x + x, y: spawnPosition.y});
      }
      spawnPos.y += Unit.UNIT_SIZE;
      this.spawnUnitAtCoord(UnitKnight, {x: spawnPosition.x + x, y: spawnPosition.y + 1});
    }

    this.spawnUnitAtCoord(UnitHeavy, {x: spawnPosition.x - (this.spawnWidth + 1), y: spawnPosition.y});
    this.spawnUnitAtCoord(UnitHeavy, {x: spawnPosition.x + (this.spawnWidth + 1), y: spawnPosition.y});
    this.spawnUnitAtCoord(UnitHeavy, {x: spawnPosition.x - (this.spawnWidth + 1), y: spawnPosition.y + 1});
    this.spawnUnitAtCoord(UnitHeavy, {x: spawnPosition.x + (this.spawnWidth + 1), y: spawnPosition.y + 1});

  }

  getSpawnDelay() {
    return 2;
  }
}

class SpawnFormationUtils {
  static isBoxClearForSpawn(boardState, topLeft, bottomRight) {
    if (
      topLeft.x > bottomRight.x || topLeft.y > bottomRight.y ||
      topLeft.x < 0 || bottomRight.x >= boardState.sectors.columns
    ) {
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
