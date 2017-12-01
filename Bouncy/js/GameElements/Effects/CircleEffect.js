class CircleEffect extends Effect {
  constructor(pos, size, color, speed) {
    super({x: pos.x, y: pos.y}, 0);
    this.size = size ? size : 4;
    this.color = color ? color : 0xffffff;
    this.startTime = 10;
    this.time = this.startTime;
    this.speed = speed ? speed : {x: 0, y: 0};
    this.graphic = null;
  }

  createSprite() {
    var graphic = new PIXI.Graphics();
    graphic.position.set(this.x, this.y);
    graphic.lineStyle(1, this.color)
           .beginFill(this.color)
           .moveTo(0, 0)
           .drawCircle(0, 0, this.size);
    this.graphic = graphic;
    return graphic;
  }

  runTick(boardState, boardWidth, boardHeight) {
    this.time -= 1;
    this.gameSprite.alpha = this.time / this.startTime;
    this.graphic.position.set(
      this.graphic.position.x + this.speed.x,
      this.graphic.position.y + this.speed.y,
    )
  }
}
