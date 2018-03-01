// Shield.
// Perk Ideas
// Moving shield?
//
class AbilityCore7 extends AbilityCore {
  static BuildAbility(perkList) {
    let perkResults = this.BuildPerkDetails(perkList); let perkPcts = perkResults.perkPcts; let perkCounts = perkResults.perkCounts;

    let health = 6;
    health += Math.floor(idx(perkPcts, 'health 1', 0) * 4);
    health += Math.floor(idx(perkPcts, 'health 2', 0) * 4);
    health += Math.floor(idx(perkPcts, 'health 3', 0) * 4);
    health += Math.floor(idx(perkPcts, 'health 4', 0) * 4);
    health += Math.floor(idx(perkPcts, 'health 5', 0) * 4);

    let has_pierce = idx(perkPcts, 'thorns pierce', 0) === 1;

    let width_bonus = idx(perkPcts, 'shield width 1', 0) + idx(perkPcts, 'shield width 2', 0);

    let width_bonus_left = idx(perkPcts, 'shield width 1', 0) === 1 ? 1 : 0;
    let width_bonus_right = idx(perkPcts, 'shield width 2', 0) === 1 ? 1 : 0;

    let thornsAbility = this.GetThornsAbility(perkPcts, perkCounts);

    let horizontal_range = Math.floor(idx(perkPcts, 'cast range sideways', 0) * 2);
    let vertical_range = Math.floor(idx(perkPcts, 'cast range 2', 0) * 2);
    let has_ranged_thorns = idx(perkPcts, 'ranged thorns', 0) === 1;

    const rawAbil = {
      name: 'Shield',
      description: 'Puts up a shield with [[duration]] health.<br>' +
        'It loses one health per turn, or when it defends.<br>' +
        (thornsAbility ? 'Whenever a unit tries to enter, ' + (has_ranged_thorns ? 'or you defend against a bullet, ' : '') + 'retaliate for [[unit_interaction.unit_enter[0].abil_def.hit_effects[0].base_damage]] damage.<br>' : '') +
        (has_pierce ? 'These thorns pierce up to <<3>> enemies.' : ''),
      card_text_description: '[[unit_interaction.unit_enter[0].abil_def.hit_effects[0].base_damage]]',
      zone_tooltip_name: 'Shield',
      zone_tooltip_description: 'Protects from bullets.  If an enemy would enter, the shield will retaliate with ' +
        '[[unit_interaction.unit_enter[0].abil_def.num_bullets]] thorns for ' +
        '[[unit_interaction.unit_enter[0].abil_def.hit_effects[0].base_damage]] damage each.',
      ability_type: AbilityDef.AbilityTypes.ZONE,
      unit_interaction: {
        prevent_unit_entry: true,
      },
      projectile_interaction: {enemy_projectiles: {destroy: true}},
      duration: health,
      zone_size: {
        left: 1 + width_bonus_left, right: 1 + width_bonus_right,
        top:0, bottom:0, y_range: 0
      },
      max_range: {
        left: 4 - width_bonus_left + horizontal_range,
        right: 4 - width_bonus_right + horizontal_range,
        top: 1 + vertical_range, bottom: 1
      },
      unit_enter_effect: {},
      zone_icon: 'zone_icon_shield',
      icon: "/Bouncy/assets/icons/icon_plain_shield.png",
      charge: {initial_charge: -1, max_charge: 3, charge_type: "TURNS"},
    };

    if (thornsAbility) {
      rawAbil.unit_interaction.unit_enter =
        [thornsAbility];
      if (has_ranged_thorns) {
        rawAbil.projectile_interaction.enemy_projectiles.ability =
          thornsAbility;
      }
    }

    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetThornsAbility(perkPcts, perkCounts) {
    if (idx(perkPcts, 'melee thorns', 0) !== 1) {
      return null;
    }

    let has_pierce = idx(perkPcts, 'thorns pierce', 0) === 1;
    let has_stun = idx(perkPcts, 'stunning thorns', 0) === 1;

    let has_ranged_thorns = idx(perkPcts, 'ranged thorns', 0) === 1;

    let damageMod = 1 +
      idx(perkPcts, 'thorns damage 1', 0) * 0.5 +
      idx(perkPcts, 'thorns damage 2', 0) * 0.5 +
      idx(perkPcts, 'thorns damage 3', 0) * 0.5 +
      idx(perkPcts, 'thorns damage 4', 0) * 1;

    if (has_pierce) { damageMod /= 2; }
    if (has_ranged_thorns) { damageMod = damageMod * 2 / 3; }
    let damage = Math.floor(200 * damageMod);

    let durationMod =
      (1 + idx(perkPcts, 'thorns range 1', 0) * 1) *
      (1 + idx(perkPcts, 'thorns range 2', 0) * 1);
    let duration = 20 * durationMod;

    let bullet_count = Math.floor(
      5 + Math.floor(idx(perkPcts, 'thorns count 2', 0)) * 2 +
      Math.floor(idx(perkPcts, 'thorns count 1', 0)) * 2
    );

    let angles = Math.PI / 2.0;
    if (idx(perkPcts, 'thorn angle', 0) === 1) {
      angles = Math.PI / 3.0;
    }

    const rawAbil = {
      effect: ZoneAbilityDef.UnitEffectTypes.ABILITY,
      ability_source: ZoneAbilityDef.AbilitySources.CENTER_ZONE,
      abil_def: {
        ability_type: AbilityDef.AbilityTypes.PROJECTILE,
        shape: ProjectileAbilityDef.Shapes.TRI_SHOT,
        projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
        min_angle: angles,
        max_angle: angles,
        duration: duration,
        num_bullets: bullet_count,
        speed: 4,
        hit_effects: [{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: damage}],
      }
    };

    if (has_pierce) {
      rawAbil.abil_def.collision_behaviours = [
        {behaviour: CollisionBehaviour.PASSTHROUGH, count: 3},
      ];
    }

    if (has_stun) {
      rawAbil.abil_def.hit_effects.push(
        {effect: ProjectileShape.HitEffects.FREEZE, duration: 2}
      );
    }
    return rawAbil;
  }

  static GetPerkList() {
    let perkList = [
      // Level 0
      (new MaxxedAbilityPerkNode('melee thorns',    2, [0, 1])),
      (new AbilityPerkNode('health 1',    4, [0, 3])),
      (new MaxxedAbilityPerkNode('shield width 1',    3, [0, 5])),
      // Level 1
      (new AbilityPerkNode('thorns damage 1',    5, [1, 1]))
        .addRequirement(new PerkLevelRequirement('melee thorns')),
      (new AbilityPerkNode('health 2',    4, [1, 2]))
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
      (new MaxxedAbilityPerkNode('thorns count 1',    2, [2, 0]))
        .addRequirement(new PerkLevelRequirement('thorns damage 1')),
      (new AbilityPerkNode('thorns damage 3',    3, [2, 1]))
        .addRequirement(new PerkLevelRequirement('thorns damage 1')),
      (new AbilityPerkNode('thorns range 1',    3, [2, 2]))
        .addRequirement(new PerkLevelRequirement('thorns damage 1')),
      // Level 3
      (new AbilityPerkNode('health 4',    4, [3, 4]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('health 2'),
          new PerkLevelRequirement('cast range sideways'),
        ])),
      // Level 4
      (new MaxxedAbilityPerkNode('ranged thorns',    3, [4, 0]))
        .addRequirement(new PerkLevelRequirement('thorns damage 2')),
      (new AbilityPerkNode('thorns damage 2',    3, [4, 1]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('thorns count 1'),
          new PerkLevelRequirement('thorns damage 3'),
          new PerkLevelRequirement('thorns range 1')]
        )),
      (new MaxxedAbilityPerkNode('thorn angle',    3, [4, 3]))
        .addRequirement(new PerkLevelRequirement('thorns range 1'))
        .addRequirement(new PerkLevelRequirement('health 4')),
      (new AbilityPerkNode('health 3',    4, [4, 5]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('cast range sideways'),
          new PerkLevelRequirement('health 4')
        ])),
      // Level 5
      (new AbilityPerkNode('thorns range 2',    5, [5, 0]))
        .addRequirement(new PerkLevelRequirement('thorns damage 2')),
      (new AbilityPerkNode('cast range 2',    5, [5, 4]))
        .addRequirement(new PerkLevelRequirement('health 4')),
      // Level 6
      (new MaxxedAbilityPerkNode('thorns count 2',    2,   [6, 1]))
        .addRequirement(new PerkLevelRequirement('thorns damage 2')),
      (new AbilityPerkNode('health 5',    4, [6, 3]))
        .addRequirement(new PerkLevelRequirement('thorn angle')),
      (new MaxxedAbilityPerkNode('shield width 2',    3, [6, 5]))
        .addRequirement(new PerkLevelRequirement('health 3'))
        .addRequirement(new PerkLevelRequirement('cast range 2')),

      // Level 7
      (new MaxxedAbilityPerkNode('thorns pierce',    3, [7, 0]))
        .addRequirement(new PerkLevelRequirement('thorns range 2'))
        .addRequirement(new PerkLevelRequirement('thorns count 2')),

      (new AbilityPerkNode('thorns damage 4',    10, [7, 1]))
        .addRequirement(new PerkLevelRequirement('thorns count 2')),

      (new MaxxedAbilityPerkNode('stunning thorns',    3, [7, 2]))
        .addRequirement(new PerkLevelRequirement('thorns range 1'))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('shield width 2'),
          new PerkLevelRequirement('health 5'),
        ])),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }

  static GetDemoUnits() {
    return  [
      [null, UnitBasicSquare, UnitBasicSquare, UnitShooter, UnitBasicSquare, UnitBasicSquare],
      [null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [null, UnitBasicSquare, UnitShooter, UnitBasicSquare, UnitShooter, UnitBasicSquare],
      [null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [null, null, null, UnitBasicSquare],
    ];
  }

  static GetDemoTurns() {
    return 5;
  }
}

AbilityCore.coreList[7] = AbilityCore7;
