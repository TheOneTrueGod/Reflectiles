class AbilityCore13 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {



    const rawAbil = {
      name: 'Chaos Orb',
      description: 'Shoots an orb that rapidly decays.<br>' +
        'It fires [[num_bullets]] projectiles that deal [[hit_effects[0].base_damage]] damage<br>' +
        'Afterwards, it explodes into another [[timeout_effects[0].abil_def.num_bullets]] projectiles',
      card_text_description: '61 X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setSheet('bullet_sheet').setCoordNums(166, 296, 184, 314).setRotation(0).fixRotation(true).build(),
      shard_style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setSheet('bullet_sheet').setCoordNums(36, 139, 44, 147).setRotation(0).fixRotation(true).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.FROZEN_ORB,
      icon: "/Bouncy/assets/icons/icon_plain_forb.png",
      num_bullets: 50,
      destroy_on_wall: [],
      hit_effects: [
        {
          effect: ProjectileShape.HitEffects.DAMAGE,
          base_damage: 30
        }
      ],
      timeout_effects: [
        {
          effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
          abil_def: {
            style: (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('bullet_sheet').setCoordNums(36, 139, 44, 147).setRotation(0).fixRotation(true).build(),
            ability_type: AbilityDef.AbilityTypes.PROJECTILE,
            shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
            projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
            gravity: {x: 0, y: 0},
            speed: 8,
            size: 6,
            destroy_on_wall: [],
            num_bullets: 11,
            hit_effects:
              [{
                effect: ProjectileShape.HitEffects.DAMAGE,
                base_damage: 30
              }],
          }
        }
      ],
      charge:{"initial_charge": -1, "max_charge": 3, "charge_type":"TURNS"}
    };
    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetPerkList() {
    let perkList = [
      (new AbilityPerkNode('shatter 0',                 5, [0, 0]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('shatter 0', 1))),
      (new AbilityPerkNode('explosion 0',               3, [0, 2]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('explosion 0', 1))),
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
      (new AbilityPerkNode('bigger boom 2',             3, [2, 2]))
        .addRequirement(new PerkLevelRequirement('explosion 0')),
      (new AbilityPerkNode('shard damage 2-1',          3, [2, 4]))
        .addRequirement(new PerkLevelRequirement('shard damage 0')),
      (new AbilityPerkNode('more shards 2',             3, [2, 5]))
        .addRequirement(new PerkLevelRequirement('shard damage 0')),
      (new AbilityPerkNode('shard damage 2-2',          3, [2, 6]))
        .addRequirement(new PerkLevelRequirement('shard damage 0')),
      // Level 3
      (new AbilityPerkNode('damaging orb 3',            3, [3, 1]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('more shatter 2'),
          new PerkLevelRequirement('bigger boom 2')
        ])),
      (new AbilityPerkNode('cooldown 3',                3, [3, 3]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('bigger boom 2'),
          new PerkLevelRequirement('shard damage 2-1')
        ])),
      (new AbilityPerkNode('bouncing shards 3',         3, [3, 6]))
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
      (new AbilityPerkNode('homing shots 4',            3, [4, 5]))
        .addRequirement(new PerkLevelRequirement('more shards 2')),
      // Level 5
      (new AbilityPerkNode('more shatter 5',          3, [5, 0]))
        .addRequirement(new PerkLevelRequirement('finale damage 4'))
        .addRequirement(new PerkLevelRequirement('more shatter 2')),
      (new AbilityPerkNode('bigger boom 5',        3, [5, 2]))
        .addRequirement(new PerkLevelRequirement('finale damage 4'))
        .addRequirement(new PerkLevelRequirement('bigger boom 2')),
      (new AbilityPerkNode('shoot up 5',                3, [5, 4]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('more shards 2'),
          new PerkLevelRequirement('shard damage 2-1')
        ])),
      (new AbilityPerkNode('more shards 5',             3, [5, 6]))
        .addRequirement(new PerkLevelRequirement('bouncing shards 3')),
      // Level 6
      (new AbilityPerkNode('finale damage 6',           3, [6, 1]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('more shatter 5'),
          new PerkLevelRequirement('bigger boom 5')
        ])),
      (new AbilityPerkNode('cooldown 6',                3, [6, 3]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('bigger boom 5'),
          new PerkLevelRequirement('shoot up 5')
        ])),
      (new AbilityPerkNode('orb duration 6',            3, [6, 5]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('shoot up 5'),
          new PerkLevelRequirement('homing shots 4'),
          new PerkLevelRequirement('more shards 5'),
        ])),
      // Level 7
      (new AbilityPerkNode('steal essence 7',           3, [7, 1]))
        // Whenever this skill kills something, reduce the cooldown of it by 1.
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('more shatter 5'),
          new PerkLevelRequirement('bigger boom 5')
        ])),
      (new AbilityPerkNode('more shards 7',             3, [7, 4]))
        .addRequirement(new PerkLevelRequirement('orb duration 6')),
      (new AbilityPerkNode('shard damage 7',            3, [7, 5]))
        .addRequirement(new PerkLevelRequirement('orb duration 6')),
      (new AbilityPerkNode('more shards 7-2',           3, [7, 6]))
        .addRequirement(new PerkLevelRequirement('orb duration 6')),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.CHAOS;
  }
}

AbilityCore.coreList[13] = AbilityCore13;
