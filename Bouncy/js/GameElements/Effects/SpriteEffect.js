class SpriteEffect extends Effect {
  constructor(position, sprite, scale, time) {
    super({x: position.x, y: position.y}, 0);
    this.spriteName = sprite;
    if (time) {
      this.startTime = time;
      this.time = this.startTime;
    }
    this.scale = scale ? scale : 1;
    this.sprites = [];
    this.prevSprite = null;
  }

  createSprite() {
    var container = new PIXI.Container();
    container.position.set(this.x, this.y);

    var baseTexture = PIXI.loader.resources[this.spriteName].texture;
    for (var x = 0; x < baseTexture.width / baseTexture.height; x++) {
      var newSprite = new PIXI.Sprite(new PIXI.Texture(baseTexture,
          new PIXI.Rectangle(baseTexture.height * x, 0, baseTexture.height, baseTexture.height)
        ));
      this.sprites.push(newSprite);
      newSprite.anchor.set(0.5);
      container.addChild(newSprite);
      newSprite.visible = false;
    }

    container.scale.set(this.scale);
    return container;
  }

  updateSprite() {
    if (this.prevSprite) {
      this.prevSprite.visible = false;
      this.prevSprite = null;
    }

    var pct = 1 - this.time / this.startTime;
    var frame = Math.floor(Math.min(pct * this.sprites.length, this.sprites.length - 1));

    this.prevSprite = this.sprites[frame];
    this.prevSprite.visible = true;
  }

  runTick(boardState, boardWidth, boardHeight) {
    this.time -= 1;
    this.updateSprite();
  }
}
