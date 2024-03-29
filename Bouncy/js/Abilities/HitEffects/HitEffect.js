class CantHitUnitError extends Error {}
class HitEffect {
  constructor(hitEffectDef, abilityDef) {
    this.hitEffectDef = hitEffectDef;
    this.abilityDef = abilityDef;
  }

  getOptionalParam(param, defaultValue) {
    if (param in this.hitEffectDef) {
      return this.hitEffectDef[param];
    }
    return defaultValue;
  }

  getAoEType() {
    return idx(this.hitEffectDef, "aoe_type", ProjectileShape.AOE_TYPES.NONE);
  }

  getAoESize() {
    return idx(this.hitEffectDef, "aoe_size", { x: [-1, 1], y: [-1, 1] });
  }

  doHitEffect(boardState, unit, intersection, source) {
    var AOEType = this.getAoEType();
    var aoeUnitsToHit = [];
    var damageDealt = 0;
    if (AOEType == ProjectileShape.AOE_TYPES.NONE) {
      damageDealt += this.doHitEffectOnUnit(
        boardState,
        unit,
        intersection,
        source
      );
    } else if (AOEType == ProjectileShape.AOE_TYPES.BOX) {
      var size = this.getAoESize();
      for (var x = size.x[0]; x <= size.x[1]; x++) {
        for (var y = size.y[0]; y <= size.y[1]; y++) {
          var targetPos = {
            x: unit.x + x * Unit.UNIT_SIZE,
            y: unit.y + y * Unit.UNIT_SIZE,
          };
          if (source && source instanceof Projectile) {
            source.createExplosionEffect(boardState, targetPos);
          } else if (this.abilityDef) {
            this.abilityDef.createExplosionEffect(boardState, targetPos);
          }
          var unitsAtPosition = boardState.sectors.getUnitsAtPosition(
            targetPos.x,
            targetPos.y
          );
          for (var targetUnit in unitsAtPosition) {
            aoeUnitsToHit.push(unitsAtPosition[targetUnit]);
          }
        }
      }
    } else if (AOEType == ProjectileShape.AOE_TYPES.CIRCLE) {
      var radius = idx(this.hitEffectDef, "aoe_size", 40);
      let unitsAtPosition = boardState.sectors.getUnitsInSquare({
        x1: source.x - radius,
        y1: source.y - radius,
        x2: source.x + radius,
        y2: source.y + radius,
      });

      if (source && source instanceof Projectile) {
        source.createExplosionEffect(boardState, source);
      } else if (this.abilityDef) {
        this.abilityDef.createExplosionEffect(boardState, source);
      }

      for (var targetUnit of unitsAtPosition) {
        let unit = boardState.findUnit(targetUnit);
        if (unit.isInRangeOfCircle(source, radius)) {
          aoeUnitsToHit.push(targetUnit);
        }
      }
    }
    if (aoeUnitsToHit) {
      aoeUnitsToHit = remove_duplicates(aoeUnitsToHit);
      aoeUnitsToHit.forEach(
        ((targetUnitID) => {
          let targetUnit = boardState.findUnit(targetUnitID);
          EffectFactory.createDamageEntireUnitEffect(boardState, targetUnit);
          damageDealt += this.doHitEffectOnUnit(
            boardState,
            targetUnit,
            null,
            source
          );
        }).bind(this)
      );
    }
    return damageDealt;
  }

  doHitEffectOnUnit(boardState, unit, intersection, projectile) {
    return 0;
  }

  meetsCondition(boardState, unit, intersection, projectile) {
    let damageCondition = this.getOptionalParam(
      "condition",
      DamageHitConditions.NONE
    );
    let time;
    // Use this later maybe
    //let conditionParam = this.getOptionalParam('condition_parameter', null);
    if (damageCondition === DamageHitConditions.NONE) {
      return true;
    }

    switch (damageCondition) {
      case DamageHitConditions.HAS_NEGATIVE_CONDITION:
        return unit.hasNegativeCondition();
      case DamageHitConditions.LIFETIME_ABOVE:
        time = this.getOptionalParam("condition_amount", 0);
        return projectile && boardState.tick - projectile.startTick >= time;
      case DamageHitConditions.LIFETIME_BELOW:
        time = this.getOptionalParam("condition_amount", 0);
        return projectile && boardState.tick - projectile.startTick <= time;
      default:
        return false;
    }
  }
}

HitEffect.getHitEffectFromType = function (
  hitEffectDef,
  abilityDef,
  projectileShape
) {
  switch (hitEffectDef.effect) {
    case ProjectileShape.HitEffects.POISON:
      return new PoisonHitEffect(hitEffectDef, abilityDef);
    case ProjectileShape.HitEffects.DAMAGE:
      return new DamageHitEffect(hitEffectDef, abilityDef);
    case ProjectileShape.HitEffects.FREEZE:
      return new FreezeHitEffect(hitEffectDef, abilityDef);
    case ProjectileShape.HitEffects.DISARM:
      return new DisarmHitEffect(hitEffectDef, abilityDef);
    case ProjectileShape.HitEffects.IMMOBILIZE:
      return new ImmobilizeHitEffect(hitEffectDef, abilityDef);
    case ProjectileShape.HitEffects.BULLET_SPLIT:
      return new BulletSplitHitEffect(
        hitEffectDef,
        abilityDef,
        projectileShape
      );
    case ProjectileShape.HitEffects.INFECT:
      return new InfectHitEffect(hitEffectDef, abilityDef);
    case ProjectileShape.HitEffects.WEAKNESS:
      return new WeaknessHitEffect(hitEffectDef, abilityDef);
    case ProjectileShape.HitEffects.TAUNT:
      return new TauntHitEffect(hitEffectDef, abilityDef);
    case ProjectileShape.HitEffects.PLAYER_ARMOUR:
      return new PlayerArmourHitEffect(hitEffectDef, abilityDef);
    case ProjectileShape.HitEffects.DISABLE_SHIELD:
      return new DisableShieldHitEffect(hitEffectDef, abilityDef);
    case ProjectileShape.HitEffects.SPECIAL_STATUS:
      return new SpecialStatusHitEffect(hitEffectDef, abilityDef);
    case ProjectileShape.HitEffects.USE_ABILITY:
      return new UseAbilityEffect(hitEffectDef, abilityDef, projectileShape);
    case ProjectileShape.HitEffects.SHOOTER_BUFF:
      return new ShooterBuffEffect(hitEffectDef, abilityDef, projectileShape);
    case ProjectileShape.HitEffects.COOLDOWN_REDUCTION:
      return new CooldownReductionHitEffect(
        hitEffectDef,
        abilityDef,
        projectileShape
      );
    case ProjectileShape.HitEffects.NEGATIVE_CONDITION_TIME_MODIFICATION:
      return new NegativeConditionModifierHitEffect(
        hitEffectDef,
        abilityDef,
        projectileShape
      );
    case ProjectileShape.HitEffects.APPLY_DOT_TICK:
      return new ApplyDamageOverTimeEffectHitEffect(
        hitEffectDef,
        abilityDef,
        projectileShape
      );
    case ProjectileShape.HitEffects.SPREAD_DEBUFFS:
      return new SpreadDebuffsHitEffect(
        hitEffectDef,
        abilityDef,
        projectileShape
      );
  }
  alert("Undefined hit effect: " + hitEffectDef.effect);
  throw new Error("undefined hit effect: " + hitEffectDef.effect);
  return new HitEffect(hitEffectDef, abilityDef);
};
