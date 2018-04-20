class AbilityCore14 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let smallWaveDamage = [100, 1000];
    let mainWaveDamage = [750, 4000];

    let child_abilities = [];
    let description = "";
    if (this.hasPerk(perkPcts, 'another wave 1')) {
      let damageType =  Unit.DAMAGE_TYPE.NORMAL;
      let totalDamage = Math.round(lerp(smallWaveDamage[0], smallWaveDamage[1], (
        idx(perkPcts, 'more damage 1-1', 0) * 5 +
        idx(perkPcts, 'more damage 1-2', 0) * 5 +
        idx(perkPcts, 'damage 3', 0) +
        idx(perkPcts, 'damage 3-2', 0) +
        idx(perkPcts, 'damage 3-3', 0) +
        idx(perkPcts, 'damage 3-4', 0) +
        idx(perkPcts, 'more shots 1-1', 0) +
        idx(perkPcts, 'more shots 1-2', 0)
      ) / 16));

      let num_bullets = Math.floor(lerp(10, 20, (
        idx(perkPcts, 'more shots 1-1', 0) +
        idx(perkPcts, 'more shots 1-2', 0)
      ) / 2));
      let shotDamage = Math.round(totalDamage / num_bullets);
      let weakenAmount = 1.1 + idx(perkPcts, 'stronger weaken', 0) * 0.1;

      description += "Shoot a wave of <<" + num_bullets + ">> ";
      description += " shots that deal <<" + shotDamage + ">> ";
      if (this.hasPerk(perkPcts, 'lightning damage')) {
        damageType =  Unit.DAMAGE_TYPE.LIGHTNING;
        description += "<<Lightning>> ";
      }
      description += "damage";
      let hit_effects = [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: shotDamage,
        damage_type: damageType,
      }];
      let spriteSheetY = 68;
      if (this.hasPerk(perkPcts, 'weaken 1-1')) {
        spriteSheetY = 48;
        hit_effects.push(
          {
            effect: ProjectileShape.HitEffects.WEAKNESS,
            duration: 1,
            amount: weakenAmount,
          }
        );
        description += " and <<Weaken>> their targets, causing them to take <<" + Math.floor((weakenAmount - 1) * 100) + ">>% extra damage this turn";
      }
      description += ".<br>";
      child_abilities.push({
        style: (new AbilitySheetSpriteAbilityStyleBuilder)
          .setSheet('bullet_sheet')
          .setCoordNums(274, spriteSheetY, 295, spriteSheetY + 11)
          .setRotation(0)
          .build(),
        ability_type: AbilityDef.AbilityTypes.PROJECTILE,
        shape: ProjectileAbilityDef.Shapes.WAVE,
        projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
        destroy_on_wall: [],
        collision_behaviours: [],
        angle_spread: Math.PI / 2.5,
        num_bullets: Math.ceil(num_bullets / 2),
        return_num_bullets: Math.floor(num_bullets / 2),
        return_shot_delay: 3,
        hit_effects,
      });
    }

    if (this.hasPerk(perkPcts, 'another wave 2')) {
      let damageType =  Unit.DAMAGE_TYPE.NORMAL;
      let totalDamage = Math.round(lerp(smallWaveDamage[0], smallWaveDamage[1], (
        idx(perkPcts, 'more damage 2-1', 0) * 5 +
        idx(perkPcts, 'more damage 2-2', 0) * 5 +
        idx(perkPcts, 'damage 3', 0) +
        idx(perkPcts, 'damage 3-2', 0) +
        idx(perkPcts, 'damage 3-3', 0) +
        idx(perkPcts, 'damage 3-4', 0) +
        idx(perkPcts, 'more shots 2-1', 0) +
        idx(perkPcts, 'more shots 2-2', 0)
      ) / 16));

      let num_bullets = Math.floor(lerp(10, 20, (
        idx(perkPcts, 'more shots 2-1', 0) +
        idx(perkPcts, 'more shots 2-2', 0)
      ) / 2));
      let shotDamage = Math.round(totalDamage / num_bullets);
      let poisonDamage = Math.floor((0.2 + idx(perkPcts, 'stronger poison', 0) * 0.2) * shotDamage);

      description += "Shoot a wave of <<" + num_bullets + ">> ";
      description += " shots that deal <<" + shotDamage + ">> ";
      let spriteSheetY = 68;
      if (this.hasPerk(perkPcts, 'corrosive damage')) {
        spriteSheetY = 28;
        damageType =  Unit.DAMAGE_TYPE.CORROSIVE;
        description += "<<Corrosive>> ";
      }
      description += "damage";
      let hit_effects = [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: shotDamage,
        damage_type: damageType,
      }];

      if (this.hasPerk(perkPcts, 'poison 2-1')) {
        spriteSheetY = 28;
        hit_effects.push(
          {
            effect: ProjectileShape.HitEffects.POISON,
            damage: poisonDamage,
            duration: 1
          }
        );
        description += " and <<Poison>> their targets, causing them to take <<" + poisonDamage + ">> damage at the end of this turn";
      }
      description += ".<br>";
      child_abilities.push({
        style: (new AbilitySheetSpriteAbilityStyleBuilder)
          .setSheet('bullet_sheet')
          .setCoordNums(274, spriteSheetY, 295, spriteSheetY + 11)
          .setRotation(0).build(),
        ability_type: AbilityDef.AbilityTypes.PROJECTILE,
        shape: ProjectileAbilityDef.Shapes.WAVE,
        projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
        destroy_on_wall: [],
        collision_behaviours: [],
        angle_spread: Math.PI / 2.5,
        num_bullets: Math.ceil(num_bullets / 2),
        return_num_bullets: Math.floor(num_bullets / 2),
        return_shot_delay: 3,
        hit_effects,
        timing_offset: child_abilities.length > 0 ? MultipartAbilityDef.TIMING_OFFSET.AFTER : null,
      });
    }

    // Final wave
    let num_bullets = Math.floor(lerp(20, 30,
      (idx(perkPcts, 'more shots 3-1', 0) + idx(perkPcts, 'more shots 3-2', 0)) / 2
    ));
    let return_num_bullets = Math.floor(lerp(5, 7, idx(perkPcts, 'more return shots', 0)));
    let shotDamage = Math.round(lerp(mainWaveDamage[0], mainWaveDamage[1],
      (
        idx(perkPcts, 'damage 3', 0) * 5 +
        idx(perkPcts, 'damage 3-2', 0) * 5 +
        idx(perkPcts, 'damage 3-3', 0) * 5 +
        idx(perkPcts, 'damage 3-4', 0) * 5 +
        idx(perkPcts, 'more shots 3-1', 0) * 2 +
        idx(perkPcts, 'more shots 3-2', 0) * 2 +
        idx(perkPcts, 'more return shots', 0) * 2 +
        idx(perkPcts, 'more damage 1-1', 0) +
        idx(perkPcts, 'more damage 1-2', 0) +
        idx(perkPcts, 'more damage 2-1', 0) +
        idx(perkPcts, 'more damage 2-2', 0)
      ) / 30
    ) / (num_bullets + return_num_bullets));

    description += "Shoot a wave of <<" + (num_bullets + return_num_bullets) + ">> ";
    description += " shots that deal <<" + shotDamage + ">> ";
    let spriteSheetY = 68;
    let damageType = Unit.DAMAGE_TYPE.NORMAL;
    if (this.hasPerk(perkPcts, 'fire damage')) {
      spriteSheetY = 8;
      damageType = Unit.DAMAGE_TYPE.FIRE;
      description += "<<Fire>> ";
    }

    description += "damage."

    child_abilities.push({
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet')
        .setCoordNums(274, spriteSheetY, 295, spriteSheetY + 11)
        .setRotation(0)
        .build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.WAVE,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [],
      collision_behaviours: [
        {behaviour: CollisionBehaviour.BOUNCE, count: 1},
      ],
      angle_spread: Math.PI / 2.5,
      num_bullets,
      return_num_bullets,
      return_shot_delay: 15,
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: shotDamage,
        damage_type: damageType,
      }],
      timing_offset: child_abilities.length > 0 ? MultipartAbilityDef.TIMING_OFFSET.AFTER : null,
    });

    const rawAbil = {
      name: 'The Sprinkler',
      description,
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.MULTIPART,
      child_abilities,
      icon: "/Bouncy/assets/icons/icon_plain_wave.png",
      charge:{initial_charge: -1, max_charge: 4, charge_type: AbilityDef.CHARGE_TYPES.TURNS}
    };
    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetPerkList() {
    let perkList = [
      (new MaxxedAbilityPerkNode('another wave 1',          3, [0, 1])),
      (new AbilityPerkNode('more shots 1-1',                5, [1, 0]))
        .addRequirement(new PerkLevelRequirement('another wave 1')),
      (new AbilityPerkNode('more damage 1-1',               5, [2, 1]))
        .addRequirement(new PerkLevelRequirement('another wave 1')),
      (new AbilityPerkNode('more shots 1-2',                5, [3, 2]))
        .addRequirement(new PerkLevelRequirement('more damage 1-1')),
      (new MaxxedAbilityPerkNode('weaken 1-1',              3, [4, 1]))
        .addRequirement(new PerkLevelRequirement('more damage 1-1')),
      (new AbilityPerkNode('stronger weaken',         3, [5, 0]))
        .addRequirement(new PerkLevelRequirement('weaken 1-1')),
      (new AbilityPerkNode('more damage 1-2',        5, [6, 1]))
        .addRequirement(new PerkLevelRequirement('weaken 1-1')),
      (new MaxxedAbilityPerkNode('lightning damage',        3, [7, 1]))
        .addRequirement(new PerkLevelRequirement('more damage 1-2')),
      // Tree 2
      (new MaxxedAbilityPerkNode('another wave 2',          3, [0, 3])),
      (new AbilityPerkNode('more shots 2-1',                5, [1, 2]))
        .addRequirement(new PerkLevelRequirement('another wave 2')),
      (new AbilityPerkNode('more damage 2-1',               5, [2, 3]))
        .addRequirement(new PerkLevelRequirement('another wave 2')),
      (new AbilityPerkNode('more shots 2-2',                5, [3, 4]))
        .addRequirement(new PerkLevelRequirement('more damage 2-1')),
      (new MaxxedAbilityPerkNode('poison 2-1',              3, [4, 3]))
        .addRequirement(new PerkLevelRequirement('more damage 2-1')),
      (new AbilityPerkNode('stronger poison',         3, [5, 2]))
        .addRequirement(new PerkLevelRequirement('poison 2-1')),
      (new AbilityPerkNode('more damage 2-2',        5, [6, 3]))
        .addRequirement(new PerkLevelRequirement('poison 2-1')),
      (new MaxxedAbilityPerkNode('corrosive damage',        3, [7, 3]))
        .addRequirement(new PerkLevelRequirement('more damage 2-2')),
      // Tree 4
      (new MaxxedAbilityPerkNode('final wave',        0, [0, 5])),
      (new AbilityPerkNode('damage 3',      10, [1, 4]))
        .addRequirement(new PerkLevelRequirement('final wave')),
      (new AbilityPerkNode('more shots 3-1',    10, [1, 6]))
        .addRequirement(new PerkLevelRequirement('final wave')),
      (new AbilityPerkNode('more shots 3-2',    5, [2, 5]))
        .addRequirement(new PerkLevelRequirement('final wave')),
      (new AbilityPerkNode('damage 3-2',              5, [4, 5]))
        .addRequirement(new PerkLevelRequirement('more shots 3-2')),
      (new AbilityPerkNode('damage 3-3',              5, [6, 4]))
        .addRequirement(new PerkLevelRequirement('damage 3-2')),
      (new AbilityPerkNode('damage 3-4',              5, [6, 6]))
        .addRequirement(new PerkLevelRequirement('damage 3-2')),
      (new MaxxedAbilityPerkNode('fire damage',          3, [7, 4]))
        .addRequirement(new PerkLevelRequirement('damage 3-3')),
      (new AbilityPerkNode('more return shots',              5, [7, 6]))
        .addRequirement(new PerkLevelRequirement('damage 3-4')),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.CHAOS;
  }
}

AbilityCore.coreList[14] = AbilityCore14;
