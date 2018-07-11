/* Params
 * [TODO] num_bullets (int) -- the number of bullets to be fired.
 */
class ProjectileShapeBulletExplosion extends ProjectileShape {
  constructor(abilityDef) {
    super(abilityDef);
    this.ACTIVATE_ON_TICK = 0;
    this.num_bullets = abilityDef.getOptionalParam('num_bullets', 12);
    this.angle_start = abilityDef.getOptionalParam('angle_start', -Math.PI / 2.0);
    this.angle_end = abilityDef.getOptionalParam('angle_end', Math.PI * 2 - Math.PI / 2.0);
    this.angle_offset = abilityDef.getOptionalParam('angle_offset', 0);
    this.bullet_speed = abilityDef.getOptionalParam('bullet_speed', 4);
    this.GRAVITY = abilityDef.getOptionalParam('gravity', {x: 0, y: 0.05});
    this.INHERIT_ANGLE = abilityDef.getOptionalParam('inherit_angle', false);
  }

  getTextDesc() {
    var hitEffects = this.abilityDef.getHitEffects();
    for (var i = 0; i < hitEffects.length; i++) {
      if (hitEffects[i].effect == ProjectileShape.HitEffects.DAMAGE) {
        return (this.num_bullets + 1) + " X " + idx(hitEffects[i], 'base_damage', 0);
      }
    }
    return 0;
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    let angle_offset = this.angle_offset;
    if (angle_offset === 'random') {
      angle_offset = boardState.getRandom() * Math.PI * 2;
    }
    if (tick == this.ACTIVATE_ON_TICK) {
      for (var j = 0; j < this.num_bullets; j++) {
        var deltaAngle = this.angle_end - this.angle_start;
        let denom = this.num_bullets - 1;
        var angle = (deltaAngle / (denom ? denom : 1) * (denom ? j : 0.5)) + this.angle_start + angle_offset;

        if (this.INHERIT_ANGLE && castPoint instanceof Projectile) {
          angle += castPoint.angle;
        }

        boardState.addProjectile(
          Projectile.createProjectile(
            playerID,
            this.projectileType,
            castPoint,
            castPoint,
            angle,
            this.abilityDef,
            {
              speed: this.bullet_speed,
              gravity: this.GRAVITY,
              size: 3,
              trail_length: 4,
              curve_handler: ProjectileCurveHandler.getCurveHandler(
                this.abilityDef.getOptionalParam('curve_def', null),
                angle,
                angle,
              ),
            }
          ).addUnitHitCallback(this.unitHitCallback.bind(this))
          .addTimeoutHitCallback(this.timeoutHitCallback.bind(this))
          .addTimeoutCallback(this.timeoutCallback.bind(this))
          .addCollisionHitCallback(this.collisionHitCallback.bind(this))
          .addOnKillCallback(this.onKillCallback.bind(this))
        );
      }
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.ACTIVATE_ON_TICK;
  }
}
