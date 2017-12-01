class UnitBasicSquare extends UnitBasic {
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

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['enemy_square'].texture
    );

    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);

    sprite.width = Unit.UNIT_SIZE;
    sprite.height = Unit.UNIT_SIZE;

    //this.addPhysicsLines(sprite);
    return sprite;
  }
}

UnitBasicSquare.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}

UnitBasicSquare.AddToTypeMap();
