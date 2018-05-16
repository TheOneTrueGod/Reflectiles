class UnitCastleWall extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.traits[Unit.UNIT_TRAITS.FROST_IMMUNE] = true;
    this.traits[Unit.UNIT_TRAITS.POISON_IMMUNE] = true;
    this.sortIndex = 1000;
  }

  createSprite() {
    let sprite = this.createSpriteFromResource('enemy_castle_wall');
    return sprite;
  }

  isRealUnit() {
    return false;
  }

  canMove() {
    return false;
  }

  preventsUnitEntry(unit) {
    return (unit instanceof UnitCore);
  }

  addToBackOfStage() {
    return true;
  }

  onDelete(boardState) {
    super.onDelete(boardState);

    const TURNS_UNTIL_SPAWN = NumbersBalancer.getUnitAbilityNumber(
      this,
      NumbersBalancer.UNIT_ABILITIES.CASTLE_WALL_REVIVE_TURNS
    );
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

  createHealthBarSprite(sprite) {
    return null;
  }
}

UnitCastleWall.AddToTypeMap();
