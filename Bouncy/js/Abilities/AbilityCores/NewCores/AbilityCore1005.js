class AbilityCore1005 extends AbilityCore {
  static BuildAbilityChild(level) {
    let grenadeRadius = Math.floor(Unit.UNIT_SIZE * 1.5);
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 0.1));
    const rawAbil = {
      name: 'Grenade',
      description: 'Toss a grenade that deals <<' + hitDamage + '>> damage in a <<' + grenadeRadius + '>> radius.',
      ability_type: AbilityDef.AbilityTypes.MULTIPART,
      icon: "/Bouncy/assets/icons/grenade.png",
      destroy_on_wall: true,
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      speed: 6,
      num_bullets: 1,
      bullet_wave_delay: 20,
      accuracy: {
        min_radius: 20,
        max_radius: 90,
        min_dist: 100,
        max_dist: 300,
      },
      projectile_type: ProjectileShape.ProjectileTypes.GRENADE,
      timeout_effects: [
        {
          effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
          abil_def: {
            ability_type: AbilityDef.AbilityTypes.POSITION,
            hit_effects:[{
              effect: ProjectileShape.HitEffects.DAMAGE,
              base_damage: hitDamage,
              aoe_type: ProjectileShape.AOE_TYPES.CIRCLE,
              aoe_size: grenadeRadius,
            }],
          }
        },
      ],
    };

    let cooldown = this.getCooldown();
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    rawAbil.style = this.createAbilityStyle(grenadeRadius).build();
    return AbilityDef.createFromJSON(rawAbil);
  }

  static createAbilityStyle(grenadeRadius) {
    return (new AbilitySheetSpriteAbilityStyleBuilder())
      .setSheet('bullet_sheet')
      .setCoordNums(334, 70, 340, 76)
      .setRotation(0)
      .fixRotation(true)
      .setExplosion(AbilityStyle.getExplosionPrefab(
        AbilityStyle.EXPLOSION_PREFABS.WHITE, grenadeRadius
      ));
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }

  static GetAimOffsets() {
    return {x: 0, y: -200};
  }
}

AbilityCore.coreList[1005] = AbilityCore1005;
