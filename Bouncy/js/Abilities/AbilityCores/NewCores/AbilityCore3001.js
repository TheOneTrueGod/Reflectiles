class AbilityCore3001 extends AbilityCore {
  static BuildAbilityChild(level) {
    let num_bullets = 20;
    let base_damage = Math.round(NumbersBalancer.getAbilityDamage(level, 1.5) / num_bullets);

    const rawAbil = { // 2250 max damage.
      name: 'Rain',
      description: 'Make it rain.<br>Fires [[num_bullets]] projectiles.<br>' +
        'Each one deals [[hit_effects[0].base_damage]] damage' +
        '.<br>Can\'t be aimed.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.RAIN,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: true,
      hit_effects: [
        {effect: ProjectileShape.HitEffects.DAMAGE, base_damage: base_damage},
      ],
      timeout_hit_effects: [],
      collision_behaviours: [],
      speed_decay: {x: 0.98, y: 1},
      num_bullets,
      icon: "/Bouncy/assets/icons/icon_plain_rain.png",
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
      .setSheet('bullet_sheet').setCoordNums(37, 159, 44, 166)
      .setRotation(0).fixRotation(true);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 3, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.CHAOS;
  }
}

AbilityCore.coreList[3001] = AbilityCore3001;
