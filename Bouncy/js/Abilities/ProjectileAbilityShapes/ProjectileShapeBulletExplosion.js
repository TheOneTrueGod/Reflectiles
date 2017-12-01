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
    this.bullet_speed = abilityDef.getOptionalParam('bullet_speed', 4);
    this.GRAVITY = abilityDef.getOptionalParam('gravity', {x: 0, y: 0.05});
    this.INHERIT_ANGLE = abilityDef.getOptionalParam('inherit_angle', false);
  }

  appendIconHTML($container) {
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 10px; left: 25px;"
      })
    );
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 20px; left: 15px;"
      })
    );
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 20px; left: 35px;"
      })
    );
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
    if (tick == this.ACTIVATE_ON_TICK) {
      for (var j = 0; j < this.num_bullets; j++) {
        var deltaAngle = this.angle_end - this.angle_start;
        var angle = (deltaAngle / this.num_bullets * j) + this.angle_start;

        if (this.INHERIT_ANGLE) {
          angle += Math.atan2(targetPoint.y - castPoint.y, targetPoint.x - castPoint.x);
        }

        boardState.addProjectile(
          Projectile.createProjectile(
            this.projectileType,
            castPoint,
            null,
            angle,
            this.abilityDef,
            {
              speed: this.bullet_speed,
              gravity: this.GRAVITY,
              size: 3,
              trail_length: 4
            }
          ).addUnitHitCallback(this.unitHitCallback.bind(this))
        );
      }
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.ACTIVATE_ON_TICK;
  }
}
