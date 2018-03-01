// Shield.
// Perk Ideas
// Increase the duration
// Retaliate against enemies shooting it
// Retaliate against enemies walking into it
// Increase width
// Increase horizontal range you can cast it at
// Stun enemies that it retaliates against
// Knockback enemies that it retaliates against
//
class AbilityCore7 extends AbilityCore {
  static BuildAbility(perkList) {
    const rawAbil = {
      name: 'Shield',
      description: 'Puts up a shield with [[duration]] health.<br>' +
        'It loses one health per turn, or when it defends.<br>' +
        'Whenever a unit tries to enter, relatiate for [[unit_interaction.unit_enter[0].abil_def.hit_effects[0].base_damage]] damage',
      card_text_description: '[[unit_interaction.unit_enter[0].abil_def.hit_effects[0].base_damage]]',
      zone_tooltip_name: 'Shield',
      zone_tooltip_description: 'Protects from bullets.  If an enemy would enter, the shield will retaliate for ' +
        '[[unit_interaction.unit_enter[0].abil_def.hit_effects[0].base_damage]] damage.',
      ability_type: AbilityDef.AbilityTypes.ZONE,
      unit_interaction: {
        prevent_unit_entry: true,
        unit_enter:[this.GetThornsAbility()]
      },
      projectile_interaction: {enemy_projectiles: {destroy: true}},
      duration: 6,
      zone_size: {left:1, right:1, top:0, bottom:0, y_range: 0},
      max_range: {left: 5, right: 5, top: 1, bottom: 1},
      unit_enter_effect: {},
      zone_icon: 'zone_icon_shield',
      icon: "/Bouncy/assets/icons/icon_plain_shield.png",
      charge: {"initial_charge":-1,"max_charge":3,"charge_type":"TURNS"},
    };
    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetThornsAbility() {
    const rawAbil = {
      effect: ZoneAbilityDef.UnitEffectTypes.ABILITY,
      ability_source: ZoneAbilityDef.AbilitySources.CENTER_ZONE,
      abil_def: {
        ability_type: AbilityDef.AbilityTypes.PROJECTILE,
        shape: ProjectileAbilityDef.Shapes.TRI_SHOT,
        projectile_type: ProjectileShape.ProjectileTypes.PENETRATE,
        min_angle: Math.PI / 2.0,
        max_angle: Math.PI / 2.0,
        duration: 20,
        num_bullets: 5,
        speed: 4,
        hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 400}]
      }
    };
    return rawAbil;
  }

  static GetPerkList() {
    let perkList = [
      // Level 0
      (new MaxxedAbilityPerkNode('melee thorns',    2, [0, 1])),
      (new AbilityPerkNode('health 1',    3, [0, 3])),
      (new MaxxedAbilityPerkNode('shield width 1',    3, [0, 5])),
      // Level 1
      (new AbilityPerkNode('thorns damage 1',    5, [1, 1]))
        .addRequirement(new PerkLevelRequirement('melee thorns')),
      (new AbilityPerkNode('health 2',    3, [1, 2]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('health 1'),
          new PerkLevelRequirement('melee thorns')
        ])),
      (new MaxxedAbilityPerkNode('cast range sideways',    3, [1, 4]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('health 1'),
          new PerkLevelRequirement('shield width 1')]
        )),
      // Level 2
      (new AbilityPerkNode('thorns damage 2',    5, [2, 0]))
        .addRequirement(new PerkLevelRequirement('thorns damage 1')),
      (new AbilityPerkNode('thorns damage 3',    5, [2, 1]))
        .addRequirement(new PerkLevelRequirement('thorns damage 1')),
      (new AbilityPerkNode('thorns range 1',    5, [2, 2]))
        .addRequirement(new PerkLevelRequirement('thorns damage 1')),
      // Level 3
      (new AbilityPerkNode('shield duration',    5, [3, 4]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('health 2'),
          new PerkLevelRequirement('cast range sideways'),
        ])),
      // Level 4
      (new MaxxedAbilityPerkNode('ranged thorns',    3, [4, 1]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('thorns damage 2'),
          new PerkLevelRequirement('thorns damage 3'),
          new PerkLevelRequirement('thorns range 1')]
        )),
      (new MaxxedAbilityPerkNode('stunning shield',    3, [4, 3]))
        .addRequirement(new PerkLevelRequirement('thorns range 1'))
        .addRequirement(new PerkLevelRequirement('shield duration')),
      (new AbilityPerkNode('shield health 2',    5, [4, 5]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('cast range sideways'),
          new PerkLevelRequirement('shield duration')
        ])),
      // Level 5
      (new AbilityPerkNode('thorns range 2',    5, [5, 0]))
        .addRequirement(new PerkLevelRequirement('ranged thorns')),
      (new AbilityPerkNode('cast range 2',    5, [5, 4]))
        .addRequirement(new PerkLevelRequirement('shield duration')),
      // Level 6
      (new AbilityPerkNode('thorn count',    5,   [6, 1]))
        .addRequirement(new PerkLevelRequirement('ranged thorns')),
      (new AbilityPerkNode('shield duration 2',    3, [6, 3]))
        .addRequirement(new PerkLevelRequirement('stunning shield')),

      // Level 7
      (new MaxxedAbilityPerkNode('thorns pierce',    3, [7, 0]))
        .addRequirement(new PerkLevelRequirement('thorns range 2'))
        .addRequirement(new PerkLevelRequirement('thorn count')),

      (new MaxxedAbilityPerkNode('stunning thorns',    3, [7, 2]))
        .addRequirement(new PerkLevelRequirement('thorns range 1'))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('shield width 2'),
          new PerkLevelRequirement('shield duration 2'),
        ])),
      (new AbilityPerkNode('shield width 2',    3, [7, 5]))
        .addRequirement(new PerkLevelRequirement('shield health 2'))
        .addRequirement(new PerkLevelRequirement('cast range 2')),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }

  static GetDemoUnits() {
    return  [
      [null, UnitBasicSquare, UnitShooter, UnitBasicSquare, UnitShooter, UnitBasicSquare],
      [null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [null, UnitBasicSquare, UnitShooter, UnitBasicSquare, UnitShooter, UnitBasicSquare],
      [null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [null, null, null, UnitBasicSquare],
    ];
  }
}

AbilityCore.coreList[7] = AbilityCore7;
