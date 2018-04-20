/* Params
 * bullet_waves (int) [4] -- the number of bullets to be fired.
 * bullet_wave_delay (int) [10] -- the gap between each wave of bullets
 * base_accuracy (float) [0] -- Randomly fire in this arc
 * accuracy_decay (float) [0] -- Added to base_accuracy each shot. (capped at 0 and Math.PI)
 */
class ProjectileShapeChainShot extends ProjectileShape {
  constructor(abilityDef) {
    super(abilityDef);
    this.num_waves = abilityDef.getOptionalParam('num_bullets', 4);
    var wave_delay = abilityDef.getOptionalParam('bullet_wave_delay', 10);
    this.ACTIVATE_ON_TICKS = {0: 0};
    this.FINAL_TICK = 1;
    for (var i = 1; i < this.num_waves; i++) {
      this.ACTIVATE_ON_TICKS[i * wave_delay] = i;
      this.FINAL_TICK = i * wave_delay;
    }
  }

  appendIconDescHTML($container) {

  }

  getTextDesc() {
    var hitEffects = this.abilityDef.getHitEffects();
    for (var i = 0; i < hitEffects.length; i++) {
      if (hitEffects[i].effect == ProjectileShape.HitEffects.DAMAGE) {
        return this.num_waves + " X " + idx(hitEffects[i], 'base_damage', 0);
      }
    }
    return 0;
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    if (tick in this.ACTIVATE_ON_TICKS) {
      var shotIndex = this.ACTIVATE_ON_TICKS[tick];
      var accuracy = this.abilityDef.getOptionalParam('base_accuracy', 0);
      var accuracyDecay = this.abilityDef.getOptionalParam('accuracy_decay', 0);
      var accuracyForShot = Math.min(
        Math.max(0, accuracy + accuracyDecay * shotIndex),
        Math.PI / 2.0
      );
      let aimDist = Math.pow((targetPoint.y - castPoint.y) ** 2 + (targetPoint.x - castPoint.x) ** 2, 0.5);
      var aimAngle = Math.atan2(
        targetPoint.y - castPoint.y, targetPoint.x - castPoint.x
      );
      let angle = aimAngle + (boardState.getRandom() - 0.5) * 2 * accuracyForShot;
      let aimTargetPoint = {x: Math.cos(angle) * aimDist + castPoint.x, y: Math.sin(angle) * aimDist + castPoint.y};
      aimTargetPoint = this.abilityDef.getAccuracy().getRandomTarget(
        boardState,
        castPoint,
        aimTargetPoint
      );
      angle = Math.atan2(
        aimTargetPoint.y - castPoint.y, aimTargetPoint.x - castPoint.x
      );
      boardState.addProjectile(
        Projectile.createProjectile(
          playerID,
          this.projectileType,
          castPoint,
          aimTargetPoint,
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
    return tickOn > this.FINAL_TICK;
  }
}
