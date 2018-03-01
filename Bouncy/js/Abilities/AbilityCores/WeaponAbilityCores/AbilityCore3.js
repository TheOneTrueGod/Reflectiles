class AbilityCore3 extends AbilityCore {
  static BuildAbility(perkList) {
    const rawAbil = { // 2250 max damage.
      name: 'Rain',
      description: 'Make it rain.<br>Fires [[num_bullets]] projectiles.<br>' +
        'Each one deals [[hit_effects[0].base_damage]] damage, and then splits into [[hit_effects[1].num_bullets]] projectiles that deal [[hit_effects[1].hit_effects[0].base_damage]] damage.<br>' +
        'Can\'t be aimed.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(37, 159, 44, 166).setRotation(0).fixRotation(true).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.RAIN,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: true,
      hit_effects: [
        {effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 20},
        {
          effect: ProjectileShape.HitEffects.BULLET_SPLIT,
          style: (new AbilitySheetSpriteAbilityStyleBuilder)
            .setSheet('bullet_sheet').setCoordNums(19, 159, 24, 166).setRotation(0).fixRotation(true).build(),
          projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
          hit_effects: [{
            effect:ProjectileShape.HitEffects.DAMAGE,
            base_damage: 5,
          }],
          num_bullets: 2
        }
      ],
      num_bullets: 50,
      icon: "/Bouncy/assets/icons/icon_plain_rain.png",
      charge: {"initial_charge":-1, "max_charge": 5, "charge_type":"TURNS"},
    };
    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetPerkList() {
    let perkList = [
      // Level 1
      (new AbilityPerkNode('damage 10',    3, [1, 3])),
      // Level 2
      (new AbilityPerkNode('more bullets 20',    3, [2, 2]))
        .addRequirement(new PerkLevelRequirement('damage 10')),
      (new MaxxedAbilityPerkNode('penetrate 20',    3, [2, 3]))
        .addRequirement(new PerkLevelRequirement('damage 10')),
      (new AbilityPerkNode('more bullets 21',    3, [2, 4]))
        .addRequirement(new PerkLevelRequirement('damage 10')),
      // Level 3
      (new AbilityPerkNode('damage 30',    3, [3, 1]))
        .addRequirement(new PerkLevelRequirement('more bullets 20')),
      (new AbilityPerkNode('more bullets 30',    3, [3, 2]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('more bullets 20'),
          new PerkLevelRequirement('penetrate 20')]
        )),
      (new AbilityPerkNode('damage 31',    3, [3, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('more bullets 20'),
          new PerkLevelRequirement('penetrate 20'),
          new PerkLevelRequirement('more bullets 21')]
        )),
      (new AbilityPerkNode('tighter spread 30',    3, [3, 4]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('penetrate 20'),
          new PerkLevelRequirement('more bullets 21')]
        )),
      (new AbilityPerkNode('damage 32',    3, [3, 5]))
        .addRequirement(new PerkLevelRequirement('more bullets 21')),
      // Level 4
      (new MaxxedAbilityPerkNode('enemy bounce',    3, [4, 1]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('damage 30'),
          new PerkLevelRequirement('more bullets 30')]
        )),
      (new AbilityPerkNode('damage 41',    3, [4, 2]))
        .addRequirement(new PerkLevelRequirement('more bullets 30'))
        .addRequirement(new PerkLevelRequirement('damage 31')),
      (new MaxxedAbilityPerkNode('wall bounce',    3, [4, 3]))
        .addRequirement(new PerkLevelRequirement('more bullets 30'))
        .addRequirement(new PerkLevelRequirement('tighter spread 30')),
      (new AbilityPerkNode('damage 43',    3, [4, 4]))
        .addRequirement(new PerkLevelRequirement('damage 31'))
        .addRequirement(new PerkLevelRequirement('tighter spread 30')),
      (new MaxxedAbilityPerkNode('bullets split',    3, [4, 5]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('tighter spread 30'),
          new PerkLevelRequirement('damage 32')]
        )),
      // Level 5
      (new AbilityPerkNode('one more bounce',    3, [5, 0]))
        .addRequirement(new PerkLevelRequirement('enemy bounce')),
      (new AbilityPerkNode('cooldown 51',    3, [5, 1]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('enemy bounce'),
          new PerkLevelRequirement('damage 41')]
        )),
      (new AbilityPerkNode('tighter spread 52',    3, [5, 2]))
        .addRequirement(new PerkLevelRequirement('enemy bounce'))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('damage 41'),
          new PerkLevelRequirement('wall bounce')]
        )),
      (new AbilityPerkNode('more bullets 53',    3, [5, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('damage 41'),
          new PerkLevelRequirement('wall bounce'),
          new PerkLevelRequirement('damage 43')]
        )),
      (new AbilityPerkNode('split damage 54',    3, [5, 4]))
        .addRequirement(new PerkLevelRequirement('bullets split'))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('damage 43'),
          new PerkLevelRequirement('wall bounce')]
        )),
      (new AbilityPerkNode('cooldown 55',    3, [5, 5]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('damage 43'),
          new PerkLevelRequirement('bullets split')]
        )),
      (new AbilityPerkNode('more splits 56',    3, [5, 6]))
        .addRequirement(new PerkLevelRequirement('bullets split')),
      // Level 6
      (new AbilityPerkNode('damage 60',    3, [6, 0]))
        .addRequirement(new PerkLevelRequirement('one more bounce')),
      (new AbilityPerkNode('damage 61',    3, [6, 1]))
        .addRequirement(new PerkLevelRequirement('cooldown 51')),
      (new AbilityPerkNode('damage 62',    3, [6, 2]))
        .addRequirement(new PerkLevelRequirement('tighter spread 52')),
      (new AbilityPerkNode('damage 63',    3, [6, 3]))
        .addRequirement(new PerkLevelRequirement('more bullets 53')),
      (new AbilityPerkNode('damage 64',    3, [6, 4]))
        .addRequirement(new PerkLevelRequirement('split damage 54')),
      (new AbilityPerkNode('damage 65',    3, [6, 5]))
        .addRequirement(new PerkLevelRequirement('cooldown 55')),
      (new AbilityPerkNode('damage 66',    3, [6, 6]))
        .addRequirement(new PerkLevelRequirement('more splits 56')),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[3] = AbilityCore3;
