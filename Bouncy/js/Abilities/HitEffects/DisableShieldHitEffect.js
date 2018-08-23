class DisableShieldHitEffect extends HitEffect {
  doHitEffectOnUnit(boardState, unit, intersection, projectile) {
    unit.addStatusEffect(
      new DisableShieldStatusEffect(
        idx(this.hitEffectDef, 'duration', 1),
      )
    );
  }
}

DisableShieldHitEffect.createJSON = function(
  duration,
  aoeEffect
) {
  var toRet = {
    'effect': ProjectileShape.HitEffects.DISABLE_SHIELD,
    'duration': duration
  };
  if (aoeEffect !== undefined) {
    toRet['aoe_type'] = aoeEffect['aoe_type']// ProjectileShape.AOE_TYPES.BOX;
    toRet['aoe_size'] = aoeEffect['aoe_size']// {x: [-1, 1], y: [-1, 1]};
  }
  return toRet;
}
