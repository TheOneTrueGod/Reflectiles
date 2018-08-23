class AbilityCore19 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let damagePerkPct = (
      idx(perkPcts, 'damage 0-1', 0) +
      idx(perkPcts, 'damage 0-2', 0) +
      idx(perkPcts, 'damage 3', 0) +
      idx(perkPcts, 'damage 2-1', 0) * 2 +
      idx(perkPcts, 'damage 2', 0) +
      idx(perkPcts, 'damage 2-2', 0) * 2 +
      // First branch
      idx(perkPcts, 'damage 6-1', 0) * 2 +
      idx(perkPcts, 'damage 6-2', 0) +
      // Second branch
      idx(perkPcts, 'damage 6-3', 0) +
      idx(perkPcts, 'damage 7-1', 0) * 2 +
      // Last branch
      idx(perkPcts, 'damage 6-4', 0) +
      idx(perkPcts, 'damage 7-2', 0) * 2 +
      // Other minor sources of damage
      this.hasPerk(perkPcts, 'duration up 1-1', 0) * 0.5 +
      this.hasPerk(perkPcts, 'duration up 1-2', 0) * 0.5 +
      this.hasPerk(perkPcts, 'duration up 3' , 0) * 0.5 +
      this.hasPerk(perkPcts, 'duration up 4' , 0) * 0.5 +
      this.hasPerk(perkPcts, 'duration down 1-1', 0) * 0.5 +
      this.hasPerk(perkPcts, 'duration down 5' , 0) * 0.5
    ) / (11 + 3);

    let base_duration = 4; // min: 2, max: 8
    let max_duration = 8;

    let duration = base_duration +
      (this.hasPerk(perkPcts, 'duration up 1-1') ? 1 : 0) +
      (this.hasPerk(perkPcts, 'duration up 1-2') ? 1 : 0) +
      (this.hasPerk(perkPcts, 'duration up 3') ? 1 : 0) +
      (this.hasPerk(perkPcts, 'duration up 4') ? 1 : 0) +
      (this.hasPerk(perkPcts, 'duration down 1-1') ? -1 : 0) +
      (this.hasPerk(perkPcts, 'duration down 5') ? -1 : 0);

    let AoE = this.hasPerk(perkPcts, 'AoE up 2') ? {x:[-2,2],y:[-1,1]} : {x:[-1,1],y:[-1,1]};
    let totalDamage = lerp(300, 4000, damagePerkPct);
    if (duration < base_duration) {
      totalDamage *= lerp(0.8, 1, (duration - 2) / (base_duration - 2));
    }

    if (this.hasPerk(perkPcts, 'intense poison')) {
      AoE.x[0] += 1; AoE.x[1] -= 1;
      AoE.y[0] += 1; AoE.y[1] -= 1;
      duration += 1;
      if (this.hasPerk(perkPcts, 'AoE up 2')) {
        totalDamage *= 1.5;
      } else {
        totalDamage *= 2;
      }
    }
    let damageEffects = [];
    if (this.hasPerk(perkPcts, 'giant cloud')) {
      AoE.x[0] -= 1; AoE.x[1] += 1; AoE.y[0] -= 1;
      totalDamage /= 2;
    }

    if (this.hasPerk(perkPcts, 'bouncing bullets')) {
      AoE = {x: [-1, 1], y:[-1, this.hasPerk(perkPcts, 'AoE up 2') ? 1 : 0]};
    }

    let impactPct = lerp(0, 0.3, (
      idx(perkPcts, 'impact damage') +
      idx(perkPcts, 'impact damage 5')
    ) / 2);

    if (impactPct > 0) {
      var impactDamage = Math.round(totalDamage * impactPct);
      totalDamage -= impactDamage;
      damageEffects.push({
        damage: impactDamage,
        effect:ProjectileShape.HitEffects.DAMAGE,
        aoe_type: "BOX",
        aoe_size: AoE,
      });
    }

    let damagePerTurn = Math.round(totalDamage / duration);

    damageEffects.push({
      damage: damagePerTurn,
      duration: duration,
      effect:ProjectileShape.HitEffects.POISON,
      aoe_type: "BOX",
      aoe_size: AoE,
    });

    if (this.hasPerk(perkPcts, 'toxic fumes')) {
      damageEffects.unshift({
        damage: damagePerTurn / 2,
        duration: duration - 1,
        effect: ProjectileShape.HitEffects.POISON,
        aoe_type: ProjectileShape.AOE_TYPES.BOX,
        aoe_size: {x: [AoE.x[0] - 1, AoE.x[1] + 1], y: [AoE.y[0] - 1, AoE.y[1] + 1]},
      });
    }

    let sizeX = AoE.x[1] - AoE.x[0] + 1;
    let sizeY = AoE.y[1] - AoE.y[0] + 1;

    // description
    let description = 'Fires a poison shot, poisoning all enemies in a <<' + sizeX + '>>x<<' + sizeY + '>> area<br>';
    if (impactPct > 0) {
      description += 'Deals <<' + impactDamage + '>> damage, and ';
    } else {
      description += 'Deals ';
    }
    description += '<<' + damagePerTurn + '>> poison damage per turn for <<' + duration + '>> turns.<br>';
    if (this.hasPerk(perkPcts, 'toxic fumes')) {
      description += 'Also poisons enemies in a <<' + (sizeX + 2) + '>>x<<' + (sizeY + 2) + '>> area for half the damage and one less turn<br>';
    }
    if (this.hasPerk(perkPcts, 'bouncing bullets')) {
      description += 'The shot also bounces <<' + (this.hasPerk(perkPcts, 'another bounce') ? 'twice' : 'once') + '>>.<br>';
    }

    const rawAbil = {
      name: 'Poison Explosion',
      description: description,
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('poison_sheet')
        .setCoords({left: 53, top: 85, right: 72, bottom: 93})
        .setExplosion(AbilityStyle.getExplosionPrefab(AbilityStyle.EXPLOSION_PREFABS.POISON))
        .setRotation(-Math.PI).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects: [],
      timeout_hit_effects:[],
      icon: "/Bouncy/assets/icons/poison-gas.png",
      charge: this.getCooldown(perkList, perkPcts),
    };

    let numBounces = this.hasPerk(perkPcts, 'bouncing bullets') + this.hasPerk(perkPcts, 'another bounce');

    if (this.hasPerk(perkPcts, 'bouncing bullets')) {
      rawAbil.hit_effects = rawAbil.hit_effects.concat(damageEffects);
      rawAbil.collision_behaviours = [{
        behaviour: CollisionBehaviour.BOUNCE,
        count: numBounces,
      }];
      rawAbil.wall_bounces = AbilityConstants.MAJOR_WALL_BOUNCES + numBounces;
    } else {
      rawAbil.timeout_hit_effects = rawAbil.timeout_hit_effects.concat(damageEffects);
    }

    if (this.hasPerk(perkPcts, 'passthrough')) {
      rawAbil.collision_behaviours = [
        {behaviour: CollisionBehaviour.PASSTHROUGH, count: 1},
      ];
    }

    rawAbil.description = description;

    return AbilityDef.createFromJSON(rawAbil);
  }

  static getCooldown(perkList, perkPcts) {
    let perkCount = perkList.length;
    let cooldown = 6 + 0.05 * perkCount;
    cooldown -= idx(perkPcts, 'cooldown 3', 0) * 4;
    cooldown -= idx(perkPcts, 'cooldown 3-2', 0) * 4;
    cooldown -= idx(perkPcts, 'cooldown 7', 0) * 4;
    cooldown = Math.round(cooldown);
    if (cooldown <= 1) {
      return null;
    }

    return {initial_charge: -1, max_charge: cooldown, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetPerkList() {
    let perkList = [
      (new AbilityPerkNode('damage 0-1',    5, [0, 2])),
      (new AbilityPerkNode('damage 0-2',    5, [0, 4])),
      // Level 1
      (new MaxxedAbilityPerkNode('duration up 1-1',      3, [1, 1]))
        .addRequirement(new PerkLevelRequirement('damage 0-1')),
      (new MaxxedAbilityPerkNode('duration up 1-2',      3, [1, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('damage 0-1'),
          new PerkLevelRequirement('damage 0-2')]
        )),
      (new MaxxedAbilityPerkNode('duration down 1-1',    3, [1, 5]))
        .addRequirement(new PerkLevelRequirement('damage 0-2')),
      // Level 2
      (new AbilityPerkNode('damage 2-1',    5, [2, 0]))
        .addRequirement(new PerkLevelRequirement('duration up 1-1')),
      (new MaxxedAbilityPerkNode('AoE up 2',    3, [2, 2]))
        .addRequirement(new PerkLevelRequirement('damage 0-1')),
      (new AbilityPerkNode('damage 2',    5, [2, 4]))
        .addRequirement(new PerkLevelRequirement('damage 0-2')),
      (new AbilityPerkNode('damage 2-2',    5, [2, 6]))
        .addRequirement(new PerkLevelRequirement('duration down 1-1')),
      // Level 3
      (new AbilityPerkNode('damage 3',    5, [3, 1]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('AoE up 2'),
          new PerkLevelRequirement('duration up 1-1')]
        )),
      (new AbilityPerkNode('cooldown 3',    5, [3, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('AoE up 2'),
          new PerkLevelRequirement('damage 2')]
        )),
      (new AbilityPerkNode('cooldown 3-2',    5, [3, 5]))
        .addRequirement(new PerkLevelRequirement('duration down 1-1')),
      // Level 4
      (new MaxxedAbilityPerkNode('duration up 3',    3, [4, 0]))
        .addRequirement(new PerkLevelRequirement('damage 3')),
      (new AbilityPerkNode('impact damage', 3, [4, 2]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('cooldown 3'),
          new PerkLevelRequirement('damage 3')]
        )),
      (new MaxxedAbilityPerkNode('duration up 4',    3, [4, 4]))
        .addRequirement(new PerkLevelRequirement('damage 2')),
      // Level 5
      (new MaxxedAbilityPerkNode('giant cloud',     3, [5, 1]))
        .addRequirement(new PerkLevelRequirement('damage 3'))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('intense poison', 1)))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('bouncing bullets', 1))),
      (new MaxxedAbilityPerkNode('bouncing bullets', 3, [5, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('duration up 4'),
          new PerkLevelRequirement('cooldown 3')]
        ))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('intense poison', 1)))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('giant cloud', 1))),
      (new AbilityPerkNode('impact damage 5', 3, [6, 4]))
        .addRequirement(new PerkLevelRequirement('duration up 4')),
      (new MaxxedAbilityPerkNode('intense poison', 3, [5, 5]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('duration up 4'),
          new PerkLevelRequirement('cooldown 3-2')]
        ))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('bouncing bullets', 1)))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('giant cloud', 1))),
      // Level 6
      (new AbilityPerkNode('damage 6-1',    5, [6, 0]))
        .addRequirement(new PerkLevelRequirement('giant cloud')),
      (new AbilityPerkNode('damage 6-2',    5, [6, 1]))
        .addRequirement(new PerkLevelRequirement('giant cloud')),
      (new MaxxedAbilityPerkNode('another bounce',    5, [6, 2]))
        .addRequirement(new PerkLevelRequirement('bouncing bullets')),
      (new AbilityPerkNode('damage 6-3',    5, [6, 3]))
        .addRequirement(new PerkLevelRequirement('bouncing bullets')),
      (new MaxxedAbilityPerkNode('duration down 5',    5, [6, 6]))
        .addRequirement(new PerkLevelRequirement('intense poison')),
      (new AbilityPerkNode('damage 6-4',    5, [6, 5]))
        .addRequirement(new PerkLevelRequirement('intense poison')),
      // Level 7
      (new AbilityPerkNode('range 7',    5, [7, 0]))
        .addRequirement(new PerkLevelRequirement('damage 6-2')),
      (new MaxxedAbilityPerkNode('toxic fumes',    5, [7, 1]))
        .addRequirement(new PerkLevelRequirement('damage 6-2')),
      (new AbilityPerkNode('damage 7-1',            5, [7, 2]))
        .addRequirement(new PerkLevelRequirement('another bounce')),
      (new AbilityPerkNode('cooldown 7',             5, [7, 3]))
        .addRequirement(new PerkLevelRequirement('damage 6-3')),
      (new AbilityPerkNode('damage 7-2',            5, [7, 5]))
        .addRequirement(new PerkLevelRequirement('damage 6-4')),
      (new MaxxedAbilityPerkNode('passthrough',     5, [7, 6]))
        .addRequirement(new PerkLevelRequirement('damage 6-4')),

    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }

  static GetDemoTurns() {
    return 5;
  }

  static GetAimOffsets() {
    return {x: 30, y: -30};
  }
}

AbilityCore.coreList[19] = AbilityCore19;
