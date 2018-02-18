class AbilityCore10 extends AbilityCore {
  static BuildAbility(perkList) {
    const rawAbil = {
      name: 'Drill Shot',
      description: 'Shoots a projectile that passes through enemies.<br>' +
        'It deals [[hit_effects[0].base_damage]] damage to up to [[num_hits]] targets.',
      card_text_description: '[[num_hits]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(65, 301, 73, 320).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      collision_behaviours: [
        {behaviour: CollisionBehaviour.PASSTHROUGH, count: 6},
      ],
      num_hits: 7,
      icon: "/Bouncy/assets/icons/icon_plain_drill.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 150
      }],
      charge:{initial_charge: -1, max_charge: 3, charge_type: AbilityDef.CHARGE_TYPES.TURNS}
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

AbilityCore.coreList[10] = AbilityCore10;
