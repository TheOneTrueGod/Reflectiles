class AbilityCore4009 extends AbilityCore {
  static BuildAbilityChild(level) {
    let duration = 2;
    let grenadeRadius = Math.floor(Unit.UNIT_SIZE);
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 0.05));
    const rawAbil = {
      name: 'Shock Grenade',
      description: 'Toss a grenade that disables shields for <<' + duration + '>> turns, and deals <<' + hitDamage + '>> damage in a <<' + grenadeRadius + '>> radius.',
      ability_type: AbilityDef.AbilityTypes.MULTIPART,
      icon: "/Bouncy/assets/icons/bolt-bomb.png",
      destroy_on_wall: true,
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      speed: 6,
      num_bullets: 1,
      bullet_wave_delay: 20,
      accuracy: {
        min_radius: 20,
        max_radius: 40,
        min_dist: 50,
        max_dist: 200,
      },
      projectile_type: ProjectileShape.ProjectileTypes.GRENADE,
      timeout_effects: [
        {
          effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
          abil_def: {
            ability_type: AbilityDef.AbilityTypes.POSITION,
            hit_effects:[
              {
                effect: ProjectileShape.HitEffects.DISABLE_SHIELD,
                duration,
                aoe_type: ProjectileShape.AOE_TYPES.CIRCLE,
                aoe_size: grenadeRadius,
              },
              {
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
      .setCoordNums(166, 296, 184, 314)
      .setRotation(0)
      .fixRotation(true)
      .setExplosion(AbilityStyle.getExplosionPrefab(
        AbilityStyle.EXPLOSION_PREFABS.LIGHTNING, grenadeRadius
      ));
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 5, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }
}

AbilityCore.coreList[4009] = AbilityCore4009;
