class AbilityCore1008 extends AbilityCore {
  static BuildAbilityChild(level) {
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1));
    const rawAbil = {
      name: 'Rage',
      description: 'Creates a zone around you that lasts [[duration]] turns.<br>' +
        'Any projectile entering or leaving the zone becomes deals 20% extra damage.',
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
      action_phase: TurnPhasesEnum.PLAYER_PRE_MINOR,
    };

    let cooldown = this.getCooldown();
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    return AbilityDef.createFromJSON(rawAbil);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 5, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[1008] = AbilityCore1008;
