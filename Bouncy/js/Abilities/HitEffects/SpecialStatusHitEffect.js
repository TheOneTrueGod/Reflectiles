class SpecialStatusHitEffect extends HitEffect {
  doHitEffectOnUnit(boardState, unit, intersection, projectile) {
    unit.addStatusEffect(
      new SpecialStatusEffect(
        idx(this.hitEffectDef, 'duration', 1),
        idx(this.hitEffectDef, 'special_effect', null),
      )
    );
  }
}

SpecialStatusHitEffect.createJSON = function(
  duration,
  specialEffect,
  aoeEffect
) {
  var toRet = {
    'effect': ProjectileShape.HitEffects.SPECIAL_STATUS,
    'duration': duration,
    'special_effect': specialEffect,
  };
  if (aoeEffect !== undefined) {
    toRet['aoe_type'] = aoeEffect['aoe_type']// ProjectileShape.AOE_TYPES.BOX;
    toRet['aoe_size'] = aoeEffect['aoe_size']// {x: [-1, 1], y: [-1, 1]};
  }
  return toRet;
}
