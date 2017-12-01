class LineEffect extends Effect {
  constructor(line, color, speed) {
    super({x: line.x1, y: line.y1}, 0);
    this.line = line;
    this.color = color ? color : 0xffffff;
    this.speed = speed ? speed : {x: 0, y: 0};
    this.lineGraphic = null;
  }

  createSprite() {
    var lineGraphic = new PIXI.Graphics();
    lineGraphic.position.set(this.line.x1, this.line.y1);
    lineGraphic.lineStyle(3, this.color)
           .moveTo(0, 0)
           .lineTo(this.line.x2 - this.line.x1, this.line.y2 - this.line.y1);
    this.lineGraphic = lineGraphic;
    return lineGraphic;
  }

  runTick(boardState, boardWidth, boardHeight) {
    this.time -= 1;
    this.gameSprite.alpha = this.time / this.startTime;
    this.lineGraphic.position.set(
      this.lineGraphic.position.x + this.speed.x,
      this.lineGraphic.position.y + this.speed.y,
    )
  }
}
