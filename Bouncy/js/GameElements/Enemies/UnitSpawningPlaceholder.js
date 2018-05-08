class UnitSpawningPlaceholder extends Unit {
  constructor(x, y, owner, id, turnsUntilSpawn, unitToSpawn) {
    super(x, y, owner, id);
    this.turnsUntilSpawn = turnsUntilSpawn;
    this.unitToSpawn = unitToSpawn;
    this.unitToSpawnName = unitToSpawn;
    if (!unitToSpawn in Unit.UnitTypeMap) {
      console.warn(unitToSpawn, " not in Unit.UnitTypeMap");
    } else {
      this.unitToSpawn = Unit.UnitTypeMap[unitToSpawn];
    }
  }

  isRealUnit() {
    return false;
  }

  createSprite() {
    let spriteUnit = new this.unitToSpawn(this.x, this.y, this.owner);
    let sprite = spriteUnit.createSprite();
    if (spriteUnit.healthBarSprites) {
      spriteUnit.healthBarSprites.textSprite.parent.removeChild(spriteUnit.healthBarSprites.textSprite);
    }
    sprite.alpha = 0.5;
    return sprite;
  }

  getCollisionBox() {
    return [];
  }

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (phase != TurnPhasesEnum.END_OF_TURN) { return; }
    this.turnsUntilSpawn -= 1;
    if (this.turnsUntilSpawn === 0) {
      this.delete();
      let newUnit = new this.unitToSpawn(this.x, this.y, this.owner);
      boardState.addUnit(newUnit);
      newUnit.playSpawnEffect(boardState, this, 30, Unit.SpawnEffects.REINFORCE);
      return false;
    }
  }
}

UnitSpawningPlaceholder.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}

UnitSpawningPlaceholder.AddToTypeMap();
