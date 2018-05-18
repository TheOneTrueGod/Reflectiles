class UnitShover extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
  }

  createCollisionBox() {
    var s = Unit.UNIT_SIZE / 2;
    // Octagonal

    this.collisionBox = [
      new UnitLine(-s / 2, -s, s / 2, -s, this), // Top
      new UnitLine(s / 2, -s, s, s, this), // Right
      new UnitLine(s, s, -s, s, this), // Bottom
      new UnitLine(-s, s, -s / 2, -s, this), // Left
    ];
  }

  createSprite(hideHealthBar) {
    return this.createSpriteFromResource('enemy_shover', hideHealthBar);
  }
}

UnitShover.AddToTypeMap();
