class AbilityCore5 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let num_bullets = Math.floor(lerp(6, 14,
      (
        this.hasPerk(perkPcts, 'more bullets 1') * 1 +
        idx(perkPcts, 'more bullets 3', 0) * 7
      ) / 8
    ));

    let totalDamage = lerp(1200, 1800, (
      this.hasPerk(perkPcts, 'damage 1', 0) +
      idx(perkPcts, 'more bullets 3', 0) +
      idx(perkPcts, 'fire damage 2', 0) * 4
    ) / 6);
    let damageType = idx(perkPcts, 'fire damage 2', 0) > 0 ?
      Unit.DAMAGE_TYPE.FIRE :
      Unit.DAMAGE_TYPE.NORMAL;

    let duration = lerp(70, 250, idx(perkPcts, 'increase range 2', 0));

    let collisionBehaviours = [];
    let wallBounces = AbilityConstants.MINOR_WALL_BOUNCES;
    let bounceDamagePercent = 0;
    if (this.hasPerk(perkPcts, 'bouncing 1')) {
      totalDamage *= AbilityConstants.BOUNCE_DAMAGE_PENALTY;
      wallBounces += 1;
      collisionBehaviours.push(
        {behaviour: CollisionBehaviour.BOUNCE, count: 1}
      );
      bounceDamagePercent = lerp(0.5, 1.5, idx(perkPcts, 'bounce damage 2', 0));
    }

    let passthroughDamagePercent = 0;
    if (this.hasPerk(perkPcts, 'pass through 1')) {
      totalDamage *= AbilityConstants.PASSTHROUGH_DAMAGE_PENALTY;
      wallBounces += 1;
      collisionBehaviours.push(
        {behaviour: CollisionBehaviour.PASSTHROUGH, count: 1}
      );
      passthroughDamagePercent = lerp(0.5, 1.5, idx(perkPcts, 'pass through damage 2', 0));
    }

    let projectileStyle = (new AbilitySheetSpriteAbilityStyleBuilder())
      .setSheet('bullet_sheet').setCoordNums(275, 69, 294, 78).setRotation(0);

    // Final damage calculations
    let shotDamage = Math.round(totalDamage / num_bullets);
    let bounceDamage = Math.round(shotDamage * bounceDamagePercent);
    let passthroughDamage = Math.round(shotDamage * passthroughDamagePercent);

    let finalHitDamage = bounceDamage ? bounceDamage : (passthroughDamage ? passthroughDamage : shotDamage);
    let firstHit = [{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: shotDamage, damage_type: damageType}];
    let finalHit = [{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: finalHitDamage, damage_type: damageType}];

    let statusDamage = 0;
    if (idx(perkPcts, 'damage on status 2', 0) > 0) {
      statusDamage = Math.floor(idx(perkPcts, 'damage on status 2', 0) * shotDamage);
      firstHit.push({effect: ProjectileShape.HitEffects.DAMAGE, base_damage: statusDamage, condition: DamageHitConditions.HAS_NEGATIVE_CONDITION, damage_type: damageType})
      finalHit.push({effect: ProjectileShape.HitEffects.DAMAGE, base_damage: statusDamage, condition: DamageHitConditions.HAS_NEGATIVE_CONDITION, damage_type: damageType})
    }

    let statusTimeIncrease = 0;
    if (idx(perkCounts, 'increase status duration 3', 0) >= 20) {
      statusTimeIncrease = 3;
    } else if (idx(perkCounts, 'increase status duration 3', 0) >= 10) {
      statusTimeIncrease = 2;
    } else if (idx(perkCounts, 'increase status duration 3', 0) > 0) {
      statusTimeIncrease = 1;
    }

    if (statusTimeIncrease > 0) {
      firstHit.push({effect: ProjectileShape.HitEffects.NEGATIVE_CONDITION_TIME_MODIFICATION, amount: statusTimeIncrease, damage_type: damageType});
      finalHit.push({effect: ProjectileShape.HitEffects.NEGATIVE_CONDITION_TIME_MODIFICATION, amount: statusTimeIncrease, damage_type: damageType});
    }

    let closeDamage = 0;
    if (idx(perkPcts, 'damage to near', 0) > 0) {
      closeDamage = Math.floor(idx(perkPcts, 'damage to near', 0) * shotDamage);
      firstHit.push({
        effect: ProjectileShape.HitEffects.DAMAGE, base_damage: closeDamage,
        condition: DamageHitConditions.LIFETIME_BELOW, condition_amount: duration / 2,
        damage_type: damageType
      });
      finalHit.push({
        effect: ProjectileShape.HitEffects.DAMAGE, base_damage: closeDamage,
        condition: DamageHitConditions.LIFETIME_BELOW, condition_amount: duration / 2,
        damage_type: damageType
      });
    }

    let farDamage = 0;
    if (idx(perkPcts, 'damage to far', 0) > 0) {
      farDamage = Math.floor(idx(perkPcts, 'damage to far', 0) * shotDamage);
      firstHit.push({
        effect: ProjectileShape.HitEffects.DAMAGE, base_damage: farDamage,
        condition: DamageHitConditions.LIFETIME_ABOVE, condition_amount: duration / 2,
        damage_type: damageType
      });
      finalHit.push({
        effect: ProjectileShape.HitEffects.DAMAGE, base_damage: farDamage,
        condition: DamageHitConditions.LIFETIME_ABOVE, condition_amount: duration / 2,
        damage_type: damageType
      });
    }

    let poisonDamage = 0;
    let poisonDuration = 0;
    if (this.hasPerk(perkPcts, 'poison 1')) {
      poisonDamage = 20;
      poisonDuration = 2;
      firstHit.push({
        effect: ProjectileShape.HitEffects.POISON,
        damage: poisonDamage,
        duration: poisonDuration
      });
      finalHit.push({
        effect: ProjectileShape.HitEffects.POISON,
        damage: poisonDamage,
        duration: poisonDuration
      });
    }

    let bounceExplosionRadius = 0;
    if (idx(perkPcts, 'bounce explosion 3', 0) > 0) {
      bounceExplosionRadius = lerp(
        Unit.UNIT_SIZE / 2.0,
        Unit.UNIT_SIZE,
        idx(perkPcts, 'bounce explosion 3', 0)
      );
    }
    if (bounceExplosionRadius > 0) {
      for (let i = 0; i < finalHit.length; i++) {
        finalHit[i].aoe_type = ProjectileShape.AOE_TYPES.CIRCLE,
        finalHit[i].aoe_size = bounceExplosionRadius;
      }

      projectileStyle.setExplosion(AbilityStyle.getExplosionPrefab(
        AbilityStyle.EXPLOSION_PREFABS.WHITE, bounceExplosionRadius
      ));
    }

    let killEffects = [];
    let killDamage = Math.floor(lerp(0, totalDamage / 8, idx(perkPcts, 'kills explode 3', 0)));
    if (killDamage > 0) {
      killEffects.push({
        effect: ProjectileShape.HitEffects.DAMAGE, base_damage: killDamage,
        damage_type: damageType, aoe_type: ProjectileShape.AOE_TYPES.BOX
      });
    }

    let max_angle = lerp(Math.PI / 6.0, Math.PI / 4.0, idx(perkPcts, 'wider spread 2', 0));
    let min_angle = lerp(Math.PI / 16.0, Math.PI / 24.0, idx(perkPcts, 'wider spread 2', 0));

    // final description building
    let descriptionBehaviours = [];
    if (this.hasPerk(perkPcts, 'bouncing 1')) {
      descriptionBehaviours.push('bounce once');
    }
    if (this.hasPerk(perkPcts, 'pass through 1')) {
      descriptionBehaviours.push('pierce once');
    }
    if (this.hasPerk(perkPcts, 'curving 1')) {
      descriptionBehaviours.push('curve');
    }
    if (this.hasPerk(perkPcts, 'poison 1')) {
      descriptionBehaviours.push('poison units for <<' + poisonDamage + '>> damage over <<' + poisonDuration + '>> turns');
    }
    if (damageType == Unit.DAMAGE_TYPE.FIRE) {
      descriptionBehaviours.push('deal <<Fire>> damage');
    }
    let description = 'Throw <<' + num_bullets + '>> knives';
    if (descriptionBehaviours.length > 0) {
      description += ' that ';
      description += this.turnListIntoEnglish(descriptionBehaviours);
    }
    description += '.<br>';

    // damage description building
    let damageDescriptions = [''];
    if (this.hasPerk(perkPcts, 'bouncing 1')) {
      let bounceString = ' then <<' + bounceDamage + '>> damage';
      if (bounceExplosionRadius > 0) {
        bounceString += ' in a <<' + bounceExplosionRadius + '>> radius';
      }
      damageDescriptions.push(bounceString);
    }

    if (this.hasPerk(perkPcts, 'pass through 1')) {
      damageDescriptions.push(' then <<' + passthroughDamage + '>> damage');
    }

    if (statusDamage > 0) {
      damageDescriptions.push(" an additional <<" + statusDamage + ">> damage to enemies with negative conditions");
    }

    if (closeDamage > 0) {
      damageDescriptions.push(" <<" + closeDamage + ">> more damage to nearby enemies");
    }

    if (farDamage > 0) {
      damageDescriptions.push(" <<" + farDamage + ">> more damage to far away enemies");
    }

    description += 'Each one deals <<' + shotDamage + '>> ';
    description += 'damage';
    if (damageDescriptions.length > 0) {
      description += this.turnListIntoEnglish(damageDescriptions);
    }

    description += '.';

    if (statusTimeIncrease) {
      description += "<br>Increases the duration of all negative effects on any units hit by a maximum of <<" +
        statusTimeIncrease + ">> turns.  Can't affect the same enemy twice.";
    }

    if (killDamage > 0) {
      description += "<br>If this kills a unit, it explodes dealing <<" +
        killDamage + ">> damage to adjacent enemies.";
    }

    const rawAbil = {
      name: 'Knife Toss',
      description,
      card_text_description: '[[num_bullets]] X <<' + shotDamage + '>>',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.TRI_SHOT,
      style: projectileStyle.build(),
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setSheet('weapons_sheet')
        .setCoordNums(54, 2, 75, 23)
        .build(),
      num_bullets: num_bullets,
      collision_behaviours: collisionBehaviours,
      wall_bounces: wallBounces,
      max_angle,
      duration,
      collision_effects: firstHit,
      on_kill_effects: killEffects,
      timeout_hit_effects: finalHit,
      icon: "/Bouncy/assets/icons/thrown-daggers.png",
    };

    let cooldown = this.getCooldown(perkList, perkPcts);
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    if (this.hasPerk(perkPcts, 'curving 1')) {
      rawAbil.curve = {
        curve_type: ProjectileCurveHandler.curveTypes.TO_AIM,
        curve_time: 10,
        curve_delay: Math.floor(duration / 8),
      }; // TODO: THIS IS NOT ACTUALLY USED.  DEAL WITH IT LATER
      rawAbil.curve_delay = Math.floor(duration / 8);
      rawAbil.curve_time = Math.floor(duration / 4);
      rawAbil.curve_amount = -Math.PI / 6;
    }

    return AbilityDef.createFromJSON(rawAbil);
  }

  static getCooldown(perkList, perkPcts) {
    let cooldown =
      idx(perkPcts, 'increase status duration 3', 0) * 4 +
      idx(perkPcts, 'damage to near', 0) * 2 +
      idx(perkPcts, 'damage to far', 0) * 2 +
      idx(perkPcts, 'bounce explosion 3', 0) * 3 +
      idx(perkPcts, 'kills explode 3', 0) * 3 +
      idx(perkPcts, 'more bullets 3', 0) * 2
      ;

    cooldown = Math.round(cooldown);
    if (cooldown <= 1) {
      return null;
    }

    return {initial_charge: -1, max_charge: cooldown, charge_type: "TURNS"};
  }

  static turnListIntoEnglish(list, includeAnd) {
    let text = "";
    if (includeAnd && list.length == 1) {
      text += " and"
    }
    if (list.length > 0) {
      text += list[0];
      for (var i = 1; i < list.length - 1; i++) {
        text += ", ";
        text += list[i];
      }
      if (list.length > 1) {
        text += ", and " + list[list.length - 1];
      }
    }
    return text;
  }

  static GetPerkList() {
    let perkList = [
      // Tier 1
      // Increase damage to single target
      (new MaxxedAbilityPerkNode('poison 1',      3, [2, 2]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('damage 1', 1))),
      (new MaxxedAbilityPerkNode('bouncing 1',        3, [2, 3]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('pass through 1', 1))),
      (new MaxxedAbilityPerkNode('curving 1',         3, [2, 4]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('more bullets 1', 1))),
      (new MaxxedAbilityPerkNode('damage 1',          3, [4, 4]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('poison 1', 1))),
      (new MaxxedAbilityPerkNode('pass through 1',     3, [4, 3]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('bouncing 1', 1))),
      (new MaxxedAbilityPerkNode('more bullets 1',    3, [4, 2]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('curving 1', 1))),

      // Tier 2
      (new AbilityPerkNode('damage on status 2',        10, [1, 1]))
        .addRequirement(new PerkLevelRequirement('poison 1'))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('bouncing 1'),
          new PerkLevelRequirement('more bullets 1')
        ])),
      (new AbilityPerkNode('bounce damage 2',           10, [1, 3]))
        .addRequirement(new PerkLevelRequirement('bouncing 1'))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('poison 1'),
          new PerkLevelRequirement('curving 1')
        ])),
      (new AbilityPerkNode('increase range 2',          10, [1, 5]))
        .addRequirement(new PerkLevelRequirement('curving 1'))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('bouncing 1'),
          new PerkLevelRequirement('damage 1')
        ])),
      (new AbilityPerkNode('fire damage 2',             10, [5, 5]))
        .addRequirement(new PerkLevelRequirement('damage 1'))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('curving 1'),
          new PerkLevelRequirement('pass through 1')
        ])),
      (new AbilityPerkNode('pass through damage 2',             10, [5, 3]))
        .addRequirement(new PerkLevelRequirement('pass through 1'))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('damage 1'),
          new PerkLevelRequirement('more bullets 1')
        ])),
      (new AbilityPerkNode('wider spread 2',           10, [5, 1]))
        .addRequirement(new PerkLevelRequirement('more bullets 1'))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('pass through 1'),
          new PerkLevelRequirement('poison 1')
        ])),

      // Tier 3
      (new AbilityPerkNode('damage to near',           20, [3, 0]))
        .addRequirement(new PerkLevelRequirement('damage on status 2'))
        .addRequirement(new PerkLevelRequirement('wider spread 2')),
      (new AbilityPerkNode('more bullets 3',           20, [6, 2]))
        .addRequirement(new PerkLevelRequirement('wider spread 2'))
        .addRequirement(new PerkLevelRequirement('pass through damage 2')),
      (new AbilityPerkNode('kills explode 3',                 20, [6, 4]))
        .addRequirement(new PerkLevelRequirement('pass through damage 2'))
        .addRequirement(new PerkLevelRequirement('fire damage 2')),
      (new AbilityPerkNode('damage to far',                   20, [3, 6]))
        .addRequirement(new PerkLevelRequirement('fire damage 2'))
        .addRequirement(new PerkLevelRequirement('increase range 2')),
      (new AbilityPerkNode('bounce explosion 3',             20, [0, 4]))
        .addRequirement(new PerkLevelRequirement('bounce damage 2'))
        .addRequirement(new PerkLevelRequirement('increase range 2')),
      (new AbilityPerkNode('increase status duration 3',     20, [0, 2]))
        .addRequirement(new PerkLevelRequirement('bounce damage 2'))
        .addRequirement(new PerkLevelRequirement('damage on status 2')),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }

  static GetAimOffsets() {
    return {x: 30, y: -30};
  }
}

AbilityCore.coreList[5] = AbilityCore5;
