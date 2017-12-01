class GrenadeProjectile extends Projectile {
  constructor(startPoint, targetPoint, angle, abilityDef) {
    super(startPoint, targetPoint, angle, abilityDef, {});
    this.hitEnemy = false;
    this.ghost_time = abilityDef.getOptionalParam('duration', 10);
    this.start_ghost_time = this.ghost_time;

    var targetVec = Victor(targetPoint.x - startPoint.x, targetPoint.y - startPoint.y);
    this.maxDuration = Math.max(targetVec.length(), 100) / this.speed;
    this.duration = this.maxDuration;
  }

  shouldBounceOffLine(line) {
    return false;
  }

  createTrail(boardState) {
    boardState.addProjectile(
      new ProjectileTrailEffect(this, 1, lerp(0.8, 0.25, this.getZPct()))
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
