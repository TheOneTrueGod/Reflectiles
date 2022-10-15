class AbilityCore1006 extends AbilityCore {
  static BuildAbilityChild(level) {
    let num_bullets = 25;
    let return_num_bullets = 0;
    let hitDamage = Math.floor(
      NumbersBalancer.getAbilityDamage(level, 1.0) / num_bullets
    );
    const rawAbil = {
      name: "Uzi",
      description:
        "Shoot a spray of <<" +
        (num_bullets + return_num_bullets) +
        ">> bullets that deal <<" +
        hitDamage +
        ">> damage each.",
      card_text_description: "[[num_bullets]] X [[hit_effects[0].base_damage]]",
      icon: "/Bouncy/assets/icons/uzi.png",
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.WAVE,
      projectile_type: ProjectileShape.ProjectileTypes.PENETRATE,
      destroy_on_wall: [],
      collision_behaviours: [],
      angle_spread: Math.PI / 3,
      angle_offset: -Math.PI / 6,
      wall_bounces: 1,
      num_bullets,
      speed: 10,
      return_num_bullets,
      return_shot_delay: 15,
      shot_delay: 2,
      hit_effects: [
        {
          effect: ProjectileShape.HitEffects.DAMAGE,
          base_damage: hitDamage,
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

AbilityCore.coreList[1006] = AbilityCore1006;
