class AbilityCore14 extends AbilityCore {
  static BuildAbility(perkList) {
    const rawAbil = {
      name: 'The Sprinkler',
      description: 'Sprays [[num_bullets]] in a wave, then another [[return_num_bullets]] coming back.<br>' +
        'Each bullet deals [[hit_effects[0].base_damage]] damage, and bounces once.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(274, 68, 295, 79).setRotation(0).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.WAVE,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [],
      collision_behaviours: [
        {behaviour: CollisionBehaviour.BOUNCE, count: 1},
      ],
      num_bullets: 20,
      return_num_bullets: 5,
      icon: "/Bouncy/assets/icons/icon_plain_wave.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 30
      }],
      charge:{initial_charge: -1, max_charge: 4, charge_type: AbilityDef.CHARGE_TYPES.TURNS}
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
    return CardDeckTypes.CHAOS;
  }
}

AbilityCore.coreList[14] = AbilityCore14;
