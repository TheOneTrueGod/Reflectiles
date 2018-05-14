class UnitCastleWall extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.traits[Unit.UNIT_TRAITS.FROST_IMMUNE] = true;
    this.sortIndex = 1000;
  }

  createSprite() {
    let sprite = this.createSpriteFromResource('enemy_castle_wall');
    return sprite;
  }

  canMove() {
    return false;
  }

  preventsUnitEntry(unit) {
    return (unit instanceof UnitCore);
  }

  otherUnitEntering(boardState, unit) {
    this.gameSprite.alpha = 0.5;
    return true;
  }

  otherUnitLeaving(boardState, unit) {
    this.gameSprite.alpha = 1;
    return true;
  }

  onDelete(boardState) {
    super.onDelete(boardState);

    const TURNS_UNTIL_SPAWN = 3;
    //let newUnit = new dyingUnit.constructor(dyingUnit.x, dyingUnit.y, this.owner);
    let newUnit = new UnitSpawningPlaceholder(
      this.x,
      this.y,
      this.owner,
      null,
      TURNS_UNTIL_SPAWN,
      this.constructor.name
    );
    boardState.addUnit(newUnit);
    newUnit.playSpawnEffect(boardState, this, 20);
  }
}

UnitCastleWall.AddToTypeMap();
