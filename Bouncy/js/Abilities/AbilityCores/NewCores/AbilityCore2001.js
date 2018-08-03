class AbilityCore2001 extends AbilityCore {
  static BuildAbilityChild(level) {
    let health = 6;
    const rawAbil = {
      name: 'Shield',
      description: 'Puts up a shield with [[duration]] health.<br>' +
        'It loses one health per turn, or when it defends.<br>',
      card_text_description: '[[duration]]',
      zone_tooltip_name: 'Shield',
      zone_tooltip_description: 'Protects from bullets and prevents units from entering.',
      ability_type: AbilityDef.AbilityTypes.ZONE,
      unit_interaction: {
        prevent_unit_entry: true,
      },
      projectile_interaction: {enemy_projectiles: {destroy: true}},
      duration: health,
      zone_size: {
        left: 1, right: 1,
        top: 0, bottom: 0, y_range: 0
      },
      max_range: {
        left: 4,
        right: 4,
        top: 1, bottom: 1
      },
      unit_enter_effect: {},
      zone_icon: 'zone_icon_shield',
      icon: "/Bouncy/assets/icons/icon_plain_shield.png",
      action_phase: TurnPhasesEnum.PLAYER_MINOR,
    };

    let cooldown = this.getCooldown();
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    rawAbil.style = this.createAbilityStyle().build();
    return AbilityDef.createFromJSON(rawAbil);
  }

  static createAbilityStyle() {
    return (new AbilitySheetSpriteAbilityStyleBuilder())
      .setSheet('weapons_sheet')
      .setCoordNums(2, 1, 24, 23);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 4, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }
}

AbilityCore.coreList[2001] = AbilityCore2001;
