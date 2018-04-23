class AbilityCore25 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    const rawAbil = {
      name: 'Molotov',
      description: 'Throws a molotov that explodes into a fireball.<br>' +
        'It explodes dealing [[timeout_effects[0].abil_def.hit_effects[0].base_damage]] damage.<br>' +
        'The fire lingers for [[timeout_effects[1].abil_def.duration]] turns, dealing ' +
        '[[timeout_effects[1].abil_def.phase_effects[0].abil_def.hit_effects[0].base_damage]] ' +
        'damage per turn',
      card_text_description: '[[timeout_effects[0].abil_def.hit_effects[0].base_damage]]',
      charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
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
    return CardDeckTypes.ENGINEER;
  }
}

AbilityCore.coreList[25] = AbilityCore25;
