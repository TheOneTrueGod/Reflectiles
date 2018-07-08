class AbilityCore2003 extends AbilityCore {
  static BuildAbilityChild(level) {
    let coreDamage = Math.round(NumbersBalancer.getAbilityDamage(level, 0.1));
    let weaknessAmount = 1.5;
    let duration = 2;

    let weaknessDescription = Math.floor((weaknessAmount - 1) * 100);
    const rawAbil = {
      name: 'Weaken',
      description: 'Applies weakness to a single enemy for [[hit_effects[1].duration]] turns, increasing the damage they take by <<' + weaknessDescription + '>>%',
      card_text_description: 'weaken',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects:[{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: coreDamage,
      },
      {
        effect: ProjectileShape.HitEffects.WEAKNESS,
        duration: duration,
        amount: weaknessAmount,
      }],
      icon: "/Bouncy/assets/icons/icon_plain_hearts.png",
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
      .setSheet('bullet_sheet')
      .setCoordNums(263, 157, 263 + 11, 157 + 11);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 3, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }
}

AbilityCore.coreList[2003] = AbilityCore2003;
