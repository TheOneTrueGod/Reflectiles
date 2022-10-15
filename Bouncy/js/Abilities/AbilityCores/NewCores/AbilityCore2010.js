// TODO:
// [] Change the style
// [] Change the rawAbil
class AbilityCore2010 extends AbilityCore {
  static BuildAbilityChild(level) {
    const rawAbil = {
      name: 'Taunt',
      description: `Cause all enemies to target you`,
      card_text_description: `TAUNT`,
      ability_type: AbilityDef.AbilityTypes.BUFF,
      hit_effects: [{
        effect: ProjectileShape.HitEffects.TAUNT,
        duration: 1,
      }],
      icon: "/Bouncy/assets/icons/skills_defender/taunt.png",
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
    return {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }
}

AbilityCore.coreList[2010] = AbilityCore2010;
