class SpriteShatterEffect extends Effect {
  constructor(sprite, oldPosition, shatterRect, speed, time) {
    super({x: oldPosition.x, y: oldPosition.y}, 0);

    this.originalSprite = sprite;
    
    if (time) {
      this.startTime = time;
      this.time = this.startTime;
    }
    this.shatterRect = shatterRect;
    this.speed = speed ? speed : {x: 0, y: 0};
  }

  createSprite() {
    var container = new PIXI.Container();

    var baseTexture = this.originalSprite.texture;
    var oldOffset = this.originalSprite.texture.orig;
    var w = baseTexture.width;
    var h = baseTexture.height;
    var newSprite = new PIXI.Sprite(new PIXI.Texture(
      baseTexture,
      new PIXI.Rectangle(
        oldOffset.x + w * this.shatterRect.x,
        oldOffset.y + h * this.shatterRect.y,
        w * this.shatterRect.w, h * this.shatterRect.h
      )
    ));

    newSprite.position.set(
      this.shatterRect.x * w - w / 2,
      this.shatterRect.y * h - h / 2
    );

    container.addChild(newSprite);
    return container;
  }

  runTick(boardState, boardWidth, boardHeight) {
    this.time -= 1;
    this.x += this.speed.x;
    this.y += this.speed.y;
    this.gameSprite.position.set(this.x, this.y);

    var pctDone = 1 - (this.time / this.startTime);
    this.gameSprite.alpha = lerp(1, 0.2, pctDone);
  }
}
