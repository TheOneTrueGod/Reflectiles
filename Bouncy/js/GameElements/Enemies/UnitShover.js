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

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['enemy_shover'].texture
    );

    //this.addPhysicsLines(sprite, 0x00ff00);
    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);

    sprite.width = Unit.UNIT_SIZE;
    sprite.height = Unit.UNIT_SIZE;
    return sprite;
  }
}

UnitShover.AddToTypeMap();
