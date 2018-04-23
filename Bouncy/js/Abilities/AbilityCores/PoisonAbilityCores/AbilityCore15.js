// Explodes into a series of piercing projectiles after a certain time
// More wall bounces
// Shoot two projectiles
// More poison damage
// More impact damage
// Add "Corrosive" damage -- damages only armour.
// Increased duration
// Increased num pierces
class AbilityCore15 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let poisonPerkCount = (
      idx(perkPcts, 'poison damage 0', 0) +
      idx(perkPcts, 'poison damage 2', 0) +
      idx(perkPcts, 'poison damage 4', 0) +
      idx(perkPcts, 'poison damage 6', 0) +
      idx(perkPcts, 'poison damage 7', 0)
    );
    let impactPerkCount = (
      idx(perkPcts, 'impact damage 0', 0) +
      idx(perkPcts, 'impact damage 2', 0) +
      idx(perkPcts, 'impact damage 3', 0) +
      idx(perkPcts, 'impact damage 6', 0) +
      idx(perkPcts, 'impact damage 7', 0)
    );
    let corrosivePerkCount = (
      idx(perkPcts, 'corrosive damage 0', 0) +
      idx(perkPcts, 'corrosive damage 3', 0)
    );
    let damagePerkPct = (poisonPerkCount + impactPerkCount + corrosivePerkCount) / 12;

    let totalDamage = lerp(1000, 5000, damagePerkPct);
    let poisonPct = (1 + poisonPerkCount) / (2 + poisonPerkCount + impactPerkCount + corrosivePerkCount);
    let impactPct = (1 + impactPerkCount) / (2 + poisonPerkCount + impactPerkCount + corrosivePerkCount);
    let corrosivePct = (corrosivePerkCount) / (2 + poisonPerkCount + impactPerkCount + corrosivePerkCount);

    let numTargets = Math.round(
      5 +
      idx(perkPcts, 'more pen 1-1', 0) * 2 +
      idx(perkPcts, 'more pen 1-2', 0) * 2 +
      idx(perkPcts, 'more pen 6', 0) * 2 +
      idx(perkPcts, 'more pen 7', 0) * 3
    );

    let poison_duration = 2 +
      this.hasPerk(perkPcts, 'poison duration 6') +
      this.hasPerk(perkPcts, 'poison duration 7');

    let wall_bounces = Math.floor(AbilityConstants.MINOR_WALL_BOUNCES +
      this.hasPerk(perkPcts, 'wall bounces 5-1') * 1.5 +
      this.hasPerk(perkPcts, 'wall bounces 5-2') * 1.5 +
      (numTargets - 5) / 2
    );

    let bulletBonus = (this.hasPerk(perkPcts, 'double shot 4') ? 1 : 0);
    totalDamage *= lerp(1, 0.75, bulletBonus / 1);

    totalDamage /= numTargets;
    let corrosiveDamage = Math.round(corrosivePct * totalDamage);
    let poisonDamage = poisonPct * totalDamage / 2;
    let impactDamage = Math.round(impactPct * totalDamage);

    poisonDamage = Math.round(poisonDamage * lerp(1, 0.8, (poison_duration - 2) / 2));

    let hit_effects = [{
      effect: ProjectileShape.HitEffects.DAMAGE,
      base_damage: impactDamage
    },
    {
      effect: ProjectileShape.HitEffects.POISON,
      damage: poisonDamage,
      duration: poison_duration
    }];

    let damageDescription = 'It deals <<' + impactDamage + '>> damage ';

    if (corrosiveDamage > 0) {
      hit_effects.unshift({
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: corrosiveDamage,
        damage_type: Unit.DAMAGE_TYPE.CORROSIVE,
      });

      damageDescription += 'and <<' + corrosiveDamage + '>> Corrosive damage ';
    }

    damageDescription += 'to up to [[num_hits]] targets.';

    let styleBuilder = (new AbilitySheetSpriteAbilityStyleBuilder)
      .setSheet('bullet_sheet').setCoordNums(29, 301, 37, 320).setRotation(Math.PI / 2);

    const rawAbil = { // 1000 damage.  500 more per turn
      name: 'Poison Drill',
      card_text_description: '[[num_hits]] X <<' + impactDamage + '>>',
      style: styleBuilder.build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.TRI_SHOT,
      num_bullets: 1 + bulletBonus,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      collision_behaviours: [
        {behaviour: CollisionBehaviour.PASSTHROUGH, count: numTargets - 1},
      ],
      wall_bounces: wall_bounces,
      num_hits: numTargets,
      icon: "/Bouncy/assets/icons/icon_plain_drill.png",
      hit_effects: hit_effects,
      charge: {"initial_charge":-1, "max_charge":4, "charge_type":"TURNS"}
    };

    if (this.hasPerk(perkPcts, 'shrapnel 4')) {
      let shrapnel_count = 5 + (this.hasPerk(perkPcts, 'shrapnel count 7') ? 2 : 0);
      let timeoutEffect = [{
        effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
        abil_def: {
          style: styleBuilder.build(),
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
          collision_behaviours: [
            {behaviour: CollisionBehaviour.PASSTHROUGH, count: 99},
          ],
          speed: 4,
          projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
          duration: 15 + Math.round(idx(perkPcts, 'shrapnel range 6', 0) * 10),
          num_bullets: shrapnel_count,
          hit_effects: hit_effects,
        }
      }];
      rawAbil.timeout_hit_effects = timeoutEffect;
      rawAbil.timeout_effects = timeoutEffect;
      damageDescription += '  It then splits into <<' + shrapnel_count + '>> shards.';
    }

    rawAbil.description = 'Shoots ' + (this.hasPerk(perkPcts, 'double shot 4') ? 'two projectiles': 'a projectile') + ' that passes through enemies.<br>' +
      damageDescription + '<br>' +
      'It also poisons them, dealing <<' + poisonDamage + '>> over <<' + poison_duration + '>> turns';

    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetPerkList() {
    let perkList = [
      (new AbilityPerkNode('poison damage 0',           5, [0, 0])),
      (new AbilityPerkNode('corrosive damage 0',        5, [0, 3])),
      (new AbilityPerkNode('impact damage 0',           5, [0, 6])),
      // Level 1
      (new AbilityPerkNode('more pen 1-1',        4, [1, 2]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('corrosive damage 0'),
          new PerkLevelRequirement('poison damage 0')]
        )),
      (new AbilityPerkNode('more pen 1-2',        4, [1, 4]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('impact damage 0'),
          new PerkLevelRequirement('corrosive damage 0')]
        )),
      // Level 2
      (new AbilityPerkNode('poison damage 2',           5, [2, 1]))
        .addRequirement(new PerkLevelRequirement('more pen 1-1')),
      (new AbilityPerkNode('impact damage 2',           5, [2, 5]))
        .addRequirement(new PerkLevelRequirement('more pen 1-2')),
      // Level 3
      (new AbilityPerkNode('impact damage 3',           5, [3, 2]))
        .addRequirement(new PerkLevelRequirement('poison damage 2')),
      (new AbilityPerkNode('corrosive damage 3',        5, [3, 4]))
        .addRequirement(new PerkLevelRequirement('impact damage 2')),
      // Level 4
      (new MaxxedAbilityPerkNode('shrapnel 4',          5, [4, 1]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('impact damage 3'),
          new PerkLevelRequirement('poison damage 2')]
        )),
      (new AbilityPerkNode('poison damage 4',           5, [4, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('impact damage 3'),
          new PerkLevelRequirement('corrosive damage 3')]
        )),
      (new MaxxedAbilityPerkNode('double shot 4',       5, [4, 5]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('impact damage 2'),
          new PerkLevelRequirement('corrosive damage 3')]
        )),
      // Level 5
      (new MaxxedAbilityPerkNode('wall bounces 5-1',    5, [5, 2]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('shrapnel 4'),
          new PerkLevelRequirement('impact damage 3')]
        )),
      (new MaxxedAbilityPerkNode('wall bounces 5-2',    5, [5, 4]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('corrosive damage 3'),
          new PerkLevelRequirement('double shot 4')]
        )),
      // Level 6
      (new AbilityPerkNode('shrapnel range 6',          5, [6, 0]))
        .addRequirement(new PerkLevelRequirement('shrapnel 4')),
      (new AbilityPerkNode('impact damage 6',           5, [6, 1]))
        .addRequirement(new PerkLevelRequirement('shrapnel 4')),
      (new MaxxedAbilityPerkNode('poison duration 6',   5, [6, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('wall bounces 5-1'),
          new PerkLevelRequirement('wall bounces 5-2')]
        )),
      (new AbilityPerkNode('poison damage 6',           5, [6, 5]))
        .addRequirement(new PerkLevelRequirement('double shot 4')),
      (new AbilityPerkNode('more pen 6',          4, [6, 6]))
        .addRequirement(new PerkLevelRequirement('double shot 4')),
      // Level 7
      (new MaxxedAbilityPerkNode('shrapnel count 7',    5, [7, 0]))
        .addRequirement(new PerkLevelRequirement('shrapnel range 6')),
      (new AbilityPerkNode('impact damage 7',           5, [7, 1]))
        .addRequirement(new PerkLevelRequirement('impact damage 6')),
      (new MaxxedAbilityPerkNode('poison duration 7',   5, [7, 3]))
        .addRequirement(new PerkLevelRequirement('poison duration 6')),
      (new AbilityPerkNode('poison damage 7',           5, [7, 5]))
        .addRequirement(new PerkLevelRequirement('poison damage 6')),
      (new AbilityPerkNode('more pen 7',          6, [7, 6]))
        .addRequirement(new PerkLevelRequirement('more pen 6')),
    ];
    return perkList;
  }

  static GetAimOffsets() {
    return {x: 30 * 6, y: -18 * 6};
  }

  static GetDemoTurns() {
    return 4;
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }

  static GetDemoUnits() {
    return  [
      [null, UnitBasicSquare, UnitBasicSquare, UnitShooter, UnitBasicSquare, UnitBasicSquare],
      [null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [null, UnitKnight, UnitBasicSquare, UnitShooter, UnitBasicSquare, UnitKnight]
    ];
  }
}

AbilityCore.coreList[15] = AbilityCore15;
