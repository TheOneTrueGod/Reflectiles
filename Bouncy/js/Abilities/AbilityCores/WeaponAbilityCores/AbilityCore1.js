class AbilityCore1 extends AbilityCore {
  static BuildAbility(perkList) {
    const rawAbil = { // 1200 max damage
      name: 'Shotgun',
      description: 'Fires a spray of [[num_bullets]] bullets, dealing [[hit_effects[0].base_damage]] damage.<br>These bullets will penetrate their targets.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(334, 70, 340, 76).setRotation(0).fixRotation(true).build(),
      destroy_on_wall: true,
      shape: ProjectileAbilityDef.Shapes.SPRAY_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.PENETRATE,
      destroy_on_wall: true,
      hit_effects: [{base_damage: 120, effect: ProjectileShape.HitEffects.DAMAGE}],
      num_bullets: 10,
      icon: "/Bouncy/assets/icons/shotgun.png",
      charge: {initial_charge: -1, max_charge: 2, charge_type: "TURNS"},
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

AbilityCore.coreList[1] = AbilityCore1;
