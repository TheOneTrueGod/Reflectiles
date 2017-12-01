class SpriteLerpProjectile extends Projectile {
  constructor(startPoint, endPoint, startScale, endScale, time, spriteName, finishCallback) {
    super(startPoint, 0);
    this.startTime = time;
    this.time = this.startTime;
    this.movement = {
      start: {x: startPoint.x, y: startPoint.y},
      end: {x: endPoint.x, y: endPoint.y}
    };
    this.scale = {start: startScale, end: endScale};
    this.finishCallback = finishCallback;
    this.spriteName = spriteName;
  }

  createSprite() {
    var container = new PIXI.Container();
    container.position.set(this.x, this.y);

    var newSprite = new PIXI.Sprite(
      PIXI.loader.resources[this.spriteName].texture
    );
    newSprite.anchor.set(0.5);

    return newSprite;
  }

  runTick(boardState, boardWidth, boardHeight) {
    this.time -= 1;

    if (this.time <= 0) {
      this.finishCallback();
    }

    var timePct = 1 - (this.time / this.startTime);
    this.gameSprite.scale.x = lerp(this.scale.start, this.scale.end, timePct);
    this.gameSprite.scale.y = lerp(this.scale.start, this.scale.end, timePct);

    this.gameSprite.position.set(
      lerp(this.movement.start.x, this.movement.end.x, timePct),
      lerp(this.movement.start.y, this.movement.end.y, timePct)
    );
  }

  readyToDelete() {
    return this.time <= 0;
  }
}
