class AbilityCore16 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let totalDamage = lerp(1800, 10000,
      (
        idx(perkPcts, 'damage 1-1', 0) * 2 +
        idx(perkPcts, 'damage 1-2', 0) * 2 +
        idx(perkPcts, 'damage 5', 0) * 2 +
        idx(perkPcts, 'damage 4', 0) * 2 +
        idx(perkPcts, 'damage 3', 0) * 2 +
        idx(perkPcts, 'damage 2', 0) * 3 +
        idx(perkPcts, 'damage 3-1', 0) * 2 +
        idx(perkPcts, 'more shards 1-1', 0) +
        idx(perkPcts, 'more shards 1-2', 0) +
        idx(perkPcts, 'more shards 2', 0) +
        idx(perkPcts, 'more shards 3', 0) +
        idx(perkPcts, 'more shards 4', 0)
      ) / 20
    );
    let num_bullets = Math.floor(lerp(10, 25,
      (
        idx(perkPcts, 'more shards 1-1', 0) +
        idx(perkPcts, 'more shards 1-2', 0) +
        idx(perkPcts, 'more shards 2', 0) +
        idx(perkPcts, 'more shards 3', 0) +
        idx(perkPcts, 'more shards 4', 0)
      ) / 5
    ));
    let shotDamage = Math.floor(totalDamage / num_bullets);
    let curve_def = null;
    if (this.hasPerk(perkPcts, 'curving shards')) {
      curve_def = {
        curve_type: ProjectileCurveHandler.CURVE_TYPES.CONSTANT_CURVE,
        curve_amount: Math.PI / 32.0,
        curve_time: 32,
      };
    }

    let hit_effects = [];

    hit_effects.push(
      {
        effect: ProjectileShape.HitEffects.INFECT,
        duration: 2 + this.hasPerk(perkPcts, 'duration up'),
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
          projectile_type: ProjectileShape.ProjectileTypes.PENETRATE,
          curve_def,
          //bullet_speed: 6,
          speed: 8,
          num_bullets,
          gravity: {x: 0, y: 0},
          hit_effects: [{
            effect: ProjectileShape.HitEffects.DAMAGE,
            base_damage: shotDamage
          }],
        }
      }
    );
    if (this.hasPerk(perkPcts, 'impact damage')) {
      hit_effects.push({
        base_damage: lerp(totalDamage / 100, totalDamage / 50, idx(perkPcts, 'more impact damage')),
        effect: ProjectileShape.HitEffects.DAMAGE,
      });
    }

    if (this.hasPerk(perkPcts, 'apply poison')) {
      hit_effects.push({
        effect: ProjectileShape.HitEffects.APPLY_DOT_TICK,
        amount: 1
      });
    }


    const rawAbil = { // 3000 damage max
      name: 'Infect',
      description: 'Shoots a projectile that hits a single enemy.<br>' +
        'That enemy is infected.  If they die in the next [[hit_effects[0].duration]] ' +
        'turns, they explode into [[hit_effects[0].abil_def.num_bullets]] bullets, ' +
        'each one dealing [[hit_effects[0].abil_def.hit_effects[0].base_damage]] damage',
      card_text_description: '[[hit_effects[0].abil_def.num_bullets]] X [[hit_effects[0].abil_def.hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setSheet('bullet_sheet').setCoordNums(393, 157, 406, 171).setRotation(0).fixRotation(true).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects,
      icon: "/Bouncy/assets/icons/nuclear.png",
      charge: this.getCooldown(perkList, perkPcts)
    };
    return AbilityDef.createFromJSON(rawAbil);
  }

  static getCooldown(perkList, perkPcts) {
    let perkCount = perkList.length;
    let cooldown = perkCount * 0.1 + 2;
    cooldown -= idx(perkPcts, 'cooldown', 0) * 4.2;
    cooldown -= idx(perkPcts, 'cooldown 2', 0) * 4.2;

    cooldown = Math.round(cooldown);
    if (cooldown <= 1) {
      return null;
    }

    return {initial_charge: -1, max_charge: cooldown, charge_type: "TURNS"};
  }

  static GetPerkList() {
    let perkList = [
      // Side Tree
      (new AbilityPerkNode('damage 1-1',                 5, [0, 5])),
      (new AbilityPerkNode('damage 1-2',                 5, [1, 4]))
        .addRequirement(new PerkLevelRequirement('damage 1-1')),
      (new AbilityPerkNode('more shards 1-1',            5, [1, 6]))
        .addRequirement(new PerkLevelRequirement('damage 1-1')),
      (new AbilityPerkNode('more shards 1-2',            5, [2, 5]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('damage 1-2'),
          new PerkLevelRequirement('more shards 1-1')
        ])),

      // Starting section
      (new AbilityPerkNode('more shards 4',               5, [1, 2])),
      (new AbilityPerkNode('damage 5',                    5, [2, 1])),
      (new AbilityPerkNode('cooldown 2',                  5, [2, 3]))
        .addRequirement(new PerkLevelRequirement('more shards 4')),

      // Connecting branches
      (new AbilityPerkNode('more shards 3',               5, [3, 2]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('cooldown 2'),
          new PerkLevelRequirement('damage 5')
        ])),
      (new AbilityPerkNode('damage 4',                    5, [3, 4]))
        .addRequirement(new PerkLevelRequirement('cooldown 2')),
      (new AbilityPerkNode('damage 3',                    5, [4, 3]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('more shards 3'),
          new PerkLevelRequirement('damage 4')
        ])),
      (new MaxxedAbilityPerkNode('curving shards',              3, [4, 5]))
        .addRequirement(new PerkLevelRequirement('damage 4')),
      (new AbilityPerkNode('cooldown',                    5, [5, 6]))
        .addRequirement(new PerkLevelRequirement('curving shards')),

      // Apply poison branch
      (new MaxxedAbilityPerkNode('apply poison',              6, [5, 4]))
        .addRequirement(new PerkLevelRequirement('damage 3')),
      (new AbilityPerkNode('damage 2',              6, [6, 3]))
        .addRequirement(new PerkLevelRequirement('apply poison', 'max')),
      (new AbilityPerkNode('more shards 2',              6, [6, 5]))
        .addRequirement(new PerkLevelRequirement('apply poison', 'max')),

      // Impact damage branch
      (new MaxxedAbilityPerkNode('impact damage',       6, [4, 1]))
        .addRequirement(new PerkLevelRequirement('more shards 3')),
      (new AbilityPerkNode('more impact damage',        6, [5, 0]))
        .addRequirement(new PerkLevelRequirement('impact damage', 'max'))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('duration up', 1))),
      (new MaxxedAbilityPerkNode('duration up',                6, [5, 2]))
        .addRequirement(new PerkLevelRequirement('impact damage', 'max'))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('more impact damage', 1))),
      (new AbilityPerkNode('damage 3-1',          6, [6, 1]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('duration up', 'max'),
          new PerkLevelRequirement('more impact damage', 'max')
        ])),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }
}

AbilityCore.coreList[16] = AbilityCore16;
