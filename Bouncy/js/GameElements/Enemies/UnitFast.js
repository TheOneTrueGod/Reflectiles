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

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['enemy_fast'].texture
    );

    //this.addPhysicsLines(sprite, 0xffff00);
    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);

    sprite.width = Unit.UNIT_SIZE;
    sprite.height = Unit.UNIT_SIZE;
    return sprite;
  }
}

UnitFast.AddToTypeMap();
