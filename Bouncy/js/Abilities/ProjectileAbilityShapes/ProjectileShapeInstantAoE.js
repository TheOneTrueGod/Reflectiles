/* Params
 * [TODO] num_bullets (int) -- the number of bullets to be fired.
 */
class ProjectileShapeInstantAoE extends ProjectileShape {
  constructor(abilityDef) {
    super(abilityDef);
    this.ACTIVATE_ON_TICK = 0;
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
      const hitEffects = this.abilityDef.getHitEffects();
      for (let i = 0; i < hitEffects.length; i++) {
        const hitEffect = HitEffect.getHitEffectFromType(hitEffects[i], this.abilityDef, this);
        hitEffect.doHitEffect(boardState, targetPoint, null, targetPoint);
      }
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.ACTIVATE_ON_TICK;
  }
}
