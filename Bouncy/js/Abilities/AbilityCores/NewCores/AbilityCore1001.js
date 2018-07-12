class AbilityCore1001 extends AbilityCore {
  static BuildAbilityChild(level) {
    let num_bullets = 12;
    let damage = Math.round(NumbersBalancer.getAbilityDamage(level, 1.2) / num_bullets);

    const rawAbil = {
      name: 'Shotgun',
      description: 'Fire a spray of <<' + num_bullets + '>> bullets, dealing <<' + damage + '>> damage.' +
        '<br>These bullets will penetrate their targets.',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SPRAY_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.PENETRATE,
      hit_effects: [{base_damage: damage, effect: ProjectileShape.HitEffects.DAMAGE}],
      num_bullets: num_bullets,
      min_angle: Math.PI / 10.0,
      max_angle: Math.PI / 6.0,
      wall_bounces: 1,
      icon: "/Bouncy/assets/icons/shotgun.png",
      charge: {initial_charge: -1, max_charge: 2, charge_type: "TURNS"},
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
      .setCoordNums(36, 139, 44, 147)
      .setRotation(0)
      .fixRotation(true);
  }

  static getCooldown(perkList, perkCounts) {
    return {initial_charge: -1, max_charge: 2, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[1001] = AbilityCore1001;
