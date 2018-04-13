// No starting radius
// Two AoE paths
 // Explosion
  // Increase radius to 3x3 in plus sign
  // Increase radius to 3x3
  // Increase radius to 5x3 in plus sign
  // Increase radius to 5x3
 // Spread shot drill
  // Increase number of bullets to 3, 4, 5
  // Bullets penetrate once, twice.
// Increase weakness amount increase
// Add minor poison damage
// Increase damage
// Increase duration
// If an enemy affected by weakness dies, apply its weakness to enemies around it.
class AbilityCore9 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let damage = lerp(
      100,
      1000,
      (
        idx(perkPcts, 'damage 1-1', 0) +
        idx(perkPcts, 'damage 1-2', 0) +
        idx(perkPcts, 'damage 4', 0) +
        idx(perkPcts, 'damage 5-1', 0) +
        idx(perkPcts, 'damage 5-2', 0)
      ) / 4 // 1-1 and 1-2 are mutex
    );

    let weaknessAmount = lerp(
      1.5,
      2,
      (
        idx(perkPcts, 'weakness amount 1', 0) +
        idx(perkPcts, 'weakness amount 2-1', 0) * 2 +
        idx(perkPcts, 'weakness amount 2-2', 0) * 2 +
        idx(perkPcts, 'weakness amount 7', 0) * 3
      ) / 8
    );

    let duration = 2 + this.hasPerk(perkPcts, 'duration 3') - this.hasPerk(perkPcts, 'spreading affliction');
    let weaknessDescription = Math.floor((weaknessAmount - 1) * 100);
    const rawAbil = {
      name: 'Weaken',
      description: 'Applies weakness to each enemy hit for [[hit_effects[1].duration]] turns, increasing the damage they take by <<' + weaknessDescription + '>>%',
      card_text_description: 'weaken',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects:[{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: damage,
      },
      {
        effect: ProjectileShape.HitEffects.WEAKNESS,
        duration: duration,
        amount: weaknessAmount,
      }],
      icon: "/Bouncy/assets/icons/icon_plain_hearts.png",
      charge: {"initial_charge":-1,"max_charge":3,"charge_type":"TURNS"}
    };

    if (this.hasPerk(perkPcts, 'spreading affliction')) {
      rawAbil.hit_effects.push({
        effect: ProjectileShape.HitEffects.INFECT,
        duration: duration,
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          projectile_type: 1,
          shape: ProjectileAbilityDef.Shapes.INSTANT_AOE,
          hit_effects: [{
            effect: ProjectileShape.HitEffects.WEAKNESS,
            duration: duration,
            amount: weaknessAmount,
            aoe_type: ProjectileShape.AOE_TYPES.BOX,
            aoe_size: {x:[-1, 1], y:[-1, 1]}
          }],
        }
      });

      rawAbil.description = rawAbil.description + "<br>If a unit afflicted by this skill dies, all adjacent units are Weakened for [[hit_effects[2].duration]] turns.";
    }

    let abilityStyle = (new AbilitySheetSpriteAbilityStyleBuilder())
      .setSheet('bullet_sheet')
      .setCoordNums(263, 157, 263 + 11, 157 + 11);

    if (this.hasPerk(perkPcts, 'exploding 0')) {
      let aoeType = ProjectileShape.AOE_TYPES.CIRCLE;
      let aoeRadius = lerp(
        Unit.UNIT_SIZE,
        Unit.UNIT_SIZE * 3,
        (
          idx(perkPcts, 'radius 1', 0) +
          idx(perkPcts, 'radius 2', 0) +
          idx(perkPcts, 'radius 3', 0) +
          idx(perkPcts, 'radius 4', 0) +
          idx(perkPcts, 'radius 5', 0) +
          idx(perkPcts, 'radius 7-1', 0) * 2 +
          idx(perkPcts, 'radius 7-2', 0) * 2
        ) / 9
      );

      rawAbil.hit_effects[0].base_damage = Math.round(
          damage / (1 + aoeRadius / Unit.UNIT_SIZE)
        );

      aoeRadius = Math.round(aoeRadius);
      rawAbil.hit_effects[0].aoe_type = aoeType;
      rawAbil.hit_effects[0].aoe_size = aoeRadius;
      rawAbil.hit_effects[1].aoe_type = aoeType;
      rawAbil.hit_effects[1].aoe_size = aoeRadius;

      if (rawAbil.hit_effects[2]) {
        rawAbil.hit_effects[2].aoe_type = aoeType;
        rawAbil.hit_effects[2].aoe_size = aoeRadius;
      }

      abilityStyle.setExplosion(AbilityStyle.getExplosionPrefab(
          AbilityStyle.EXPLOSION_PREFABS.WHITE, aoeRadius
        ));

        rawAbil.description = 'Deals [[hit_effects[0].base_damage]] damage to each enemy in a [[hit_effects[0].aoe_size]] radius.<br>' +
          rawAbil.description;
    } else if (this.hasPerk(perkPcts, 'piercing 0')) {
      rawAbil.shape = ProjectileAbilityDef.Shapes.TRI_SHOT;
      let num_bullets = 1 +
        (this.hasPerk(perkPcts, 'num shots 1') ? 1 : 0) +
        (this.hasPerk(perkPcts, 'num shots 3') ? 1 : 0) +
        (this.hasPerk(perkPcts, 'num shots 4') ? 1 : 0) +
        (this.hasPerk(perkPcts, 'num shots 7') ? 1 : 0)
        ;
      rawAbil.num_bullets = num_bullets;

      let pierceCount = 1 +
        (this.hasPerk(perkPcts, 'pierce 2')) +
        (this.hasPerk(perkPcts, 'pierce 5')) +
        (this.hasPerk(perkPcts, 'pierce 7'));

      rawAbil.collision_behaviours = [
        {
          behaviour: CollisionBehaviour.PASSTHROUGH,
          count: pierceCount
        }];

      rawAbil.hit_effects[0].base_damage = Math.round(
        damage / (1 +
          lerp(0, 1, (num_bullets - 1) / 4) +
          lerp(0, 1, (pierceCount - 1) / 3)
        )
      );

      rawAbil.description = 'Shoots ' +
        (num_bullets > 1 ? '<<' + num_bullets + '>> projectiles' : 'a projectile') +
        ' that pierces <<' + pierceCount + '>> time' + (pierceCount > 1 ? 's' : '') + ', dealing [[hit_effects[0].base_damage]] damage.<br>' +
        rawAbil.description;
    } else {
      rawAbil.description = 'Deals [[hit_effects[0].base_damage]] damage.<br>' +
        rawAbil.description;
    }

    rawAbil.style = abilityStyle.build();

    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetPerkList() {
    let perkList = [
      // Level 0
      (new MaxxedAbilityPerkNode('exploding 0',    1, [0, 0]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('piercing 0', 1))),
      (new MaxxedAbilityPerkNode('piercing 0',    1, [0, 6]))
        .addRequirement(new NotPerkLevelRequirement(new PerkLevelRequirement('exploding 0', 1))),
      // Level 1
      (new AbilityPerkNode('radius 1',    3, [1, 0]))
        .addRequirement(new PerkLevelRequirement('exploding 0')),
      (new AbilityPerkNode('damage 1-1',    5, [1, 1]))
        .addRequirement(new PerkLevelRequirement('exploding 0')),
      (new AbilityPerkNode('weakness amount 1',    3, [1, 3])),
      (new AbilityPerkNode('damage 1-2',    5, [1, 5]))
        .addRequirement(new PerkLevelRequirement('piercing 0')),
      (new MaxxedAbilityPerkNode('num shots 1',    3, [1, 6]))
        .addRequirement(new PerkLevelRequirement('piercing 0')),
      // Level 2
      (new AbilityPerkNode('radius 2',    2, [2, 1]))
        .addRequirement(new PerkLevelRequirement('exploding 0')),
      (new AbilityPerkNode('weakness amount 2-1',    6, [2, 2]))
        .addRequirement(new PerkLevelRequirement('weakness amount 1')),
      (new AbilityPerkNode('weakness amount 2-2',    6, [2, 4]))
        .addRequirement(new PerkLevelRequirement('weakness amount 1')),
      (new MaxxedAbilityPerkNode('pierce 2',    2, [2, 5]))
        .addRequirement(new PerkLevelRequirement('num shots 1')),
      // Level 3
      (new AbilityPerkNode('radius 3',    4, [3, 0]))
        .addRequirement(new PerkLevelRequirement('radius 1')),
      (new MaxxedAbilityPerkNode('duration 3',     5, [3, 3]))
        .addRequirement(new PerkLevelRequirement('weakness amount 1')),
      (new MaxxedAbilityPerkNode('num shots 3',    4, [3, 6]))
        .addRequirement(new PerkLevelRequirement('num shots 1')),
      // Level 4
      (new AbilityPerkNode('radius 4',    2, [4, 1]))
        .addRequirement(new PerkLevelRequirement('radius 3')),
      (new AbilityPerkNode('damage 4',          5, [4, 3]))
        .addRequirement(new PerkLevelRequirement('duration 3')),
      (new MaxxedAbilityPerkNode('num shots 4',    2, [4, 5]))
        .addRequirement(new PerkLevelRequirement('num shots 3')),
      // Level 5
      (new AbilityPerkNode('radius 5',    4, [5, 0]))
        .addRequirement(new PerkLevelRequirement('radius 3')),
      (new AbilityPerkNode('damage 5-1',          5, [5, 2]))
        .addRequirement(new PerkLevelRequirement('damage 4')),
      (new AbilityPerkNode('damage 5-2',          5, [5, 4]))
        .addRequirement(new PerkLevelRequirement('damage 4')),
      (new MaxxedAbilityPerkNode('pierce 5',    4, [5, 6]))
        .addRequirement(new PerkLevelRequirement('num shots 3')),
      // Level 6
      (new MaxxedAbilityPerkNode('spreading affliction',    6, [6, 3]))
        .addRequirement(new PerkLevelRequirement('damage 4'))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('radius 5'),
          new PerkLevelRequirement('pierce 5')]
        )),
      // Level 7
      (new AbilityPerkNode('radius 7-1',    5, [7, 0]))
        .addRequirement(new PerkLevelRequirement('radius 5')),
      (new AbilityPerkNode('radius 7-2',    5, [7, 1]))
        .addRequirement(new PerkLevelRequirement('radius 5')),
      (new AbilityPerkNode('weakness amount 7',    9, [7, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('radius 5'),
          new PerkLevelRequirement('pierce 5')]
        )),
      (new MaxxedAbilityPerkNode('pierce 7',    5, [7, 5]))
        .addRequirement(new PerkLevelRequirement('pierce 5')),
      (new MaxxedAbilityPerkNode('num shots 7',    5, [7, 6]))
        .addRequirement(new PerkLevelRequirement('pierce 5')),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }

  static GetDemoTimesToUse() {
    return 2;
  }
}

AbilityCore.coreList[9] = AbilityCore9;
