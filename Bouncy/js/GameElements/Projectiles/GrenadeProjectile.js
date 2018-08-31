class GrenadeProjectile extends Projectile {
  constructor(playerID, startPoint, targetPoint, angle, abilityDef) {
    super(playerID, startPoint, targetPoint, angle, abilityDef, {});
    this.hitEnemy = false;

    var targetVec = Victor(targetPoint.x - startPoint.x, targetPoint.y - startPoint.y);
    this.maxDuration = abilityDef.getOptionalParam('duration', 40);
    this.height = abilityDef.getOptionalParam('height', 150);
    this.speed = Math.max(targetVec.length(), 100) / this.maxDuration;
    this.duration = this.maxDuration;
  }

  shouldBounceOffLine(line) {
    return false;
  }

  createTrail(boardState) {
    boardState.addProjectile(
      new ProjectileShadowEffect(this, 1, lerp(0.8, 0.25, this.getZPct()))
    );
  }

  getZPct() {
    return Math.sin(this.duration / this.maxDuration * Math.PI);
  }

  runTick(boardState, boardWidth, boardHeight) {
    super.runTick(boardState, boardWidth, boardHeight);
    this.gameSprite.y = this.y - this.getZPct() * this.height;
  }
}
