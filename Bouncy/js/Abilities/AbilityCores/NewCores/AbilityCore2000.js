class AbilityCore2000 extends AbilityCore {
  static BuildAbilityChild(level) {
    let num_bullets = 6;
    let shotDamage = Math.round(NumbersBalancer.getAbilityDamage(level, 0.9) / num_bullets);

    let duration = 120;
    const rawAbil = {
      name: 'Knife Toss',
      description: 'Throw <<' + num_bullets + '>> knives.  Each one deals <<' + shotDamage + '>> damage.',
      card_text_description: '[[num_bullets]] X <<' + shotDamage + '>>',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.TRI_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      num_bullets,
      collision_behaviours: [],
      wall_bounces: AbilityConstants.MINOR_WALL_BOUNCES,
      max_angle: Math.PI / 6.0,
      min_angle: Math.PI / 16.0,
      duration,
      hit_effects: [
        {
          base_damage: shotDamage,
          effect: ProjectileShape.HitEffects.DAMAGE,
        }
      ],
      icon: "/Bouncy/assets/icons/thrown-daggers.png",
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
      .setCoordNums(54, 2, 75, 23);
    return (new AbilitySheetSpriteAbilityStyleBuilder())
      .setSheet('bullet_sheet')
      .setCoordNums(275, 69, 294, 78)
      .setRotation(0);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }
}

AbilityCore.coreList[2000] = AbilityCore2000;
