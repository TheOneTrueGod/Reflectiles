class ShooterBuffEffect extends HitEffect {
  constructor(hitEffectDef, abilityDef) {
    super(hitEffectDef, abilityDef);
  }

  doHitEffect(boardState, unit, intersection, source) {
    let playerUnit = boardState.getPlayerUnit(source.playerID);
    if (!playerUnit) {
      console.warn("Player ID [" + projectile.playerID + "] on projectile not found");
      return;
    }
    let oldStatusEffect = playerUnit.getStatusEffect(PlayerDamageStatusEffect);
    let effectMax = idx(this.hitEffectDef, 'effect_max', 2);
    let effectGain = idx(this.hitEffectDef, 'effect_gain', 0.05);
    let effectBase = idx(this.hitEffectDef, 'effect_base', 1);
    let duration = idx(this.hitEffectDef, 'duration', 2);
    if (oldStatusEffect) {
      if (oldStatusEffect.amount < effectMax) {
        oldStatusEffect.amount = Math.min(oldStatusEffect.amount + effectGain, effectMax);
      }
      if (oldStatusEffect.amount <= effectMax) {
        oldStatusEffect.duration = Math.max(duration, oldStatusEffect.duration);
      }
    } else {
      playerUnit.addStatusEffect(
        new PlayerDamageStatusEffect(
          duration, // duration
          effectBase, // multiplier
        )
      );
    }
  }
}
