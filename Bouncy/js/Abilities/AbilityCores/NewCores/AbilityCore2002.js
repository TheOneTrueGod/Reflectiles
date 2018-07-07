class AbilityCore2002 extends AbilityCore {
  static BuildAbilityChild(level) {
    let coreDamage = Math.round(NumbersBalancer.getAbilityDamage(level, 0.1));
    let freezeDuration = 2;
    const rawAbil = {
      name: 'Freeze',
      description: 'Freezes a single enemy for <<' + freezeDuration + '>> turns.  It deals <<' + coreDamage + '>> damage.',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      style: {style_name: 'COLORIZED', color: 0x00f4ff},
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects: [
        {effect: ProjectileShape.HitEffects.DAMAGE, base_damage: coreDamage},
        {effect: ProjectileShape.HitEffects.FREEZE, duration: freezeDuration}
      ],
      icon: "/Bouncy/assets/icons/icon_plain_frost.png",
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
      .setCoordNums(28, 2, 50, 23)
      .setScale(0.75);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 3, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }
}

AbilityCore.coreList[2002] = AbilityCore2002;
