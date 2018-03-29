class AbilityCore5 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let bullet_bonus = Math.round(lerp(0, 6, idx(perkPcts, 'num_bullets', 0)));
    const rawAbil1 = {
      name: 'Spread Shot',
      description: 'Shoot [[num_bullets]] projectiles.<br>' +
        'Each one deals [[hit_effects[0].base_damage]] damage.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.TRI_SHOT,
      style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setSheet('bullet_sheet').setCoordNums(275, 69, 294, 78).setRotation(0).build(),
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      num_bullets: 6 + bullet_bonus,
      hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 180}],
      icon: "/Bouncy/assets/icons/spread_shot.png",
    };

    let rawAbil2 = { // 2440 damage max.  Actually dealing less than that
      name: 'Shoot \'em up',
      description: 'Shoots a wild spray of bullets.<br>' +
        '[[num_bullets]] bullets deal [[hit_effects[0].base_damage]] damage',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setSheet('bullet_sheet').setCoordNums(29, 301, 37, 320).setRotation(Math.PI / 2).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: true,
      num_bullets: 25,
      bullet_wave_delay: 3,
      accuracy_decay: Math.PI / 128.0,
      icon: "/Bouncy/assets/icons/bullets.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 35
      },
      {
        effect: ProjectileShape.HitEffects.POISON,
        damage: 10,
        duration: 2
      }],
    };

    rawAbil1.timing_offset = MultipartAbilityDef.TIMING_OFFSET.AFTER;

    const rawAbil = {
      name: 'Multipart Test',
      description: 'do the thing',
      ability_type: AbilityDef.AbilityTypes.MULTIPART,
      card_text_description: 'test',
      child_abilities: [
        rawAbil2,
        rawAbil1
      ],
      icon: "/Bouncy/assets/icons/spread_shot.png",
    }
    return AbilityDef.createFromJSON(rawAbil1);
  }

  static GetPerkList() {
    let perkList = [
      (new AbilityPerkNode('damage',    20, [0, 0])),
      (new AbilityPerkNode('num_bullets',    20, [0, 0])),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.NEUTRAL;
  }
}

AbilityCore.coreList[5] = AbilityCore5;
