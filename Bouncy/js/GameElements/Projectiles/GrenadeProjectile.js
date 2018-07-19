class GrenadeProjectile extends Projectile {
  constructor(playerID, startPoint, targetPoint, angle, abilityDef) {
    super(playerID, startPoint, targetPoint, angle, abilityDef, {});
    this.hitEnemy = false;

    var targetVec = Victor(targetPoint.x - startPoint.x, targetPoint.y - startPoint.y);
    this.maxDuration = abilityDef.getOptionalParam('duration', Math.max(targetVec.length(), 100) / this.speed);
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
    this.gameSprite.y = this.y - this.getZPct() * 150;
  }
}
