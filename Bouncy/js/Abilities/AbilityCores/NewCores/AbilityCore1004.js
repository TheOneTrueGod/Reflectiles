class AbilityCore1004 extends AbilityCore {
  static BuildAbilityChild(level) {
    let num_bullets = 50;
    let shots_per_wave = 2;
    let damage = Math.round(NumbersBalancer.getAbilityDamage(level, 1.2) / (num_bullets * shots_per_wave));
    const rawAbil = {
      name: 'Chain Gun',
      description: 'Shoots <<' + (num_bullets * shots_per_wave) + '>> bullets that deal [[hit_effects[0].base_damage]] damage each.',
      card_text_description: '<<' + (num_bullets * shots_per_wave) + '>> X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.PENETRATE,
      destroy_on_wall: [],
      num_bullets,
      shots_per_wave,
      barrel_width: 50,
      curve_def: {
        type: ProjectileCurveHandler.CURVE_TYPES.TO_AIM_ANGLE,
        curve_time: 5,
      },
      bullet_wave_delay: 1,
      base_accuracy: Math.PI / 3.0,
      accuracy_decay: 0,
      wall_bounces: 1,
      icon: "/Bouncy/assets/icons/minigun.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: damage
      }]
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

  static getCooldown() {
    return {initial_charge: -1, max_charge: 4, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[1004] = AbilityCore1004;
