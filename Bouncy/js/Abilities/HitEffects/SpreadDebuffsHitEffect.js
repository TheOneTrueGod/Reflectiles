class SpreadDebuffsHitEffect extends HitEffect {
  doHitEffectOnUnit(boardState, unit, intersection, projectile) {
    if (!this.meetsCondition(boardState, unit, intersection, projectile)) {
      return 0;
    }

    console.log("Spread Debuffs");
  }
}
