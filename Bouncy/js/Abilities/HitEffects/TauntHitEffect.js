class TauntHitEffect extends HitEffect {
  doHitEffectOnUnit(boardState, unit, intersection, source) {
    unit.applyTaunt && unit.applyTaunt(source);
  }
}

TauntHitEffect.createJSON = function (duration, aoeEffect) {
  var toRet = {
    effect: ProjectileShape.HitEffects.TAUNT,
    duration: duration,
  };
  if (aoeEffect !== undefined) {
    toRet["aoe_type"] = aoeEffect["aoe_type"]; // ProjectileShape.AOE_TYPES.BOX;
    toRet["aoe_size"] = aoeEffect["aoe_size"]; // {x: [-1, 1], y: [-1, 1]};
  }
  return toRet;
};
