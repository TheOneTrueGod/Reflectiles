class UnitSpawningPlaceholder extends Unit {
  constructor(x, y, owner, id, turnsUntilSpawn, unitToSpawn, spawnEffect) {
    super(x, y, owner, id);
    this.turnsUntilSpawn = turnsUntilSpawn;
    this.setUnitToSpawn(unitToSpawn);
    this.spawnEffect = spawnEffect ? spawnEffect : Unit.SpawnEffects.REINFORCE;
  }

  addToBackOfStage() {
    return true;
  }

  dealDamage(boardState, amount, source, damageType) {
    return 0;
  }

  setUnitToSpawn(unitToSpawnName) {
    this.unitToSpawn = unitToSpawnName;
    this.unitToSpawnName = unitToSpawnName;
    if (!unitToSpawnName in Unit.UnitTypeMap) {
      console.warn(unitToSpawnName, " not in Unit.UnitTypeMap");
    } else {
      this.unitToSpawn = Unit.UnitTypeMap[unitToSpawnName];
    }
  }

  serializeData() {
    return {
      unit_to_spawn_name: this.unitToSpawnName,
      spawn_effect: this.spawnEffect,
      turns_until_spawn: this.turnsUntilSpawn,
    };
  }

  loadSerializedData(data) {
    this.setUnitToSpawn(data.unit_to_spawn_name);
    this.spawnEffect = data.spawn_effect;
    this.turnsUntilSpawn = data.turns_until_spawn;
  }

  isRealUnit() {
    return false;
  }

  createSprite(hideHealthBar) {
    let spriteUnit = new this.unitToSpawn(this.x, this.y, this.owner);
    let sprite = spriteUnit.createSpawnPlaceholderSprite();
    return sprite;
  }

  getCollisionBox() {
    return [];
  }

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (phase != TurnPhasesEnum.END_OF_TURN) { return; }
    this.turnsUntilSpawn -= 1;
    if (this.turnsUntilSpawn <= 0) {
      let unitsAtPos = boardState.sectors.getUnitsAtPosition(this.x, this.y);
      if (unitsAtPos.length > 1) {
        return true;
      }
      this.delete();
      let newUnit = new this.unitToSpawn(this.x, this.y, this.owner);
      boardState.addUnit(newUnit);
      newUnit.playSpawnEffect(boardState, this, 30, this.spawnEffect);
      return false;
    }
  }

  preventsUnitEntry(unit) {
    return (unit instanceof UnitCore);
  }
}

UnitSpawningPlaceholder.AddToTypeMap();
