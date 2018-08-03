// TODO:
// [] Change the icon
// [] Change the style
class AbilityCore2006 extends AbilityCore {
  static BuildAbilityChild(level) {
    let distance = Unit.UNIT_SIZE * 5;
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 0.2));
    const rawAbil = {
      name: 'Slash',
      description: 'Dash forward <<' + distance + '>> units, and deal <<' + hitDamage + '>> damage to each unit you pass through.',
      card_text_description: 'Move',
      max_dist: distance,
      move_speed: 6,
      ability_type: AbilityDef.AbilityTypes.PLAYER_MOVE,
      hit_effects: [
        {
          base_damage: hitDamage,
          effect: ProjectileShape.HitEffects.DAMAGE,
        }
      ],
      icon: "/Bouncy/assets/icons/quick-slash.png"
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
    return null;
    return {initial_charge: -1, max_charge: 2, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }
}

AbilityCore.coreList[2006] = AbilityCore2006;
