class AbilityCore5 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let num_bullets = Math.floor(lerp(6, 16,
      (
        idx(perkPcts, 'more bullets 1', 0) * 2 +
        idx(perkPcts, 'more shots 3-2', 0) * 8 +
        // Mutually exclusive
        idx(perkPcts, 'more shots 3', 0) * 8
      ) / 10
    ));
    const rawAbil = {
      name: 'Spread Shot',
      description: 'Shoot [[num_bullets]] projectiles.<br>' +
        'Each one deals [[hit_effects[0].base_damage]] damage.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.TRI_SHOT,
      style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setSheet('bullet_sheet').setCoordNums(275, 69, 294, 78).setRotation(0).build(),
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      num_bullets: num_bullets,
      hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 180}],
      icon: "/Bouncy/assets/icons/spread_shot.png",
    };

    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetPerkList() {
    let perkList = [
      // Tier 1
      // Increase damage to single target
      (new MaxxedAbilityPerkNode('focus fire 1',      3, [2, 2]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('damage 1', 1))),
      (new MaxxedAbilityPerkNode('bouncing 1',        3, [2, 3]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('point blank 1', 1))),
      (new MaxxedAbilityPerkNode('curving 1',         3, [2, 4]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('more bullets 1', 1))),
      (new MaxxedAbilityPerkNode('damage 1',          3, [4, 4]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('focus fire 1', 1))),
      (new MaxxedAbilityPerkNode('point blank 1',     3, [4, 3]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('bouncing 1', 1))),
      (new MaxxedAbilityPerkNode('more bullets 1',    3, [4, 2]))
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
      (new AbilityPerkNode('fewer shots 3',           20, [3, 0]))
        .addRequirement(new PerkLevelRequirement('damage on status 2'))
        .addRequirement(new PerkLevelRequirement('kills explode 2')),
      (new AbilityPerkNode('more shots 3-2',           20, [6, 2]))
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
