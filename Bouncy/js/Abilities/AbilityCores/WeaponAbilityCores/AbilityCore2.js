class AbilityCore2 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let damageMult = (1 + idx(perkPcts, 'damage', 0) * 3);
    let damage = Math.floor(50 * damageMult);

    const rawAbil = { // 1440 damage
      name: 'Double Wave',
      description: 'Sprays [[num_bullets]] in two waves.<br>' +
        'Each bullet deals [[hit_effects[0].base_damage]] damage.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(274, 68, 295, 79).setRotation(0).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.DOUBLE_WAVE,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      num_bullets: 36,
      return_num_bullets: 0,
      destroy_on_wall: true,
      icon: "/Bouncy/assets/icons/icon_plain_wave.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: damage,
      }],
      charge: {"initial_charge":-1, "max_charge": 5, "charge_type":"TURNS"},
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
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[2] = AbilityCore2;
