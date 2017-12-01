class FreezeHitEffect extends HitEffect {
  doHitEffectOnUnit(boardState, unit, intersection, projectile) {
    unit.addStatusEffect(
      new FreezeStatusEffect(
        idx(this.hitEffectDef, 'duration', 1),
      )
    );
  }
}

FreezeHitEffect.createJSON = function(
  duration,
  aoeEffect
) {
  var toRet = {
    'effect': ProjectileShape.HitEffects.FREEZE,
    'duration': duration
  };
  if (aoeEffect !== undefined) {
    toRet['aoe_type'] = aoeEffect['aoe_type']// ProjectileShape.AOE_TYPES.BOX;
    toRet['aoe_size'] = aoeEffect['aoe_size']// {x: [-1, 1], y: [-1, 1]};
  }
  return toRet;
}
