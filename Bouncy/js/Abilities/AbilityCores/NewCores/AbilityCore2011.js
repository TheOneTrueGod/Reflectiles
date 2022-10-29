// TODO:
// [] Change the icon
// [] Change the cooldown
// [] Change the style
// [] Change the rawAbil
class AbilityCore2011 extends AbilityCore {
  static BuildAbilityChild(level) {
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1));
    let armourAmount = 3;
    const rawAbil = {
      name: "Armour Up",
      description: `All players gain ${armourAmount} armour`,
      card_text_description: `${armourAmount} Armour`,
      ability_type: AbilityDef.AbilityTypes.BUFF,
      target_restrictions: {
        hits_friendly_units: true,
      },
      hit_effects: [
        {
          effect: ProjectileShape.HitEffects.PLAYER_ARMOUR,
          duration: 1,
          effect_base: armourAmount,
        },
      ],
      icon: "/Bouncy/assets/icons/leather_armor.svg",
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
    return new AbilitySheetSpriteAbilityStyleBuilder()
      .setSheet("weapons_sheet")
      .setCoordNums(2, 1, 24, 23);
  }

  static getCooldown() {
    return {
      initial_charge: -1,
      max_charge: 2,
      charge_type: AbilityDef.CHARGE_TYPES.TURNS,
    };
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }
}

AbilityCore.coreList[2011] = AbilityCore2011;
