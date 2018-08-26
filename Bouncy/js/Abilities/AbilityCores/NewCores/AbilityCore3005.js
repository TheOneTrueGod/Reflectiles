class AbilityCore3005 extends AbilityCore {
  static BuildAbilityChild(level) {
    let numShots = 3;
    let numBounces = 2;
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 0.9) / numShots / (numBounces + 1));
    const rawAbil = {
      name: 'Energy Blast',
      description: `Fires <<${numShots}>> energy blasts that bounce <<${numBounces}>> times and deal <<${hitDamage}>> damage.`,
      card_text_description: `${numShots} X ${hitDamage} damage`,
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [],
      num_bullets: numShots,
      shots_per_wave: 1,
      speed: 8,
      wall_bounces: numBounces + 1,
      curve_def: {
        type: ProjectileCurveHandler.CURVE_TYPES.TO_AIM_ANGLE,
        curve_time: 20,
      },
      collision_behaviours: [
        {behaviour: CollisionBehaviour.BOUNCE, count: numBounces},
      ],
      bullet_wave_delay: 15,
      accuracy_decay: Math.PI / 3.0,
      base_accuracy: 0,
      hit_effects: [
        {
          base_damage: hitDamage,
          effect: ProjectileShape.HitEffects.DAMAGE,
        }
      ],
      icon: "/Bouncy/assets/icons/blast.png"
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
      .setSheet('weapons_sheet')
      .setCoordIndex(5, 0, 26, 25, 2)
      .setScale(1.5);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.CHAOS;
  }
}

AbilityCore.coreList[3005] = AbilityCore3005;
