class Effect extends Projectile {
  constructor(startPoint) {
    super(startPoint, 0);
    this.startTime = 20;
    this.time = this.startTime;
    this.speed = {x: 0, y: 0};
  }

  createSprite() {
    throw new Error("Don't create effects directly");
    return sprite;
  }

  canBeRefreshed() {
    return true;
  }

  runTick(boardState, boardWidth, boardHeight) {
    this.time -= 1;
    this.gameSprite.alpha = this.time / this.startTime;
  }

  readyToDelete() {
    return this.readyToDel || this.time <= 0;
  }
}
