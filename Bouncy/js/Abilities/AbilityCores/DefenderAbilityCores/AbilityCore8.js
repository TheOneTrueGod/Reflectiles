// Fire some ice shards when shooting.  The ice shards deal damage
//   - Ice shards pierce once
// Create an ice block in squares in AoE that have no enemies
//   - Increase ice block health
// Create 3x1 wall of ice blocks in front of yourself
// Increase stun time by 1 turn
class AbilityCore8 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let freezeDuration = 2 + this.hasPerk(perkPcts, 'freeze duration 6');
    let boxX = this.hasPerk(perkPcts, 'freeze area 0') ? 1 : 0;
    let boxY = this.hasPerk(perkPcts, 'freeze area 5') ? 1 : 0;
    let childAbils = [];

    let coreDamage = Math.floor(lerp(100, 400,
      (
        idx(perkPcts, 'core damage 1', 0) * 4 +
        idx(perkPcts, 'core damage 2', 0) * 6
      ) / 10
    ));

    let bouncingDamage = Math.floor(lerp(coreDamage, coreDamage + 200,(
      idx(perkPcts, 'bouncing damage 3', 0) * 4 +
      idx(perkPcts, 'bouncing damage 6', 0) * 6
      ) / 10
    ));

    let description = 'Freezes a <<' + (boxX * 2 + 1) + '>>x<<' + (boxY * 2 + 1) +
      '>> square of enemies for <<' + freezeDuration + '>> turns.  It deals <<' + coreDamage + '>> damage.';

    let coreCollisionBehaviours = [];
    if (this.hasPerk(perkPcts, 'bouncing 0')) {
      let numBounces = 1 + this.hasPerk(perkPcts, 'another bounce 5');
      coreCollisionBehaviours.push(
        {behaviour: CollisionBehaviour.BOUNCE, count: numBounces}
      );
      description += '<br>The shot also bounces <<' + numBounces + '>> time' + (numBounces > 1 ? 's' : '') + ', dealing <<' + bouncingDamage + '>> on each bounce';
      if (this.hasPerk(perkPcts, 'bouncing freeze 1')) {
        description += ' and freezing'
      }
      description += '.'
    }

    let bounceEffects = [];
    if (this.hasPerk(perkPcts, 'bouncing freeze 1')) {
      bounceEffects.push({effect: ProjectileShape.HitEffects.FREEZE, duration: freezeDuration});
    }
    bounceEffects.push({effect: ProjectileShape.HitEffects.DAMAGE, base_damage: bouncingDamage});

    childAbils.push({
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      style: {style_name: 'COLORIZED', color: 0x00f4ff},
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      collision_behaviours: coreCollisionBehaviours,
      collision_effects: bounceEffects,
      timeout_hit_effects: [
        {effect: ProjectileShape.HitEffects.DAMAGE, base_damage: coreDamage, aoe_type: "BOX", aoe_size: {x: [-boxX, boxX], y: [-boxY, boxY]}},
        {effect: ProjectileShape.HitEffects.FREEZE, duration: freezeDuration, aoe_type: "BOX", aoe_size: {x: [-boxX, boxX], y: [-boxY, boxY]}}
      ],
    });

    if (this.hasPerk(perkPcts, 'ice shard 0')) {
      let shardTotalDamage =
        lerp(400, 2000,
          (
            idx(perkPcts, 'shard damage 1', 0) * 3 +
            idx(perkPcts, 'shards pierce 5', 0) +
            idx(perkPcts, 'shards bounce 3', 0) +
            idx(perkPcts, 'more shards 2', 0) +
            idx(perkPcts, 'shard damage 6', 0) * 4
          ) / 10
        );
      let numShards = 4 + this.hasPerk(perkPcts, 'more shards 2') * 2;
      let shardDamage = Math.floor(shardTotalDamage / numShards);

      let collisionBehaviours = [];
      if (this.hasPerk(perkPcts, 'shards bounce 3')) {
        collisionBehaviours.push(
          {behaviour: CollisionBehaviour.BOUNCE, count: 1}
        );
      }

      if (this.hasPerk(perkPcts, 'shards pierce 5')) {
        collisionBehaviours.push(
          {behaviour: CollisionBehaviour.PIERCE, count: 1}
        );
      }

      description += "<br>Also fires <<" + numShards + ">> shards of ice that deal <<" + shardDamage + ">> damage.";
      childAbils.push({
        ability_type: AbilityDef.AbilityTypes.PROJECTILE,
        shape: ProjectileAbilityDef.Shapes.TRI_SHOT,
        style: (new AbilitySheetSpriteAbilityStyleBuilder())
          .setSheet('weapons_sheet')
          .setCoordNums(27, 1, 51, 23)
          .setScale(0.75).build(),
        speed: 6,
        projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
        num_bullets: numShards,
        collision_behaviours: collisionBehaviours,
        hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: shardDamage}],
      });
    }

    let cooldownReduction = 0;
    if (this.hasPerk(perkPcts, 'freeze recharge 7')) {
      cooldownReduction = 1;
      description += "<br>If a target frozen by this ability dies, the cooldown of this skill is reduced by <<" + cooldownReduction + ">>.";
    }

    let cooldown = Math.floor(
      3 + perkList.length * 0.1 - idx(perkPcts, 'cooldown 3', 0) * 5
    );

    const rawAbil = {
      name: 'Freeze',
      description: description,
      ability_type: AbilityDef.AbilityTypes.MULTIPART,
      icon: "/Bouncy/assets/icons/icon_plain_frost.png",
      special_effects: {status_effect_death_recharge: cooldownReduction},
      charge: {initial_charge: -1, max_charge: cooldown, charge_type: "TURNS"},
      child_abilities: childAbils,
    };
    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetPerkList() {
    let perkList = [
      (new MaxxedAbilityPerkNode('ice shard 0',           2, [0, 0])),
      (new MaxxedAbilityPerkNode('freeze area 0',         2, [0, 3])),
      (new MaxxedAbilityPerkNode('bouncing 0',            2, [0, 6])),
      // Level 1
      (new AbilityPerkNode('shard damage 1',              6, [1, 0]))
        .addRequirement(new PerkLevelRequirement('ice shard 0')),
      (new AbilityPerkNode('core damage 1',               10, [1, 3]))
        .addRequirement(new PerkLevelRequirement('freeze area 0'))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('ice shard 0'),
          new PerkLevelRequirement('bouncing 0')]
        )),
      (new MaxxedAbilityPerkNode('bouncing freeze 1',     3, [1, 6]))
        .addRequirement(new PerkLevelRequirement('bouncing 0')),
      // Level 2
      (new MaxxedAbilityPerkNode('more shards 2',         3, [2, 1]))
        .addRequirement(new PerkLevelRequirement('ice shard 0')),
      (new AbilityPerkNode('core damage 2',               10, [2, 5]))
        .addRequirement(new PerkLevelRequirement('bouncing 0')),
      // Level 3
      (new MaxxedAbilityPerkNode('shards bounce 3',         3, [3, 1]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('more shards 2'),
          new PerkLevelRequirement('shard damage 1')
        ])),
      (new AbilityPerkNode('cooldown 3',                  10, [3, 2]))
        .addRequirement(new PerkLevelRequirement('core damage 1'))
        .addRequirement(new PerkLevelRequirement('more shards 2')),
      (new AbilityPerkNode('cooldown 3-2',                10, [3, 4]))
        .addRequirement(new PerkLevelRequirement('core damage 1'))
        .addRequirement(new PerkLevelRequirement('core damage 2')),
      (new AbilityPerkNode('bouncing damage 3',           4, [3, 5]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('core damage 2'),
          new PerkLevelRequirement('bouncing freeze 1')
        ])),
      // Level 5
      (new MaxxedAbilityPerkNode('shards pierce 5',       3, [5, 2]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('more shards 2'),
          new PerkLevelRequirement('shards bounce 3')
        ])),
      (new MaxxedAbilityPerkNode('another bounce 5',      3, [5, 4]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('bouncing damage 3'),
          new PerkLevelRequirement('core damage 2')
        ])),
      (new MaxxedAbilityPerkNode('freeze area 5',         6, [5, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('cooldown 3', 3),
          new PerkLevelRequirement('cooldown 3-2', 3)]
        )),
      // Level 6
      (new AbilityPerkNode('shard damage 6',              10, [6, 2]))
        .addRequirement(new PerkLevelRequirement('shards pierce 5')),
      (new MaxxedAbilityPerkNode('freeze duration 6',     3, [6, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('shards pierce 5'),
          new PerkLevelRequirement('another bounce 5')]
        )),
      (new AbilityPerkNode('bouncing damage 6',           6, [6, 4]))
        .addRequirement(new PerkLevelRequirement('another bounce 5')),
      // Level 7
      (new MaxxedAbilityPerkNode('freeze recharge 7',     6, [7, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('shard damage 6'),
          new PerkLevelRequirement('bouncing damage 6')]
        )),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }

  static GetAimOffsets() {
    return {x: 30 * 3, y: -16 * 6};
  }

  static GetDemoTurns() {
    return 2;
  }
}

AbilityCore.coreList[8] = AbilityCore8;
