// TODO:
// [] Change the weapon type
// [] Change the icon
// [] Change the cooldown
// [] Change the style
// [] Change the rawAbil
class AbilityCore9000 extends AbilityCore {
  static BuildAbilityChild(level) {
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1));
    const rawAbil = {
      name: 'Quick Dash',
      description: 'Move quickly, before attacking.',
      card_text_description: 'Quick Dash',
      ability_type: AbilityDef.AbilityTypes.PLAYER_MOVE,
      action_phase: TurnPhasesEnum.PLAYER_PRE_MINOR,
      max_dist: Unit.UNIT_SIZE * 2,
      collides_with_enemies: false,
      move_speed: 4,
      icon: "/Bouncy/assets/icons/dodging.png"
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
    return {initial_charge: -1, max_charge: 5, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.NEUTRAL;
  }
}

AbilityCore.coreList[9000] = AbilityCore9000;
