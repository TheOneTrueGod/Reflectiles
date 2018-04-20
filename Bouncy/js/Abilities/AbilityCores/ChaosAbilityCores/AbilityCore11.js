class AbilityCore11 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let totalDamage = lerp(1000, 6700,
      (
        idx(perkPcts, 'damage 1', 0) +
        idx(perkPcts, 'damage 2', 0) +
        idx(perkPcts, 'damage 1-2', 0) +
        idx(perkPcts, 'damage 1-3', 0) +
        idx(perkPcts, 'damage 1-4', 0) +
        idx(perkPcts, 'damage 1-5', 0) +
        idx(perkPcts, 'damage 1-6', 0) * 3
      ) / 9
    );
    let num_bullets = Math.floor(lerp(10, 17, (idx(perkPcts, 'more shards', 0) + idx(perkPcts, 'more shards 2', 0)) / 2));

    const MAX_SHARD_DURATION = 150;
    let shardDuration = lerp(30, MAX_SHARD_DURATION,
      (
        idx(perkPcts, 'range 1', 0) +
        idx(perkPcts, 'range 2', 0)
      ) / 2
    );

    let collision_behaviours = [];
    let num_bounces = 0;

    if (this.hasPerk(perkPcts, 'shards bounce')) {
      totalDamage *= AbilityConstants.BOUNCE_DAMAGE_PENALTY;
      collision_behaviours.push({behaviour: CollisionBehaviour.BOUNCE, count: 1});
      num_bounces += 1;
    }
    if (this.hasPerk(perkPcts, 'another bounce')) {
      totalDamage *= AbilityConstants.BOUNCE_DAMAGE_PENALTY;
      collision_behaviours.push({behaviour: CollisionBehaviour.BOUNCE, count: 1});
      num_bounces += 1;
    }

    let gravity = {x: 0, y: this.hasPerk(perkPcts, 'gravity up') ? -0.1 : 0};
    const SCATTER_COUNT = 5;
    if (this.hasPerk(perkPcts, 'second burst')) {
      totalDamage = totalDamage / SCATTER_COUNT;
    }

    let bulletDamage = Math.floor(totalDamage / num_bullets);

    let finalBurst = [
      {
        effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
        abil_def: {
          style: (new AbilitySheetSpriteAbilityStyleBuilder)
            .setSheet('bullet_sheet').setCoordNums(334, 70, 341, 77).setRotation(0).fixRotation(true).build(),
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
          speed: 8,
          projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
          max_bounces: AbilityConstants.MINOR_WALL_BOUNCES + this.hasPerk(perkPcts, 'wall bounce'),
          collision_behaviours,
          num_bullets,
          gravity,
          destroy_on_wall: [],
          bounce_on_wall: {'BOTTOM': true, 'TOP': true, 'LEFT': true, 'RIGHT': true},
          hit_effects:
            [{
              effect: ProjectileShape.HitEffects.DAMAGE,
              base_damage: bulletDamage
            }],
        }
      }
    ];
    if (shardDuration !== MAX_SHARD_DURATION) {
      finalBurst[0].abil_def.duration = shardDuration;
    }

    let timeout_effects = finalBurst;
    if (this.hasPerk(perkPcts, 'second burst')) {
      let speedDecay = lerp(0.9, 0.95, idx(perkPcts, 'shatter range', 0));
      timeout_effects = [{
        effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
        abil_def: {
          style: (new AbilitySheetSpriteAbilityStyleBuilder)
            .setSheet('bullet_sheet').setCoordNums(334, 70, 341, 77).setRotation(0).fixRotation(true).build(),
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
          speed: 4,
          angle_offset: 'random',
          duration: Math.floor(25),
          gravity: {x: 0, y: 0},
          speed_decay: {x: speedDecay, y: speedDecay},
          projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
          max_bounces: -1,
          num_bullets: SCATTER_COUNT,
          timeout_effects: finalBurst,
          destroy_on_wall: [],
        }
      }];
    }

    let description = 'Launches a firework.<br>';
    description += 'It explodes into ';
    if (this.hasPerk(perkPcts, 'second burst')) {
      description += '<<' + SCATTER_COUNT + '>> pieces that explode into ';
    }
    description += '<<' + num_bullets + '>> shards';
    if (num_bounces > 0) {
      description += ' that bounce ' + (num_bounces == 2 ? '2 times.' : '1 time');
    }

    description += '<br>';
    description += 'Each shard deals <<' + bulletDamage + '>> damage.'

    const rawAbil = {
      name: 'Fireworks',
      description,
      card_text_description: '[[timeout_effects[0].abil_def.num_bullets]] X [[timeout_effects[0].abil_def.hit_effects[0].base_damage]] x 2',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet')
        .setCoordNums(323, 70, 331, 77)
        .setRotation(0)
        .fixRotation(true)
        .build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.TIMEOUT,
      icon: "/Bouncy/assets/icons/icon_plain_burst.png",
      max_bounces: -1,
      hit_effects: [],
      timeout_effects,
      charge: this.getCooldown(perkList, perkPcts),
    };
    return AbilityDef.createFromJSON(rawAbil);
  }

  static getCooldown(perkList, perkPcts) {
    // 0 -> 5 at max level
    let perkCount = perkList.length;
    let cooldown = perkCount * 0.12; // 13.56
    cooldown -= lerp(0, 9.76, (
      idx(perkPcts, 'cooldown 1', 0) +
      idx(perkPcts, 'cooldown 2', 0) +
      idx(perkPcts, 'cooldown 4', 0) +
      idx(perkPcts, 'cooldown 5', 0) * 2
    ) / 5);

    cooldown = Math.round(cooldown);
    if (cooldown <= 1) {
      return null;
    }

    return {initial_charge: -1, max_charge: cooldown, charge_type: "TURNS"};
  }

  static GetPerkList() {
    let perkList = [
      // Trunk
      (new AbilityPerkNode('damage 1',    5, [0, 3])),
      (new AbilityPerkNode('range 1',    5, [1, 3]))
        .addRequirement(new PerkLevelRequirement('damage 1')),
      (new AbilityPerkNode('damage 1-2',    5, [2, 3]))
        .addRequirement(new PerkLevelRequirement('range 1')),
      (new AbilityPerkNode('cooldown 1',    5, [3, 3]))
        .addRequirement(new PerkLevelRequirement('damage 1-2')),
      (new AbilityPerkNode('damage 1-3',    5, [4, 3]))
        .addRequirement(new PerkLevelRequirement('cooldown 1')),
      (new MaxxedAbilityPerkNode('gravity up',    3, [5, 3]))
        .addRequirement(new PerkLevelRequirement('damage 1-3')),
      // Branch 1
      (new AbilityPerkNode('range 2',           5, [1, 4]))
        .addRequirement(new PerkLevelRequirement('range 1')),
      (new MaxxedAbilityPerkNode('wall bounce',    3, [2, 5]))
        .addRequirement(new PerkLevelRequirement('range 2')),
      (new AbilityPerkNode('damage 1-5',           5, [3, 6]))
        .addRequirement(new PerkLevelRequirement('wall bounce')),
      // Branch 2
      (new MaxxedAbilityPerkNode('shards bounce',     3, [2, 2]))
        .addRequirement(new PerkLevelRequirement('damage 1-2')),
      (new AbilityPerkNode('damage 2',   5, [3, 1]))
        .addRequirement(new PerkLevelRequirement('shards bounce')),
      (new MaxxedAbilityPerkNode('another bounce',    3, [4, 0]))
        .addRequirement(new PerkLevelRequirement('damage 2')),
      // Branch 3
      (new AbilityPerkNode('more shards',    5, [3, 4]))
        .addRequirement(new PerkLevelRequirement('cooldown 1')),
      (new AbilityPerkNode('cooldown 2',    5, [4, 5]))
        .addRequirement(new PerkLevelRequirement('more shards')),
      (new AbilityPerkNode('damage 1-4',    5, [5, 6]))
        .addRequirement(new PerkLevelRequirement('cooldown 2')),
      // Branch 4
      (new MaxxedAbilityPerkNode('second burst',   3, [4, 2]))
        .addRequirement(new PerkLevelRequirement('damage 1-3')),
      (new AbilityPerkNode('cooldown 4',   5, [5, 1]))
        .addRequirement(new PerkLevelRequirement('second burst')),
      (new AbilityPerkNode('shatter range',   5, [6, 0]))
        .addRequirement(new PerkLevelRequirement('cooldown 4')),
      // Final Branches
      (new AbilityPerkNode('cooldown 5',     10, [7, 4]))
        .addRequirement(new PerkLevelRequirement('gravity up')),
      (new AbilityPerkNode('damage 1-6',     10, [7, 3]))
        .addRequirement(new PerkLevelRequirement('gravity up')),
      (new AbilityPerkNode('more shards 2',  5, [7, 2]))
        .addRequirement(new PerkLevelRequirement('gravity up')),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.CHAOS;
  }
}

AbilityCore.coreList[11] = AbilityCore11;
