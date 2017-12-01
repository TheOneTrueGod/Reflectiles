class UnitBit extends Unit {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
  }

  createSprite() {
    var sprite;
    switch (this.owner) {
      case 0:
        sprite = new PIXI.Sprite(
          PIXI.loader.resources['byte_red'].texture
        );
        break;
      case 1:
        sprite = new PIXI.Sprite(
          PIXI.loader.resources['byte'].texture
        );
        break;
      default:
        sprite = new PIXI.Sprite(
          PIXI.loader.resources['byte'].texture
        );
        break;
    }

    sprite.anchor.set(0.5);
    return sprite;
  }

  runTick() {
    this.y += 1;

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }
}

UnitBit.loadFromServerData = function(serverData) {
  return Unit.loadFromServerData(serverData);
}

UnitBit.AddToTypeMap();
