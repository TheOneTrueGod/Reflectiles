class UnitIceWall extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.traits[Unit.UNIT_TRAITS.FROST_IMMUNE] = true;
    this.traits[Unit.UNIT_TRAITS.POISON_IMMUNE] = true;
    this.sortIndex = 1000;
  }

  createSprite(hideHealthBar) {
    let sprite = this.createSpriteFromResource('enemy_ice_wall', hideHealthBar);
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

  createHealthBarSprite(sprite) {
    return null;
  }
}

UnitIceWall.AddToTypeMap();
