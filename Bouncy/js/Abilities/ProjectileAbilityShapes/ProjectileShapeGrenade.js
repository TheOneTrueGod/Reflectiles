/* Params
 * None
 */
class ProjectileShapeGrenade extends ProjectileShape {
  constructor(abilityDef) {
    super(abilityDef);
    this.ACTIVATE_ON_TICK = 0;
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    if (tick == this.ACTIVATE_ON_TICK) {
      var angle = Math.atan2(
        targetPoint.y - castPoint.y, targetPoint.x - castPoint.x
      );
      boardState.addProjectile(
        Projectile.createProjectile(
          playerID,
          this.projectileType,
          castPoint,
          targetPoint,
          angle,
          this.abilityDef
        ).addUnitHitCallback(this.unitHitCallback.bind(this))
        .addTimeoutHitCallback(this.timeoutHitCallback.bind(this))
        .addTimeoutCallback(this.timeoutCallback.bind(this))
        .addCollisionHitCallback(this.collisionHitCallback.bind(this))
        .addOnKillCallback(this.onKillCallback.bind(this))
      );
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.ACTIVATE_ON_TICK;
  }
}
