class ProjectileTrailEffect extends Effect {
  constructor(projectile, duration, scale=1) {
    super({x: projectile.x, y: projectile.y}, 0);
    this.startTime = duration;
    this.time = this.startTime;
    this.scale = scale;

    this.projectile = projectile;
  }

  createSprite() {
    let sprite = this.projectile.createSprite();
    this.updateScale(sprite);
    return sprite;
  }
  
  updateScale(sprite) {
    sprite.scale.x = lerp(1, 0.5, (1 - this.time / this.startTime)) * this.scale;
    sprite.scale.y = lerp(1, 0.5, (1 - this.time / this.startTime)) * this.scale;
  }

  runTick(boardState, boardWidth, boardHeight) {
    this.time -= 1;
    this.gameSprite.alpha = this.time / this.startTime;
    this.updateScale(this.gameSprite);
  }
}
