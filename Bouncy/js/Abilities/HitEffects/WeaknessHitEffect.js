class WeaknessHitEffect extends HitEffect {
  doHitEffectOnUnit(boardState, unit, intersection, projectile) {
    unit.addStatusEffect(
      new WeaknessStatusEffect(
        idx(this.hitEffectDef, 'duration', 1),
      )
    );
  }
}

WeaknessHitEffect.createJSON = function(
  duration,
  aoeEffect
) {
  var toRet = {
    'effect': ProjectileShape.HitEffects.WEAKNESS,
    'duration': duration
  };
  if (aoeEffect !== undefined) {
    toRet['aoe_type'] = aoeEffect['aoe_type']// ProjectileShape.AOE_TYPES.BOX;
    toRet['aoe_size'] = aoeEffect['aoe_size']// {x: [-1, 1], y: [-1, 1]};
  }
  return toRet;
}
