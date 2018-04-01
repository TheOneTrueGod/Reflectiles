class AbilityCore13 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {

    let timeout_effects = [];

    let numShards = Math.round(lerp(30, 90, (
        idx(perkPcts, 'more shards 2', 0) +
        idx(perkPcts, 'more shards 5', 0) +
        idx(perkPcts, 'more shards 7', 0) * 2 +
        idx(perkPcts, 'more shards 7-2', 0) * 2
      ) / 6
    ));
    let shot_gap = 4;
    if (numShards >= 80) {
      shot_gap = 2;
    } else if (numShards >= 50) {
      shot_gap = 3;
    }

    let shardDamage = Math.floor(lerp(1500, 4500, (
        idx(perkPcts, 'shard damage 0', 0) * 1 +
        idx(perkPcts, 'shard damage 2-1', 0) * 3 +
        idx(perkPcts, 'shard damage 2-2', 0) * 3 +
        idx(perkPcts, 'shard damage 7', 0) * 5
      ) / 12
    ) / numShards);

    let finaleDamage = Math.floor(lerp(
      400, 1500,
      (
        idx(perkPcts, 'finale damage 1', 0) * 3 +
        idx(perkPcts, 'finale damage 4', 0) * 3 +
        idx(perkPcts, 'finale damage 6', 0) * 4
      ) / 10
    ));

    let collisionBehaviours = [];
    let wallBounces = AbilityConstants.MINOR_WALL_BOUNCES;
    if (this.hasPerk(perkPcts, 'bouncing shards 3')) {
      collisionBehaviours.push(
        {behaviour: CollisionBehaviour.BOUNCE, count: 1}
      );
      shardDamage = Math.floor(shardDamage * AbilityConstants.BOUNCE_DAMAGE_PENALTY);
    }

    if (this.hasPerk(perkPcts, 'bouncing shards 6')) {
      collisionBehaviours.push(
        {behaviour: CollisionBehaviour.BOUNCE, count: 1}
      );
      shardDamage = Math.floor(shardDamage * AbilityConstants.BOUNCE_DAMAGE_PENALTY);
    }

    if (
      this.hasPerk(perkPcts, 'bouncing shards 6') ||
      this.hasPerk(perkPcts, 'bouncing shards 3')
    ) {
      wallBounces += 1;
    }

    let description = 'Shoots an orb that rapidly decays.<br>' +
      'It fires [[num_bullets]] projectiles that deal [[hit_effects[0].base_damage]] damage' +
      (this.hasPerk(perkPcts, 'bouncing shards 3') ? ', and bounces once' : '')
      + '.<br>';

    // Out here so the style is correct
    let explosionRadius = Math.floor(lerp(
      Unit.UNIT_SIZE * 1.5, Unit.UNIT_SIZE * 2.5,
      (
        idx(perkPcts, 'bigger boom 2', 0) +
        idx(perkPcts, 'bigger boom 5', 0)
      ) / 2
    ));

    if (this.hasPerk(perkPcts, 'shatter 0')) {
      description += 'Afterwards, it explodes into another [[timeout_effects[0].abil_def.num_bullets]] projectiles that deal [[timeout_effects[0].abil_def.hit_effects[0].base_damage]] damage.<br>';
      let num_bullets = Math.round(lerp(7, 15, (
        idx(perkPcts, 'more shatter 2', 0) +
        idx(perkPcts, 'more shatter 5', 0)
      ) / 2));
      timeout_effects.push({
        effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
        abil_def: {
          style: (new AbilitySheetSpriteAbilityStyleBuilder())
            .setSheet('bullet_sheet').setCoordNums(36, 139, 44, 147).setRotation(0).fixRotation(true)
            .build(),
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
          projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
          gravity: {x: 0, y: 0},
          speed: 8,
          size: 6,
          destroy_on_wall: [],
          num_bullets: num_bullets,
          hit_effects:
            [{
              effect: ProjectileShape.HitEffects.DAMAGE,
              base_damage: Math.round(finaleDamage / num_bullets)
            }],
        }
      });
    } else if (this.hasPerk(perkPcts, 'explosion 0')) {
      description += 'Afterwards, it explodes dealing [[timeout_effects[0].abil_def.hit_effects[0].base_damage]] ' +
        'damage in a [[timeout_effects[0].abil_def.hit_effects[0].aoe_size]] radius.<br>';
      timeout_effects.push({
        effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          projectile_type: 1,
          shape: ProjectileAbilityDef.Shapes.INSTANT_AOE,
          hit_effects: [{
            base_damage: Math.floor(finaleDamage / 4),
            effect: ProjectileShape.HitEffects.DAMAGE,
            aoe_type: ProjectileShape.AOE_TYPES.CIRCLE,
            aoe_size: explosionRadius,
          }],
        }
      })
    }

    let cooldownReduction = 0;
    if (this.hasPerk(perkPcts, 'steal essence 7')) {
      cooldownReduction = 0.25;
      description += "Each enemy this skill kills reduces all of your other skills cooldowns by " + cooldownReduction + ".";
    }

    const rawAbil = {
      name: 'Chaos Orb',
      description: description,
      card_text_description: '61 X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setSheet('bullet_sheet').setCoordNums(166, 296, 184, 314).setRotation(0).fixRotation(true)
        .setExplosion(AbilityStyle.getExplosionPrefab(
          AbilityStyle.EXPLOSION_PREFABS.WHITE, explosionRadius
        ))
        .build(),
      shard_style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setSheet('bullet_sheet').setCoordNums(36, 139, 44, 147).setRotation(0).fixRotation(true).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.FROZEN_ORB,
      icon: "/Bouncy/assets/icons/icon_plain_forb.png",
      num_bullets: numShards,
      destroy_on_wall: [],
      collision_behaviours: collisionBehaviours,
      shot_gap: shot_gap,
      speed_decay: {
        x: this.hasPerk(perkPcts, 'fading shots 4') ? 0.98 : 1,
        y: this.hasPerk(perkPcts, 'fading shots 4') ? 0.98 : 1
      },
      gravity: {
        x: 0,
        y: this.hasPerk(perkPcts, 'fading shots 4') ? -0.1 : 0,
      },
      hit_effects: [
        {
          effect: ProjectileShape.HitEffects.DAMAGE,
          base_damage: shardDamage
        }
      ],
      timeout_effects: timeout_effects,
      on_kill_effects: this.hasPerk(perkPcts, 'steal essence 7') ?
        [{
          effect: ProjectileShape.HitEffects.COOLDOWN_REDUCTION,
          amount: cooldownReduction,
          restore_all: true,
        }] :
        [],
      charge: this.getCooldown(perkList, perkPcts)
    };
    if (this.hasPerk(perkPcts, 'shoot up 5')) {
      rawAbil.start_angle = Math.PI;
      rawAbil.end_angle = Math.PI * 2;
    }
    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetPerkList() {
    let perkList = [
      (new MaxxedAbilityPerkNode('shatter 0',                 2, [0, 0]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('explosion 0', 1))),
      (new MaxxedAbilityPerkNode('explosion 0',               2, [0, 2]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('shatter 0', 1))),
      (new AbilityPerkNode('cooldown 0',                3, [0, 3])),
      (new AbilityPerkNode('shard damage 0',            3, [0, 5])),
      // Level 1
      (new AbilityPerkNode('finale damage 1',           3, [1, 1]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('shatter 0'),
          new PerkLevelRequirement('explosion 0')
        ])),
      // Level 2
      (new AbilityPerkNode('more shatter 2',            3, [2, 0]))
        .addRequirement(new PerkLevelRequirement('shatter 0')),
      (new MaxxedAbilityPerkNode('bigger boom 2',             3, [2, 2]))
        .addRequirement(new PerkLevelRequirement('explosion 0')),
      (new AbilityPerkNode('cooldown 2',                4, [2, 3]))
        .addRequirement(new PerkLevelRequirement('cooldown 0')),
      (new AbilityPerkNode('shard damage 2-1',          3, [2, 4]))
        .addRequirement(new PerkLevelRequirement('shard damage 0')),
      (new AbilityPerkNode('more shards 2',             5, [2, 5]))
        .addRequirement(new PerkLevelRequirement('shard damage 0')),
      (new AbilityPerkNode('shard damage 2-2',          3, [2, 6]))
        .addRequirement(new PerkLevelRequirement('shard damage 0')),
      // Level 3
      (new MaxxedAbilityPerkNode('bouncing shards 3',         3, [3, 6]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('more shards 2'),
          new PerkLevelRequirement('shard damage 2-2')
        ])),
      // Level 4
      (new AbilityPerkNode('finale damage 4',           3, [4, 1]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('more shatter 2'),
          new PerkLevelRequirement('bigger boom 2')
        ])),
      (new AbilityPerkNode('cooldown 4',                4, [4, 3]))
        .addRequirement(new PerkLevelRequirement('cooldown 2')),
      (new MaxxedAbilityPerkNode('fading shots 4',            3, [4, 5]))
        .addRequirement(new PerkLevelRequirement('more shards 2')),
      // Level 5
      (new AbilityPerkNode('more shatter 5',          3, [5, 0]))
        .addRequirement(new PerkLevelRequirement('finale damage 4'))
        .addRequirement(new PerkLevelRequirement('more shatter 2')),
      (new MaxxedAbilityPerkNode('bigger boom 5',        3, [5, 2]))
        .addRequirement(new PerkLevelRequirement('finale damage 4'))
        .addRequirement(new PerkLevelRequirement('bigger boom 2')),
      (new MaxxedAbilityPerkNode('shoot up 5',                3, [5, 4]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('more shards 2'),
          new PerkLevelRequirement('shard damage 2-1')
        ])),
      (new AbilityPerkNode('more shards 5',             5, [5, 6]))
        .addRequirement(new PerkLevelRequirement('bouncing shards 3')),
      // Level 6
      (new AbilityPerkNode('finale damage 6',           3, [6, 1]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('more shatter 5'),
          new PerkLevelRequirement('bigger boom 5')
        ])),
      (new AbilityPerkNode('cooldown 6',                5, [6, 3]))
        .addRequirement(new PerkLevelRequirement('cooldown 4')),
      (new MaxxedAbilityPerkNode('bouncing shards 6',            3, [6, 5]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('shoot up 5'),
          new PerkLevelRequirement('fading shots 4'),
          new PerkLevelRequirement('more shards 5'),
        ])),
      // Level 7
      (new MaxxedAbilityPerkNode('steal essence 7',           6, [7, 3]))
        // Whenever this skill kills something, reduce the cooldown of it by 1.
        .addRequirement(new PerkLevelRequirement('finale damage 6'))
        .addRequirement(new PerkLevelRequirement('bouncing shards 6')),
      (new AbilityPerkNode('shard damage 7',            15, [7, 5]))
        .addRequirement(new PerkLevelRequirement('bouncing shards 6')),
      (new AbilityPerkNode('more shards 7-2',           15, [7, 6]))
        .addRequirement(new PerkLevelRequirement('bouncing shards 6')),
    ];
    return perkList;
  }

  static getCooldown(perkList, perkPcts) {
    let perkCount = perkList.length;
    let cooldown = perkCount * 0.2 + 3;
    cooldown -= idx(perkPcts, 'cooldown 0', 0) * 3;
    cooldown -= idx(perkPcts, 'cooldown 2', 0) * 4;
    cooldown -= idx(perkPcts, 'cooldown 4', 0) * 4;
    cooldown -= idx(perkPcts, 'cooldown 6', 0) * 6;

    cooldown = Math.round(cooldown);
    if (cooldown <= 1) {
      return null;
    }

    return {initial_charge: -1, max_charge: cooldown, charge_type: "TURNS"};
  }

  static GetAimOffsets() {
    return {x: 0, y: -50};
  }

  static GetCardDeckType() {
    return CardDeckTypes.CHAOS;
  }
}

AbilityCore.coreList[13] = AbilityCore13;
