class ApplyDamageOverTimeEffectHitEffect extends HitEffect {
  doHitEffectOnUnit(boardState, unit, intersection, projectile) {
    if (!this.meetsCondition(boardState, unit, intersection, projectile)) {
      return 0;
    }

    unit.applyDamageOverTimeTick(boardState);
  }
}
