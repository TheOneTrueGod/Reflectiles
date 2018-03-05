class AbilityCore5 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let bullet_bonus = idx(perkCounts, 'num_bullets', 0);
    const rawAbil = {
      name: 'Spread Shot',
      description: 'Shoot [[num_bullets]] projectiles.<br>' +
        'Each one deals [[hit_effects[0].base_damage]] damage.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.TRI_SHOT,
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(275, 69, 294, 78).setRotation(0).build(),
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      num_bullets: 6 + bullet_bonus,
      hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 180}],
      icon: "/Bouncy/assets/icons/spread_shot.png",
    };
    return AbilityDef.createFromJSON(rawAbil);
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
