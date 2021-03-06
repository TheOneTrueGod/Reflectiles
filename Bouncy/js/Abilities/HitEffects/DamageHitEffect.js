class DamageHitEffect extends HitEffect {
  doHitEffectOnUnit(boardState, unit, intersection, projectile) {
    if (!this.meetsCondition(boardState, unit, intersection, projectile)) {
      return 0;
    }

    var is_penetrate = false;
    if (this.abilityDef && this.abilityDef.getProjectileType) {
      is_penetrate = this.abilityDef.getProjectileType() == ProjectileShape.ProjectileTypes.PENETRATE;
    }
    var damageType = idx(this.hitEffectDef, 'damage_type', Unit.DAMAGE_TYPE.NORMAL);
    var base_damage = idx(this.hitEffectDef, 'base_damage', 100);
    var pctBased = false;
    if (typeof base_damage == "string" && base_damage.substring(base_damage.length - 1) === "%") {
      var pct = base_damage.substring(0, base_damage.length - 1);
      base_damage = unit.health.current * pct / 100;
      var pctBased = true;
    }
    if (is_penetrate) {
      base_damage = base_damage - projectile.damageDealt;
    }
    let damageMod = 1;
    if (intersection && intersection.line instanceof UnitCriticalLine) {
      damageMod *= intersection.line.getCriticalMultiplier();
    }

    let damageBuff = projectile.getBuff ? projectile.getBuff(ProjectileDamageBuff.name) : null;
    if (damageBuff) {
      damageMod *= damageBuff.getAmount();
    }

    let weakenBuff = projectile.getBuff ? projectile.getBuff(ProjectileWeakenBuff.name) : null;
    if (weakenBuff) {
      damageMod *= weakenBuff.getAmount();
    }

    var finalDamage = base_damage * damageMod;

    var damageDealt = unit.dealDamage(boardState, finalDamage, projectile, damageType);
    if (is_penetrate && (Math.floor(finalDamage) == Math.floor(damageDealt))) {
      projectile.delete();
    }

    return damageDealt / damageMod;
  }
}

DamageHitConditions = {
  NONE: 'NONE',
  HAS_NEGATIVE_CONDITION: 'HAS_NEGATIVE_CONDITION',
  LIFETIME_BELOW: 'LIFETIME_BELOW',
  LIFETIME_ABOVE: 'LIFETIME_ABOVE',
}

DamageHitEffect.createJSON = function(
  baseDamage,
  aoeEffect
) {
  var toRet = {
    'effect': ProjectileShape.HitEffects.DAMAGE,
    'base_damage': baseDamage
  };
  if (aoeEffect !== undefined) {
    toRet['aoe_type'] = aoeEffect['aoe_type']// ProjectileShape.AOE_TYPES.BOX;
    toRet['aoe_size'] = aoeEffect['aoe_size']// {x: [-1, 1], y: [-1, 1]};
  }
  return toRet;
}
