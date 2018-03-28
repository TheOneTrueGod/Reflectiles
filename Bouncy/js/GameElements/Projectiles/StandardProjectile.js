class StandardProjectile extends Projectile {
  constructor(playerID, startPoint, targetPoint, angle, abilityDef, projectileOptions) {
    super(playerID, startPoint, targetPoint, angle, abilityDef, projectileOptions);
    this.max_bounces = abilityDef.getOptionalParam('max_bounces', 0);
    this.num_bounces = 0;
  }

  countBounce() {
    this.num_bounces += 1;
    if (this.max_bounces >= 0) {
      if (this.num_bounces > this.max_bounces) {
        this.delete();
      }
    }
  }

  hitUnit(boardState, unit, intersection) {
    super.hitUnit(boardState, unit, intersection);
    let behaviour = null;
    if (intersection.line.forcePassthrough(this)) {
      behaviour = CollisionBehaviour.PASSTHROUGH;
    } else {
      behaviour = this.determineNextIntersectionBehaviour(intersection.line);
      this.incrementCollisionBehaviour(behaviour);
    }

    let throwProjectileEvent = (event) => {
      return this.throwProjectileEvent(event, boardState, unit, intersection);
    };

    if (behaviour !== CollisionBehaviour.NOTHING) {
      if (
        throwProjectileEvent(ProjectileEvents.ON_HIT) &&
        !unit.readyToDelete()
      ) {
        EffectFactory.createDamageEffect(boardState, intersection);
      }
    }

    if (behaviour === CollisionBehaviour.BOUNCE) {
      throwProjectileEvent(ProjectileEvents.ON_BOUNCE);
      throwProjectileEvent(ProjectileEvents.ON_COLLIDE);
    } else if (behaviour === CollisionBehaviour.PASSTHROUGH) {
      throwProjectileEvent(ProjectileEvents.PASSTHROUGH);
      throwProjectileEvent(ProjectileEvents.ON_COLLIDE);
    } else if (behaviour === CollisionBehaviour.TIMEOUT) {
      throwProjectileEvent(ProjectileEvents.ON_TIMEOUT);
      this.delete();
    }
  }
}
