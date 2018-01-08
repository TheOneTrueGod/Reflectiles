class SingleHitProjectile extends Projectile {
  hitUnit(boardState, unit, intersection) {
    super.hitUnit(boardState, unit, intersection);
    this.unitHitCallback && this.unitHitCallback(
      boardState,
      unit,
      intersection,
      this
    );

    if (
      !unit.readyToDelete() &&
      (!intersection.line || !intersection.line.forcePassthrough(this))
    ) {
      EffectFactory.createDamageEffect(boardState, intersection);
    }

    if (
      !intersection.line.forceBounce(this) &&
      !intersection.line.forcePassthrough(this)
    ) {
      this.delete();
    }
  }
}
