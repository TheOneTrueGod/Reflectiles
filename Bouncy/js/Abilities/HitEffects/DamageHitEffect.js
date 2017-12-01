class DamageHitEffect extends HitEffect {
  doHitEffectOnUnit(boardState, unit, intersection, projectile) {
    var is_penetrate = false;
    if (this.abilityDef && this.abilityDef.getProjectileType) {
      is_penetrate = this.abilityDef.getProjectileType() == ProjectileShape.ProjectileTypes.PENETRATE;
    }

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
    if (intersection && intersection.line instanceof UnitCriticalLine) {
      base_damage = base_damage * intersection.line.getCriticalMultiplier();
    }

    var finalDamage = base_damage;

    var damageDealt = unit.dealDamage(boardState, finalDamage);
    if (is_penetrate && (!unit.readyToDelete() || Math.floor(finalDamage) == Math.floor(damageDealt))) {
      projectile.delete();
    }
    return damageDealt;
  }
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
