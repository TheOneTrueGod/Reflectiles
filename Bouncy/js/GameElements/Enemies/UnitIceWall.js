class UnitIceWall extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.traits[Unit.UNIT_TRAITS.FROST_IMMUNE] = true;
    this.traits[Unit.UNIT_TRAITS.POISON_IMMUNE] = true;
    this.sortIndex = 1000;
  }

  createCollisionBox() {
    var t = -this.physicsHeight / 2;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;

    var offset = 0;
    this.collisionBox = [
      new UnitLine(l - offset, t, r + offset, t, this), // Top
      new UnitLine(r, t - offset, r, b + offset, this), // Right
      new UnitLine(r + offset, b, l - offset, b, this), // Bottom
      new UnitLine(l, b + offset, l, t - offset, this), // Left
    ];
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

  canBeShoved() {
    return false;
  }

  addToBackOfStage() {
    return true;
  }

  createHealthBarSprite(sprite) {
    return null;
  }
}

UnitIceWall.AddToTypeMap();
