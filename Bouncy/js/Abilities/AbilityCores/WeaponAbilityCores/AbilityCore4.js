class AbilityCore4 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    const rawAbil = {
      name: 'Rage',
      description: 'Creates a zone around you that lasts [[duration]] turns.<br>' +
        'Any projectile entering or leaving the zone becomes Powerful, dealing 20% extra damage.',
      card_text_description: '+20%',
      zone_tooltip_name: 'Rage',
      zone_tooltip_description: 'Any projectile entering or leaving this zone becomes Powerful, dealing 20% extra damage.',
      ability_type: AbilityDef.AbilityTypes.ZONE,
      projectile_interaction: {
        player_projectiles: {
          buff: {type: Projectile.BuffTypes.DAMAGE},
          force_passthrough: true,
        },
      },
      unit_interaction: { prevent_unit_entry: false },
      duration: 3,
      zone_size: {left: 1, right:1, top:1, bottom:1, y_range: 0},
      max_range: {left: 0, right: 0, top: 0, bottom: 0},
      icon: "/Bouncy/assets/icons/icon_strong.png",
      charge: {initial_charge: -1, max_charge: 5, charge_type: "TURNS"},
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

AbilityCore.coreList[4] = AbilityCore4;
