class AbilityCore3 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let damageMod = 1 +
      idx(perkPcts, 'damage 10', 0) * 0.20 +
      idx(perkPcts, 'damage 30', 0) * 0.10 +
      idx(perkPcts, 'damage 31', 0) * 0.10 +
      idx(perkPcts, 'damage 32', 0) * 0.10 + // .5
      idx(perkPcts, 'damage 41', 0) * 0.25 +
      idx(perkPcts, 'damage 43', 0) * 0.25 + // 1
      idx(perkPcts, 'damage 60', 0) * 0.33 +
      idx(perkPcts, 'damage 61', 0) * 0.33 +
      idx(perkPcts, 'damage 62', 0) * 0.33 + // 2
      idx(perkPcts, 'damage 63', 0) * 0.33 +
      idx(perkPcts, 'damage 64', 0) * 0.33 +
      idx(perkPcts, 'damage 65', 0) * 0.33 + // 3
      idx(perkPcts, 'damage 66', 0) * 0.33   // 3.3
      ; // max is 3.3
    let totalDamage = 1600 * damageMod; // Final damage won't always equal this.
    let num_bullets = 20;
    num_bullets +=
      idx(perkPcts, 'more bullets 20', 0) * 5 +
      idx(perkPcts, 'more bullets 21', 0) * 5 +
      idx(perkPcts, 'more bullets 30', 0) * 10 +
      idx(perkPcts, 'more bullets 53', 0) * 20;
    num_bullets = Math.round(num_bullets);

    let per_bullet_damage = totalDamage / (num_bullets * 0.8);
    let penetrates = this.hasPerk(perkPcts, 'penetrate 20');
    if (penetrates) {
      per_bullet_damage *= 0.6;
    }

    let destroy_on_wall = true;
    if (this.hasPerk(perkPcts, 'wall bounce')) {
      destroy_on_wall = [BorderWallLine.TOP];
    }

    let timeoutEffects = [];

    let splits = this.hasPerk(perkPcts, 'bullets split');
    let num_splits = 2 + (this.hasPerk(perkPcts, 'more splits 56') ? 2 : 0);
    if (splits) {
      let after_split_damage = per_bullet_damage / (5.0 * num_splits);
      after_split_damage *= 1 + idx(perkPcts, 'split damage 54', 0);
      per_bullet_damage -= after_split_damage * num_splits;
      after_split_damage *= 2;
      after_split_damage = Math.round(after_split_damage);
      timeoutEffects.push({
        effect: ProjectileShape.HitEffects.BULLET_SPLIT,
        style: (new AbilitySheetSpriteAbilityStyleBuilder)
          .setSheet('bullet_sheet').setCoordNums(19, 159, 24, 166).setRotation(0).fixRotation(true).build(),
        projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
        hit_effects: [{
          effect:ProjectileShape.HitEffects.DAMAGE,
          base_damage: after_split_damage,
        }],
        num_bullets: num_splits,
        destroy_on_wall: destroy_on_wall,
      });
    }

    let collisionBehaviours = [];
    let bounces = this.hasPerk(perkPcts, 'enemy bounce');
    let bounces_twice = this.hasPerk(perkPcts, 'one more bounce');
    if (bounces) {
      collisionBehaviours.push(
        {behaviour: CollisionBehaviour.BOUNCE, count: 1}
      );
      if (bounces_twice) {
        collisionBehaviours.push(
          {behaviour: CollisionBehaviour.BOUNCE, count: 1}
        );
        per_bullet_damage = per_bullet_damage * 0.4;
      } else {
        per_bullet_damage = per_bullet_damage * 0.6;
      }
    }

    if (penetrates) {
      if (splits) {
        timeoutEffects[0].collision_behaviours = [{
          behaviour: CollisionBehaviour.PASSTHROUGH, count: 1
        }];
      } else {
        collisionBehaviours.push(
          {behaviour: CollisionBehaviour.PASSTHROUGH, count: 1}
        );
      }
    }

    let speed_decay = 1 - 0.02 *
      (idx(perkPcts, 'wider area 30', 0) === 1 ? 0.5 : 1) *
      (idx(perkPcts, 'wider area 52', 0) === 1 ? 0.5 : 1);

    per_bullet_damage = Math.round(per_bullet_damage);

    const rawAbil = { // 2250 max damage.
      name: 'Rain',
      description: 'Make it rain.<br>Fires [[num_bullets]] projectiles.<br>' +
        'Each one deals [[hit_effects[0].base_damage]] damage' +
        (bounces ? ', bounces ' + (bounces_twice ? 'twice' : 'once') : '') +
        (splits ? ', and then splits into [[timeout_hit_effects[0].num_bullets]] projectiles that deal [[timeout_hit_effects[0].hit_effects[0].base_damage]] damage' : '') +
        (penetrates ? ' and passes through one enemy' : '') +
        '.<br>Can\'t be aimed.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(37, 159, 44, 166).setRotation(0).fixRotation(true).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.RAIN,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: destroy_on_wall,
      hit_effects: [
        {effect: ProjectileShape.HitEffects.DAMAGE, base_damage: per_bullet_damage},
      ],
      timeout_hit_effects: timeoutEffects,
      collision_behaviours: collisionBehaviours,
      speed_decay: {x: speed_decay, y: 1},
      num_bullets: num_bullets,
      icon: "/Bouncy/assets/icons/icon_plain_rain.png",
    };

    let cooldown = this.getCooldown(perkList, perkCounts);
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

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
      (new AbilityPerkNode('more bullets 30',    5, [3, 2]))
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
      (new AbilityPerkNode('wider area 30',    3, [3, 4]))
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
        .addRequirement(new PerkLevelRequirement('wider area 30')),
      (new AbilityPerkNode('damage 43',    3, [4, 4]))
        .addRequirement(new PerkLevelRequirement('damage 31'))
        .addRequirement(new PerkLevelRequirement('wider area 30')),
      (new MaxxedAbilityPerkNode('bullets split',    3, [4, 5]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('wider area 30'),
          new PerkLevelRequirement('damage 32')]
        )),
      // Level 5
      (new MaxxedAbilityPerkNode('one more bounce',    3, [5, 0]))
        .addRequirement(new PerkLevelRequirement('enemy bounce')),
      (new AbilityPerkNode('cooldown 51',    5, [5, 1]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('enemy bounce'),
          new PerkLevelRequirement('damage 41')]
        )),
      (new AbilityPerkNode('wider area 52',    3, [5, 2]))
        .addRequirement(new PerkLevelRequirement('enemy bounce'))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('damage 41'),
          new PerkLevelRequirement('wall bounce')]
        )),
      (new AbilityPerkNode('more bullets 53',    5, [5, 3]))
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
      (new AbilityPerkNode('cooldown 55',    5, [5, 5]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('damage 43'),
          new PerkLevelRequirement('bullets split')]
        )),
      (new MaxxedAbilityPerkNode('more splits 56',    3, [5, 6]))
        .addRequirement(new PerkLevelRequirement('bullets split')),
      // Level 6
      (new AbilityPerkNode('damage 60',    3, [6, 0]))
        .addRequirement(new PerkLevelRequirement('one more bounce')),
      (new AbilityPerkNode('damage 61',    3, [6, 1]))
        .addRequirement(new PerkLevelRequirement('cooldown 51')),
      (new AbilityPerkNode('damage 62',    3, [6, 2]))
        .addRequirement(new PerkLevelRequirement('wider area 52')),
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

  static getCooldown(perkList, perkCounts) {
    let perkCount = perkList.length;
    let cooldown = perkCount * 0.2 + 3;
    cooldown -= idx(perkCounts, 'cooldown 51', 0);
    cooldown -= idx(perkCounts, 'cooldown 55', 0);

    cooldown = Math.round(cooldown);
    if (cooldown <= 1) {
      return null;
    }

    return {initial_charge: -1, max_charge: cooldown, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.CHAOS;
  }

  static GetDemoUnits() {
    return  [
      [UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitShooter, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [UnitBasicSquare, UnitBasicSquare, UnitShooter, UnitBasicSquare, UnitShooter, UnitBasicSquare, UnitBasicSquare],
      [UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [null, null, null, UnitBasicSquare],
    ];
  }

  static GetDemoTurns() {
    return 0;
  }
}

AbilityCore.coreList[3] = AbilityCore3;
