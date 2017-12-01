class UnitSlime extends UnitBasic {
  createCollisionBox() {

    var t = -this.physicsHeight / 2 + this.physicsHeight * 3 / 50;
    var b = this.physicsHeight / 2 - this.physicsHeight * 3 / 50;
    var r = this.physicsWidth / 2 - this.physicsHeight * 3 / 50;
    var l = -this.physicsWidth / 2 + this.physicsHeight * 3 / 50;

    this.collisionBox = [
      new UnitLine(r * 0.5, b, l * 0.5, b, this), // Bottom
      new UnitLine(l * 0.5, b, l, b * 0.5, this), // Bottom-left
      new UnitLine(l, b * 0.5, l, t * 0.25, this), // Left
      new UnitLine(l, t * 0.25, l * 0.5, t * 0.5, this), // left-Top-left
      new UnitLine(l * 0.5, t * 0.5, 0, t, this), // Top-left
      new UnitLine(0, t, r * 0.5, t * 0.5, this), // Top-right
      new UnitLine(r * 0.5, t * 0.5, r, t * 0.25, this), // right-Top-right
      new UnitLine(r, b * 0.5, r, t * 0.25, this), // Right
      new UnitLine(r, b * 0.5, r * 0.5, b, this), // Bottom-right
    ];

    //new UnitLine(l, t * 0.25, 0, t, this), // Top-left
    //new UnitLine(0, t, r, t * 0.25, this), // Top-right
  }

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['enemy_slime'].texture
    );

    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);

    sprite.width = Unit.UNIT_SIZE;
    sprite.height = Unit.UNIT_SIZE;

    //this.addPhysicsLines(sprite);
    return sprite;
  }
}

UnitSlime.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}

UnitSlime.AddToTypeMap();
