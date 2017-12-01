class BouncingProjectile extends Projectile {
  constructor(startPoint, targetPoint, angle, abilityDef) {
    super(startPoint, targetPoint, angle, abilityDef, {});
    this.max_bounces = abilityDef.getOptionalParam('max_bounces', -1);
  }

  countBounce() {
    if (this.max_bounces > 0) {
      this.max_bounces -= 1;
      if (this.max_bounces <= 0) {
        this.delete();
      }
    }
  }

  hitWall(boardState, intersection) {
    super.hitWall(boardState, intersection);
  }

  hitUnit(boardState, unit, intersection) {
    super.hitUnit(boardState, unit, intersection);
    this.unitHitCallback(
      boardState,
      unit,
      intersection,
      this
    );

    if (intersection.line && !unit.readyToDelete()) {
      EffectFactory.createDamageEffect(boardState, intersection);
    }

    this.countBounce();
  }
}
