class UnitCore extends Unit {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
  }

  createSprite() {
    var sprite = new PIXI.Sprite(
      PIXI.loader.resources['core'].texture
    );

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0xFFFF00);
    graphics.drawCircle(0, 0, 20);
    graphics.endFill();

    this.selectedSprite = graphics;
    this.selectedSprite.visible = false;

    sprite.addChild(graphics);
    sprite.anchor.set(0.5);

    return sprite;
  }

  canSelect() {
    return MainGame.playerID == this.owner;
  }

  getMoveSpeed() {
    return 2;
  }

  runTick() {
    if (this.moveTarget) {
      var ang = Math.atan2(
        this.moveTarget.y - this.y,
        this.moveTarget.x - this.x
      );

      this.x += Math.cos(ang) * this.getMoveSpeed();
      this.y += Math.sin(ang) * this.getMoveSpeed();
    }
    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }
}

UnitCore.loadFromServerData = function(serverData) {
  return Unit.loadFromServerData(serverData);
}

UnitCore.AddToTypeMap();
