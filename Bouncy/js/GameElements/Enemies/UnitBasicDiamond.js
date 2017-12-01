class UnitBasicDiamond extends UnitBasic {
  createCollisionBox() {
    this.collisionBox = [
      new UnitLine(0, -this.physicsHeight / 2, this.physicsWidth / 2, 0, this), // Top Right
      new UnitLine(this.physicsWidth / 2, 0, 0, this.physicsHeight / 2, this), // Bottom Right
      new UnitLine(0, this.physicsHeight / 2, -this.physicsWidth / 2, 0, this), // Bottom Left
      new UnitLine(-this.physicsWidth / 2, 0, 0, -this.physicsHeight / 2, this), // Top Left
    ];
  }

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['enemy_diamond'].texture
    );

    // this.addPhysicsLines(sprite);
    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);

    sprite.width = Unit.UNIT_SIZE;
    sprite.height = Unit.UNIT_SIZE;
    return sprite;
  }
}

UnitBasicSquare.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}

UnitBasicDiamond.AddToTypeMap();
