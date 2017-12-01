class PoisonHitEffect extends HitEffect {
  doHitEffectOnUnit(boardState, unit, intersection, projectile) {
    unit.addStatusEffect(
      new PoisonStatusEffect(
        idx(this.hitEffectDef, 'duration', 1),
        idx(this.hitEffectDef, 'damage', 0)
      )
    );
  }
}

PoisonHitEffect.createJSON = function(
  baseDamage,
  duration,
  aoeEffect
) {
  var toRet = {
    'effect': ProjectileShape.HitEffects.POISON,
    'damage': baseDamage,
    'duration': duration
  };
  if (aoeEffect !== undefined) {
    toRet['aoe_type'] = aoeEffect['aoe_type']// ProjectileShape.AOE_TYPES.BOX;
    toRet['aoe_size'] = aoeEffect['aoe_size']// {x: [-1, 1], y: [-1, 1]};
  }
  return toRet;
}
