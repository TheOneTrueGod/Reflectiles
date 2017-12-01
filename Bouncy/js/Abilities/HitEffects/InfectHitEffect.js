class InfectHitEffect extends HitEffect {
  constructor(hitEffectDef, abilityDef) {
    super(hitEffectDef, abilityDef);
    if (!this.hitEffectDef.initializedAbilDef) {
      throw new Exception("InfectHitEffect Definition requires abil_def as a property");
    }
  }

  doHitEffectOnUnit(boardState, unit, intersection, projectile) {
    unit.addStatusEffect(
      new InfectStatusEffect(
        idx(this.hitEffectDef, 'duration', 1),
        this.hitEffectDef.initializedAbilDef.index // ability def index
      )
    );
  }
}
