class AbilityCore3000 extends AbilityCore {
  static BuildAbilityChild(level) {
    let num_bullets = 20;
    let base_damage = Math.round(NumbersBalancer.getAbilityDamage(level, 1.5) / num_bullets);

    let explosionRadius = 40;

    const rawAbil ={ // 1440 damage
      name: 'Double Wave',
      description: 'Sprays [[num_bullets]] bullets that deal [[hit_effects[0].base_damage]] damage in two waves.<br>',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.DOUBLE_WAVE,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      num_bullets: num_bullets,
      return_num_bullets: 0,
      destroy_on_wall: [],
      wall_bounces: 1,
      hit_effects: [{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: base_damage}],
      angle_spread: Math.PI / 3.0,
      angle_offset: -Math.PI / 16.0,
      shot_delay: 4,
      collision_behaviours: [],
      icon: "/Bouncy/assets/icons/icon_double_wave.png",
    };

    let cooldown = this.getCooldown();
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    rawAbil.style = this.createAbilityStyle().build();
    return AbilityDef.createFromJSON(rawAbil);
  }

  static createAbilityStyle() {
    return (new AbilitySheetSpriteAbilityStyleBuilder)
      .setSheet('bullet_sheet').setCoordNums(274, 68, 295, 79).setRotation(0);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 3, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.CHAOS;
  }
}

AbilityCore.coreList[3000] = AbilityCore3000;
