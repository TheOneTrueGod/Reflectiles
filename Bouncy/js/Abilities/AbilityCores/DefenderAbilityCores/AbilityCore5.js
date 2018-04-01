class AbilityCore5 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let bullet_bonus = Math.round(lerp(0, 6, idx(perkPcts, 'num_bullets', 0)));
    const rawAbil1 = {
      name: 'Spread Shot',
      description: 'Shoot [[num_bullets]] projectiles.<br>' +
        'Each one deals [[hit_effects[0].base_damage]] damage.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.TRI_SHOT,
      style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setSheet('bullet_sheet').setCoordNums(275, 69, 294, 78).setRotation(0).build(),
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      num_bullets: 6 + bullet_bonus,
      hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 180}],
      icon: "/Bouncy/assets/icons/spread_shot.png",
    };

    let rawAbil2 = { // 2440 damage max.  Actually dealing less than that
      name: 'Shoot \'em up',
      description: 'Shoots a wild spray of bullets.<br>' +
        '[[num_bullets]] bullets deal [[hit_effects[0].base_damage]] damage',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setSheet('bullet_sheet').setCoordNums(29, 301, 37, 320).setRotation(Math.PI / 2).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: true,
      num_bullets: 25,
      bullet_wave_delay: 3,
      accuracy_decay: Math.PI / 128.0,
      icon: "/Bouncy/assets/icons/bullets.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 35
      },
      {
        effect: ProjectileShape.HitEffects.POISON,
        damage: 10,
        duration: 2
      }],
    };

    rawAbil1.timing_offset = MultipartAbilityDef.TIMING_OFFSET.AFTER;

    const rawAbil = {
      name: 'Multipart Test',
      description: 'do the thing',
      ability_type: AbilityDef.AbilityTypes.MULTIPART,
      card_text_description: 'test',
      child_abilities: [
        rawAbil2,
        rawAbil1
      ],
      icon: "/Bouncy/assets/icons/spread_shot.png",
    }
    return AbilityDef.createFromJSON(rawAbil1);
  }

  static GetPerkList() {
    let perkList = [
      // Tier 1
      // Increase damage to single target
      (new AbilityPerkNode('focus fire 1',      3, [2, 2]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('damage 1', 1))),
      (new AbilityPerkNode('bouncing 1',        3, [2, 3]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('point blank 1', 1))),
      (new AbilityPerkNode('curving 1',         3, [2, 4]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('more bullets 1', 1))),
      (new AbilityPerkNode('damage 1',          3, [4, 4]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('focus fire 1', 1))),
      (new AbilityPerkNode('point blank 1',     3, [4, 3]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('bouncing 1', 1))),
      (new AbilityPerkNode('more bullets 1',    3, [4, 2]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('curving 1', 1))),

      // Tier 2
      (new AbilityPerkNode('damage on status 2',        10, [1, 1]))
        .addRequirement(new PerkLevelRequirement('focus fire 1'))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('bouncing 1'),
          new PerkLevelRequirement('more bullets 1')
        ])),
      (new AbilityPerkNode('bounce damage 2',           10, [1, 3]))
        .addRequirement(new PerkLevelRequirement('bouncing 1'))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('focus fire 1'),
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
          new PerkLevelRequirement('point blank 1')
        ])),
      (new AbilityPerkNode('penetration 2',             10, [5, 3]))
        .addRequirement(new PerkLevelRequirement('point blank 1'))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('damage 1'),
          new PerkLevelRequirement('more bullets 1')
        ])),
      (new AbilityPerkNode('kills explode 2',           10, [5, 1]))
        .addRequirement(new PerkLevelRequirement('more bullets 1'))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('point blank 1'),
          new PerkLevelRequirement('focus fire 1')
        ])),

      // Tier 3
      (new AbilityPerkNode('damageup shotsdown 3',           20, [3, 0]))
        .addRequirement(new PerkLevelRequirement('damage on status 2'))
        .addRequirement(new PerkLevelRequirement('kills explode 2')),
      (new AbilityPerkNode('damagedown shotsup 3',           20, [6, 2]))
        .addRequirement(new PerkLevelRequirement('kills explode 2'))
        .addRequirement(new PerkLevelRequirement('penetration 2')),
      (new AbilityPerkNode('wider spread 3',                 20, [6, 4]))
        .addRequirement(new PerkLevelRequirement('penetration 2'))
        .addRequirement(new PerkLevelRequirement('fire damage 2')),
      (new AbilityPerkNode('more shots 3',                   20, [3, 6]))
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
    return CardDeckTypes.NEUTRAL;
  }
}

AbilityCore.coreList[5] = AbilityCore5;
