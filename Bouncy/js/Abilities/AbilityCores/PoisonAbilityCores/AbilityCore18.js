class AbilityCore18 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let totalDamage = lerp(900, 8000,
      (
        // shard damage 1 and ghost damage are mutually exclusive.
        idx(perkPcts, 'shard damage 1', 0) +
        idx(perkPcts, 'ghost damage', 0) +

        // two shots and apply poison are mutually exclusive
        idx(perkPcts, 'two shots', 0) * 2 +
        idx(perkPcts, 'apply poison', 0) * 2 +

        idx(perkPcts, 'damage 3-1', 0) * 2 +
        idx(perkPcts, 'more shards 1', 0) * 2 +
        idx(perkPcts, 'more shards 2', 0) * 2 +
        idx(perkPcts, 'damage 3-2', 0) * 5 +
        idx(perkPcts, 'poison damage 3-3', 0) * 5 +
        // above is 16.

        // These two are mutually exclusive
        idx(perkPcts, 'shard damage 2', 0) * 2 +
        idx(perkPcts, 'more shards', 0) * 2
      ) / 21
    );

    if (this.hasPerk(perkPcts, 'two shots')) {
      totalDamage *= 0.6;
    }

    if (this.hasPerk(perkPcts, 'pierce')) {
      totalDamage *= AbilityConstants.BOUNCE_DAMAGE_PENALTY;
    }

    let damagePcts = getWeightedPercent({
      shard: 100 +
        idx(perkPcts, 'shard damage 1', 0) * 10 +
        idx(perkPcts, 'damage 3-1', 0) * 10 +
        idx(perkPcts, 'damage 3-2', 0) * 10,
      ghost: idx(perkPcts, 'ghost damage', 0) * 10,
      poisonGhost: this.hasPerk(perkPcts, 'poison ghost') * 10,
      poison: this.hasPerk(perkPcts, 'poison shards') * 50 + idx(perkPcts, 'poison damage 3-3', 0) * 100,
    });

    let description = "";
    description += 'Launches ';
    if (this.hasPerk(perkPcts, 'two shots')) {
      description += 'two projectiles that pass ';
    } else {
      description += 'a projectile that passes ';
    }

    description += 'through all enemy units in its path';

    // Ghost Damage
    let ghostHitEffects = [];
    if (damagePcts.ghost > 0) {
      let damage = Math.floor(damagePcts.ghost * totalDamage);
      ghostHitEffects.push({
        damage,
        duration: 2,
        effect: ProjectileShape.HitEffects.DAMAGE,
      });
      description += ' dealing <<' + damage + '>> damage';
    }
    // Ghost apply poison damage tick
    if (this.hasPerk(perkPcts, 'apply poison')) {
      ghostHitEffects.push({
        effect: ProjectileShape.HitEffects.APPLY_DOT_TICK,
        amount: 1
      });
    }

    // Ghost Poison
    if (damagePcts.poisonGhost > 0) {
      let poisonGhostDamage = Math.floor(damagePcts.poisonGhost * totalDamage);
      ghostHitEffects.push({
        damage: poisonGhostDamage,
        duration: 2,
        effect: ProjectileShape.HitEffects.POISON,
      });
      if (damagePcts.ghost) {
        description += ' and';
      }
      description += ' poisoning them for <<' + poisonGhostDamage + '>> damage';
    }
    // Ghost Weaken
    if (this.hasPerk(perkPcts, 'weaken ghost')) {
      let duration = 2;
      let weaknessAmount = 1.2;
      ghostHitEffects.push({
        effect: ProjectileShape.HitEffects.WEAKNESS,
        duration,
        amount: weaknessAmount,
      });
      if (damagePcts.ghost) {
        description += ' and';
      }
      description += ' weakening them, causing them to take <<' + (weaknessAmount * 100 - 100) + '>>% more damage for <<' + duration + '>> turns';
    }
    description += '.<br>';

    if (this.hasPerk(perkPcts, 'apply poison')) {
      description += 'Units passed through take one turns worth of poison damage.<br>';
    }

    // Shard Hit Effects
    let numShards = Math.floor(lerp(9, 21,
      (
        idx(perkPcts, 'more shards 0', 0) +
        idx(perkPcts, 'more shards 1', 0) +
        idx(perkPcts, 'more shards 2', 0)
      ) / 3 * (1 + this.hasPerk(perkPcts, 'two shots'))
    ));

    let shardDamage = Math.floor(damagePcts.shard * totalDamage / numShards);
    let shardHitEffects = [];
    shardHitEffects.push(
      {
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: shardDamage
      }
    );
    description += 'After, it explodes into [[timeout_effects[0].abil_def.num_bullets]] shards that ' +
      'deal [[timeout_effects[0].abil_def.hit_effects[0].base_damage]] damage';

    // Shard Poison
    if (this.hasPerk(perkPcts, 'poison shards')) {
      let shardPoisonDamage = Math.floor(damagePcts.poison * totalDamage / numShards);
      shardHitEffects.push({
        damage: shardPoisonDamage,
        duration: 2,
        effect: ProjectileShape.HitEffects.POISON,
      });
      description += ', and poisons all units hit for <<' + shardPoisonDamage + '>> damage';
    }


    let collisionBehaviours = [];
    if (this.hasPerk(perkPcts, 'pierce')) {
      collisionBehaviours.push(
        {behaviour: CollisionBehaviour.PASSTHROUGH, count: 1}
      );
      description += '.  The shards pierce once';
    }
    if (this.hasPerk(perkPcts, 'increase status duration')) {
      collisionBehaviours.push({
        effect: ProjectileShape.HitEffects.NEGATIVE_CONDITION_TIME_MODIFICATION,
        amount: 1
      });
      if (this.hasPerk(perkPcts, 'pierce')) {
        description += ' and';
      } else {
        description += '. The shards also'
      }
      description += ' increase the duration of status ailments by <<' + 1 + '>><br>';
    }
    description += '.<br>';

    const rawAbil = {
      name: 'Ghost Shot',
      description,
      card_text_description: '[[timeout_effects[0].abil_def.num_bullets]] X [[timeout_effects[0].abil_def.hit_effects[0].base_damage]]',
      style: (new BulletSheetSpriteAbilityStyleBuilder).setImageIndex(0).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.TRI_SHOT,
      num_bullets: 1 + this.hasPerk(perkPcts, 'two shots'),
      max_angle: Math.PI / 8.0,
      min_angle: Math.PI / 16.0,
      projectile_type: ProjectileShape.ProjectileTypes.GHOST,
      icon: "/Bouncy/assets/icons/incoming-rocket.png",
      ghost_time: 1,
      hit_effects: ghostHitEffects,
      timeout_effects: [
        {
          effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
          abil_def: {
            style: (new BulletSheetSpriteAbilityStyleBuilder).setImageIndex(1).build(),
            ability_type: AbilityDef.AbilityTypes.PROJECTILE,
            shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
            inherit_angle: true,
            projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
            speed: 6,
            gravity: {x: 0, y: 0},
            angle_start: -Math.PI / 4.0,
            angle_end: Math.PI / 4.0,
            num_bullets: numShards,
            collision_behaviours: collisionBehaviours,
            hit_effects: shardHitEffects,
          }
        }
      ],
      charge: this.getCooldown(perkList, perkPcts)
    };
    return AbilityDef.createFromJSON(rawAbil);
  }

  static getCooldown(perkList, perkPcts) {
    let perkCount = perkList.length;
    let cooldown = perkCount * 0.07 + 3;
    cooldown -= idx(perkPcts, 'cooldown 1', 0) * 2.5;
    cooldown -= idx(perkPcts, 'cooldown 2', 0) * 2.5;

    cooldown = Math.round(cooldown);
    if (cooldown <= 1) {
      return null;
    }

    return {initial_charge: -1, max_charge: cooldown, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetPerkList() {
    let perkList = [
      (new AbilityPerkNode('shard damage 1',    5, [0, 0]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('ghost damage', 1))),
      (new AbilityPerkNode('ghost damage',    5, [0, 1]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('shard damage 1', 1))),
      (new MaxxedAbilityPerkNode('poison ghost',    6, [2, 0]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('shard damage 1'),
          new PerkLevelRequirement('ghost damage')]
        ))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('weaken ghost', 1))),
      (new MaxxedAbilityPerkNode('weaken ghost',    6, [2, 1]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('shard damage 1'),
          new PerkLevelRequirement('ghost damage')]
        ))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('poison ghost', 1))),
      (new AbilityPerkNode('shard damage 2',    6, [4, 0]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('poison ghost'),
          new PerkLevelRequirement('weaken ghost')]
        ))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('more shards 0', 1))),
      (new AbilityPerkNode('more shards 0',    6, [4, 1]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('poison ghost'),
          new PerkLevelRequirement('weaken ghost')]
        ))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('shard damage 2', 1))),
      (new MaxxedAbilityPerkNode('apply poison',    6, [6, 0]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('shard damage 2'),
          new PerkLevelRequirement('more shards 0')]
        ))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('two shots', 1))),
      (new MaxxedAbilityPerkNode('two shots',    6, [6, 1]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('shard damage 2'),
          new PerkLevelRequirement('more shards 0')]
        ))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('apply poison', 1))),

      // Center line
      (new AbilityPerkNode('damage 3-1',    5, [0, 4])),
      // Tier 2
      (new MaxxedAbilityPerkNode('pierce',    3, [2, 3]))
        .addRequirement(new PerkLevelRequirement('damage 3-1', 1)),
      (new AbilityPerkNode('cooldown 1',     10, [3, 3]))
        .addRequirement(new PerkLevelRequirement('pierce', 1)),
      (new MaxxedAbilityPerkNode('poison shards',    3, [2, 5]))
        .addRequirement(new PerkLevelRequirement('damage 3-1', 1)),
      (new AbilityPerkNode('cooldown 2',     10, [3, 5]))
        .addRequirement(new PerkLevelRequirement('poison shards', 1)),
      // Tier 3
      (new AbilityPerkNode('more shards 1',    6, [4, 2]))
        .addRequirement(new PerkLevelRequirement('pierce', 1)),
      (new MaxxedAbilityPerkNode('increase status duration',   3, [4, 4]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('pierce'),
          new PerkLevelRequirement('poison shards')]
        )),
      (new AbilityPerkNode('more shards 2',    6, [4, 6]))
        .addRequirement(new PerkLevelRequirement('poison shards', 1)),
      // Tier 4
      (new AbilityPerkNode('damage 3-2',    20, [6, 3]))
        .addRequirement(new PerkLevelRequirement('more shards 1'))
        .addRequirement(new PerkLevelRequirement('increase status duration')),
      (new AbilityPerkNode('poison damage 3-3',    20, [6, 5]))
      .addRequirement(new PerkLevelRequirement('more shards 2'))
      .addRequirement(new PerkLevelRequirement('increase status duration')),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }
}

AbilityCore.coreList[18] = AbilityCore18;
