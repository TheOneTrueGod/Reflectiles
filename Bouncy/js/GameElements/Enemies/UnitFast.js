class UnitFast extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
  }

  createCollisionBox() {
    var s = Unit.UNIT_SIZE / 2;

    this.collisionBox = [
      new UnitLine(-s, -s, s, -s, this), // Top
      new UnitLine(s, -s, s / 2, s, this), // Right
      new UnitLine(s / 2, s, -s / 2, s, this), // Bottom
      new UnitLine(-s / 2, s, -s, -s, this), // Left
    ];
  }

  createSprite(hideHealthBar) {
    return this.createSpriteFromResource('enemy_fast', hideHealthBar);
  }
}

UnitFast.AddToTypeMap();
