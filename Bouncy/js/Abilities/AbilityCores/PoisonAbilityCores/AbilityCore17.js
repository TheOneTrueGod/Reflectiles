class AbilityCore17 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let totalDamage = lerp(1000, 10000,
      (
        idx(perkPcts, 'more damage 1', 0) * 4 +
        idx(perkPcts, 'more damage 2', 0) * 4 +
        idx(perkPcts, 'more damage 3', 0) * 10 +
        idx(perkPcts, 'more damage 4', 0) * 10 +
        idx(perkPcts, 'more damage 5', 0) * 16 +
        idx(perkPcts, 'more damage 6', 0) * 16 +
        idx(perkPcts, 'more damage 7', 0) * 22 +
        idx(perkPcts, 'more damage 8', 0) * 22 +

        idx(perkPcts, 'more dakka 1', 0) * 4 +
        idx(perkPcts, 'more dakka 2', 0) * 4 +
        idx(perkPcts, 'more dakka 3', 0) * 10 +
        idx(perkPcts, 'more dakka 4', 0) * 10 +
        idx(perkPcts, 'more dakka 5', 0) * 16 +
        idx(perkPcts, 'more dakka 6', 0) * 16 +
        idx(perkPcts, 'more dakka 7', 0) * 22 +
        idx(perkPcts, 'more dakka 8', 0) * 22
      ) / 208
    );
    let num_bullets = Math.floor(lerp(25, 71,
      (
        idx(perkPcts, 'more dakka 1', 0) * 3 +
        idx(perkPcts, 'more dakka 2', 0) * 3 +
        idx(perkPcts, 'more dakka 3', 0) * 4 +
        idx(perkPcts, 'more dakka 4', 0) * 4 +
        idx(perkPcts, 'more dakka 5', 0) * 5 +
        idx(perkPcts, 'more dakka 6', 0) * 5 +
        idx(perkPcts, 'more dakka 7', 0) * 6 +
        idx(perkPcts, 'more dakka 8', 0) * 6
      ) / 36
    ));
    let bullet_wave_delay = 3;
    if (num_bullets >= 45) {
      bullet_wave_delay = 2;
    }

    let accuracy_decay = lerp(Math.PI / 5.12, Math.PI / 10,
      (
        idx(perkPcts, 'better aim 1', 0) +
        idx(perkPcts, 'better aim 2', 0)
      ) / 2
    ) / num_bullets;

    let shotDamage = Math.floor(totalDamage / num_bullets);
    const rawAbil = { // 2440 damage max.  Actually dealing less than that
      name: 'Shoot \'em up',
      description: 'Shoots a wild spray of bullets.<br>' +
        '[[num_bullets]] bullets deal [[hit_effects[0].base_damage]] damage',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(29, 301, 37, 320).setRotation(Math.PI / 2).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [],
      num_bullets,
      bullet_wave_delay,
      accuracy_decay,
      wall_bounces: 1,
      icon: "/Bouncy/assets/icons/bullets.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: shotDamage
      }],
    };
    return AbilityDef.createFromJSON(rawAbil);
  }

  static getCooldown(perkList, perkPcts) {
    let perkCount = perkList.length;
    // 96 * 0.15 = 14.4
    let cooldown = perkCount * 0.15 - 3;
    cooldown -= idx(perkPcts, 'cooldown 1', 0) * 4.7;
    cooldown -= idx(perkPcts, 'cooldown 2', 0) * 4.7;

    cooldown = Math.round(cooldown);
    if (cooldown <= 1) {
      return null;
    }

    return {initial_charge: -1, max_charge: cooldown, charge_type: "TURNS"};
  }

  static GetPerkList() {
    let perkList = [
      // Dakka line
      (new AbilityPerkNode('more dakka 1',    3,  [0, 0])),
      (new AbilityPerkNode('more dakka 2',    3,  [1, 1]))
        .addRequirement(new PerkLevelRequirement('more dakka 1', 'max')),
      (new AbilityPerkNode('more dakka 3',    4,  [2, 0]))
        .addRequirement(new PerkLevelRequirement('more dakka 2', 'max')),
      (new AbilityPerkNode('more dakka 4',    4,  [3, 1]))
        .addRequirement(new PerkLevelRequirement('more dakka 3', 'max'))
        .addRequirement(new PerksSpentRequirement(16)),
      (new AbilityPerkNode('more dakka 5',    5,  [4, 0]))
        .addRequirement(new PerkLevelRequirement('more dakka 4', 'max')),
      (new AbilityPerkNode('more dakka 6',    5,  [5, 1]))
        .addRequirement(new PerkLevelRequirement('more dakka 5', 'max'))
        .addRequirement(new PerksSpentRequirement(31)),
      (new AbilityPerkNode('more dakka 7',    6,  [6, 0]))
        .addRequirement(new PerkLevelRequirement('more dakka 6', 'max')),
      (new AbilityPerkNode('more dakka 8',    6,  [7, 1]))
        .addRequirement(new PerkLevelRequirement('more dakka 7', 'max'))
        .addRequirement(new PerksSpentRequirement(48)),

      // Damage line
      (new AbilityPerkNode('more damage 1',    3,  [0, 6])),
      (new AbilityPerkNode('more damage 2',    3,  [1, 5]))
        .addRequirement(new PerkLevelRequirement('more damage 1', 'max')),
      (new AbilityPerkNode('more damage 3',    4,  [2, 6]))
        .addRequirement(new PerkLevelRequirement('more damage 2', 'max')),
      (new AbilityPerkNode('more damage 4',    4, [3, 5]))
        .addRequirement(new PerkLevelRequirement('more damage 3', 'max'))
        .addRequirement(new PerksSpentRequirement(16)),
      (new AbilityPerkNode('more damage 5',    5, [4, 6]))
        .addRequirement(new PerkLevelRequirement('more damage 4', 'max')),
      (new AbilityPerkNode('more damage 6',    5, [5, 5]))
        .addRequirement(new PerkLevelRequirement('more damage 5', 'max'))
        .addRequirement(new PerksSpentRequirement(31)),
      (new AbilityPerkNode('more damage 7',    6, [6, 6]))
        .addRequirement(new PerkLevelRequirement('more damage 6', 'max')),
      (new AbilityPerkNode('more damage 8',    6, [7, 5]))
        .addRequirement(new PerkLevelRequirement('more damage 7', 'max'))
        .addRequirement(new PerksSpentRequirement(48)),

      // Other effects
      (new AbilityPerkNode('cooldown 1',    6,  [1, 3]))
        .addRequirement(new PerksSpentRequirement(3)),
      (new AbilityPerkNode('better aim 1',   6,  [3, 3]))
        .addRequirement(new PerksSpentRequirement(10)),
      (new AbilityPerkNode('cooldown 2',    6,  [5, 3]))
        .addRequirement(new PerksSpentRequirement(25)),
      (new AbilityPerkNode('better aim 2',    6,  [7, 3]))
        .addRequirement(new PerksSpentRequirement(42)),
      // Cooldown
      // increase poison damage
      // Better Aim
      // More shots before aim wavers
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[17] = AbilityCore17;
