class PlayerArmourHitEffect extends HitEffect {
  doHitEffectOnUnit(boardState, playerUnit, intersection, source) {
    if (!(playerUnit instanceof UnitCore)) {
      throw new Error("PlayerArmour can only be put on players");
    }

    let oldStatusEffect = playerUnit.getStatusEffect(PlayerArmourStatusEffect);
    let effectBase = idx(this.hitEffectDef, "effect_base", 1);
    let duration = idx(this.hitEffectDef, "duration", 2);
    if (oldStatusEffect) {
      oldStatusEffect.amount += effectBase;
      oldStatusEffect.duration = Math.min(duration, oldStatusEffect.duration);
    } else {
      playerUnit.addStatusEffect(
        new PlayerArmourStatusEffect(
          duration, // duration
          effectBase // armourAmount
        )
      );
    }
  }
}

PlayerArmourHitEffect.createJSON = function (duration, aoeEffect) {
  var toRet = {
    effect: ProjectileShape.HitEffects.PLAYER_ARMOUR,
    duration: duration,
  };
  if (aoeEffect !== undefined) {
    toRet["aoe_type"] = aoeEffect["aoe_type"]; // ProjectileShape.AOE_TYPES.BOX;
    toRet["aoe_size"] = aoeEffect["aoe_size"]; // {x: [-1, 1], y: [-1, 1]};
  }
  return toRet;
};
