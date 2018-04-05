class NegativeConditionModifierHitEffect extends HitEffect {
  doHitEffectOnUnit(boardState, unit, intersection, projectile) {
    if (!this.meetsCondition(boardState, unit, intersection, projectile)) {
      return 0;
    }
    let increaseAmount = this.getOptionalParam('amount', 1);
    unit.increaseConditionDuration(increaseAmount);
  }
}
