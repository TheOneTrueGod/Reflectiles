class AbilityCore19 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let damagePerkPct = (
      idx(perkPcts, 'damage 0-1', 0) +
      idx(perkPcts, 'damage 0-2', 0) +
      idx(perkPcts, 'damage 2-1', 0) * 2 +
      idx(perkPcts, 'damage 2-2', 0) * 2 +
      // First branch
      idx(perkPcts, 'damage 6-1', 0) * 2 +
      idx(perkPcts, 'damage 6-2', 0) +
      // Second branch
      idx(perkPcts, 'damage 6-3', 0) +
      idx(perkPcts, 'damage 7-1', 0) * 2 +
      // Last branch
      idx(perkPcts, 'damage 6-4', 0) +
      idx(perkPcts, 'damage 7-2', 0) * 2 +
      // Other minor sources of damage
      this.hasPerk(perkPcts, 'duration up 1-1', 0) * 0.5 +
      this.hasPerk(perkPcts, 'duration up 1-2', 0) * 0.5 +
      this.hasPerk(perkPcts, 'duration up 3' , 0) * 0.5 +
      this.hasPerk(perkPcts, 'duration up 4' , 0) * 0.5 +
      this.hasPerk(perkPcts, 'duration down 1-1', 0) * 0.5 +
      this.hasPerk(perkPcts, 'duration down 5' , 0) * 0.5
    ) / (9 + 3);

    let base_duration = 4; // min: 2, max: 8
    let max_duration = 8;

    let duration = base_duration +
      (this.hasPerk(perkPcts, 'duration up 1-1') ? 1 : 0) +
      (this.hasPerk(perkPcts, 'duration up 1-2') ? 1 : 0) +
      (this.hasPerk(perkPcts, 'duration up 3') ? 1 : 0) +
      (this.hasPerk(perkPcts, 'duration up 4') ? 1 : 0) +
      (this.hasPerk(perkPcts, 'duration down 1-1') ? -1 : 0) +
      (this.hasPerk(perkPcts, 'duration down 5') ? -1 : 0);

    let AoE = this.hasPerk(perkPcts, 'AoE up 2') ? {x:[-2,2],y:[-1,1]} : {x:[-1,1],y:[-1,1]};
    let totalDamage = lerp(300, 1200, damagePerkPct);
    if (duration < base_duration) {
      totalDamage *= lerp(0.8, 1, (duration - 2) / (base_duration - 2));
    }

    if (this.hasPerk(perkPcts, 'intense poison')) {
      AoE.x[0] += 1; AoE.x[1] -= 1;
      AoE.y[0] += 1; AoE.y[1] -= 1;
      totalDamage *= 2;
    }

    let damagePerTurn = Math.round(totalDamage / duration);

    const rawAbil = {
      name: 'Poison Explosion',
      description: 'Fires a single bullet, poisoning all enemies in a 5x3 area<br>' +
        'Deals [[hit_effects[0].damage]] damage per turn for [[hit_effects[0].duration]] turns.',
      card_text_description: '[[hit_effects[0].damage]] 5x3',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('poison_sheet')
        .setCoords({left: 53, top: 85, right: 72, bottom: 93})
        .setExplosion(AbilityStyle.getExplosionPrefab(AbilityStyle.EXPLOSION_PREFABS.POISON))
        .setRotation(-Math.PI).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects: [],
      timeout_hit_effects:[{
        damage: damagePerTurn,
        duration: duration,
        effect:ProjectileShape.HitEffects.POISON,
        aoe_type: "BOX",
        aoe_size: AoE,
      }],
      icon: "/Bouncy/assets/icons/poison-gas.png",
      charge: this.getCooldown(perkList, perkPcts),
    };

    if (this.hasPerk(perkPcts, 'passthrough')) {
      rawAbil.collision_behaviours = [
        {behaviour: CollisionBehaviour.PASSTHROUGH, count: 1},
      ];
    }

    return AbilityDef.createFromJSON(rawAbil);
  }

  static getCooldown(perkList, perkPcts) {
    let perkCount = perkList.length;
    let cooldown = 6 + 0.05 * perkCount;
    cooldown -= idx(perkPcts, 'cooldown 3', 0) * 4;
    cooldown -= idx(perkPcts, 'cooldown 3-2', 0) * 4;
    cooldown -= idx(perkPcts, 'cooldown 7', 0) * 4;
    cooldown = Math.round(cooldown);
    if (cooldown <= 1) {
      return null;
    }

    return {initial_charge: -1, max_charge: cooldown, charge_type: "TURNS"};
  }

  static GetPerkList() {
    let perkList = [
      (new AbilityPerkNode('damage 0-1',    5, [0, 2])),
      (new AbilityPerkNode('damage 0-2',    5, [0, 4])),
      // Level 1
      (new MaxxedAbilityPerkNode('duration up 1-1',      3, [1, 1]))
        .addRequirement(new PerkLevelRequirement('damage 0-1')),
      (new MaxxedAbilityPerkNode('duration up 1-2',      3, [1, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('damage 0-1'),
          new PerkLevelRequirement('damage 0-2')]
        )),
      (new MaxxedAbilityPerkNode('duration down 1-1',    3, [1, 5]))
        .addRequirement(new PerkLevelRequirement('damage 0-2')),
      // Level 2
      (new AbilityPerkNode('damage 2-1',    5, [2, 0]))
        .addRequirement(new PerkLevelRequirement('duration up 1-1')),
      (new MaxxedAbilityPerkNode('AoE up 2',    3, [2, 2]))
        .addRequirement(new PerkLevelRequirement('damage 0-1')),
      (new AbilityPerkNode('damage 2',    5, [2, 4]))
        .addRequirement(new PerkLevelRequirement('damage 0-2')),
      (new AbilityPerkNode('damage 2-2',    5, [2, 6]))
        .addRequirement(new PerkLevelRequirement('duration down 1-1')),
      // Level 3
      (new AbilityPerkNode('damage 3',    5, [3, 1]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('AoE up 2'),
          new PerkLevelRequirement('duration up 1-1')]
        )),
      (new AbilityPerkNode('cooldown 3',    5, [3, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('AoE up 2'),
          new PerkLevelRequirement('damage 2')]
        )),
      (new AbilityPerkNode('cooldown 3-2',    5, [3, 5]))
        .addRequirement(new PerkLevelRequirement('duration down 1-1')),
      // Level 4
      (new MaxxedAbilityPerkNode('duration up 3',    3, [4, 0]))
        .addRequirement(new PerkLevelRequirement('damage 3')),
      (new MaxxedAbilityPerkNode('impact damage', 3, [4, 2]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('cooldown 3'),
          new PerkLevelRequirement('damage 3')]
        )),
      (new MaxxedAbilityPerkNode('duration up 4',    3, [4, 4]))
        .addRequirement(new PerkLevelRequirement('damage 2')),
      // Level 5
      (new MaxxedAbilityPerkNode('poison cloud',     3, [5, 1]))
        .addRequirement(new PerkLevelRequirement('damage 3'))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('intense poison', 1)))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('bouncing bullets', 1))),
      (new MaxxedAbilityPerkNode('bouncing bullets', 3, [5, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('duration up 4'),
          new PerkLevelRequirement('cooldown 3')]
        ))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('intense poison', 1)))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('poison cloud', 1))),
      (new MaxxedAbilityPerkNode('impact damage 5', 3, [6, 4]))
        .addRequirement(new PerkLevelRequirement('duration up 4')),
      (new MaxxedAbilityPerkNode('intense poison', 3, [5, 5]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('duration up 4'),
          new PerkLevelRequirement('cooldown 3-2')]
        ))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('bouncing bullets', 1)))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('poison cloud', 1))),
      // Level 6
      (new AbilityPerkNode('damage 6-1',    5, [6, 0]))
        .addRequirement(new PerkLevelRequirement('poison cloud')),
      (new AbilityPerkNode('damage 6-2',    5, [6, 1]))
        .addRequirement(new PerkLevelRequirement('poison cloud')),
      (new MaxxedAbilityPerkNode('another bounce',    5, [6, 2]))
        .addRequirement(new PerkLevelRequirement('bouncing bullets')),
      (new AbilityPerkNode('damage 6-3',    5, [6, 3]))
        .addRequirement(new PerkLevelRequirement('bouncing bullets')),
      (new AbilityPerkNode('duration down 5',    5, [6, 6]))
        .addRequirement(new PerkLevelRequirement('intense poison')),
      (new AbilityPerkNode('damage 6-4',    5, [6, 5]))
        .addRequirement(new PerkLevelRequirement('intense poison')),
      // Level 7
      (new AbilityPerkNode('range 7',    5, [7, 0]))
        .addRequirement(new PerkLevelRequirement('damage 6-2')),
      (new MaxxedAbilityPerkNode('poison fumes',    5, [7, 1]))
        .addRequirement(new PerkLevelRequirement('damage 6-2')),
      (new AbilityPerkNode('damage 7-1',            5, [7, 2]))
        .addRequirement(new PerkLevelRequirement('another bounce')),
      (new AbilityPerkNode('cooldown 7',             5, [7, 3]))
        .addRequirement(new PerkLevelRequirement('damage 6-3')),
      (new AbilityPerkNode('damage 7-2',            5, [7, 5]))
        .addRequirement(new PerkLevelRequirement('damage 6-4')),
      (new MaxxedAbilityPerkNode('passthrough',     5, [7, 6]))
        .addRequirement(new PerkLevelRequirement('damage 6-4')),

    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }

  static GetDemoTurns() {
    return 5;
  }
}

AbilityCore.coreList[19] = AbilityCore19;
