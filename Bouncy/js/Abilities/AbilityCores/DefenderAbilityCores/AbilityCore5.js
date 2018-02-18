class AbilityCore5 extends AbilityCore {
  static BuildAbility(perkList) {
    const rawAbil = {
      name: 'Spread Shot',
      description: 'Shoot [[num_bullets]] projectiles.<br>' +
        'Each one deals [[hit_effects[0].base_damage]] damage.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: "TRI_SHOT",
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(275, 69, 294, 78).setRotation(0).build(),
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      num_bullets: 5,
      hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 180}],
      icon: "/Bouncy/assets/icons/spread_shot.png",
    };
    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetPerkList() {
    let perkList = [
      (new AbilityPerkNode('damage',    20, [0, 0])),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }
}

AbilityCore.coreList[5] = AbilityCore5;
