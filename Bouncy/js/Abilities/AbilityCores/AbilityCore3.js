class AbilityCore3 extends AbilityCore {
  static BuildAbility(perkList) {
    const rawAbil = { // 2250 max damage.
      name: 'Rain',
      description: 'Make it rain.<br>Fires [[num_bullets]] projectiles.<br>' +
        'Each one deals [[hit_effects[0].base_damage]] damage, and then splits into [[hit_effects[1].num_bullets]] projectiles that deal [[hit_effects[1].hit_effects[0].base_damage]] damage.<br>' +
        'Can\'t be aimed.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(37, 159, 44, 166).setRotation(0).fixRotation(true).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.RAIN,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: true,
      hit_effects: [
        {effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 20},
        {
          effect: ProjectileShape.HitEffects.BULLET_SPLIT,
          style: (new AbilitySheetSpriteAbilityStyleBuilder)
            .setSheet('bullet_sheet').setCoordNums(19, 159, 24, 166).setRotation(0).fixRotation(true).build(),
          projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
          hit_effects: [{
            effect:ProjectileShape.HitEffects.DAMAGE,
            base_damage: 5,
          }],
          num_bullets: 2
        }
      ],
      num_bullets: 50,
      icon: "/Bouncy/assets/icons/icon_plain_rain.png",
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

AbilityCore.coreList[3] = AbilityCore3;
