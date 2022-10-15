class AbilityCore1002 extends AbilityCore {
  static BuildAbilityChild(level) {
    let num_bullets = 40;
    let damage = Math.round(
      NumbersBalancer.getAbilityDamage(level, 1.1) / num_bullets
    );

    const rawAbil = {
      name: "Shoot 'em up",
      description:
        "Shoots a wild spray of bullets.<br>" +
        "[[num_bullets]] bullets deal [[hit_effects[0].base_damage]] damage",
      card_text_description: "[[num_bullets]] X [[hit_effects[0].base_damage]]",
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [],
      num_bullets,
      speed: 10,
      bullet_wave_delay: 2,
      accuracy_decay: Math.PI / 5.12,
      wall_bounces: 1,
      icon: "/Bouncy/assets/icons/bullets.png",
      hit_effects: [
        {
          effect: ProjectileShape.HitEffects.DAMAGE,
          base_damage: damage,
        },
      ],
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
      .setSheet("bullet_sheet")
      .setCoordNums(0, 0, 1, 1)
      .setRotation(0)
      .fixRotation(true)
      .setTrailDef({
        type: ProjectileTrailDef.TRAIL_TYPES.LINE,
        duration: 7,
        color: 0x888888,
        options: { width: 4 },
      });
  }

  static getCooldown() {
    return {
      initial_charge: -1,
      max_charge: 2,
      charge_type: AbilityDef.CHARGE_TYPES.TURNS,
    };
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[1002] = AbilityCore1002;
