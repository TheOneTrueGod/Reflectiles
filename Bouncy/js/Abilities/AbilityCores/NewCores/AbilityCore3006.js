// TODO:
// [] Change the cooldown
// [] Change the style
// [] Change the rawAbil
class AbilityCore3006 extends AbilityCore {
  static BuildAbilityChild(level) {
    let numShots = 10;
    let shots_per_wave = 4;
    let explosionRadius = Math.floor(Unit.UNIT_SIZE / 4);
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1.2) / (numShots * shots_per_wave));
    const rawAbil = {
      name: 'Arcane Barrage',
      description: 'Fire a volley of <<' + numShots * shots_per_wave + '>> magic missiles that deal <<' + hitDamage + '>> damage in a <<' + explosionRadius + '>> radius.',
      ability_type: AbilityDef.AbilityTypes.MULTIPART,
      icon: "/Bouncy/assets/icons/arcanebarrage.png",
      destroy_on_wall: true,
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      duration: 40,
      height: 50,
      shots_per_wave,
      num_bullets: numShots,
      bullet_wave_delay: 1,
      accuracy: {
        min_radius: 50,
        max_radius: 100,
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
              aoe_size: explosionRadius,
            }],
          }
        },
      ],
    };

    let cooldown = this.getCooldown();
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    rawAbil.style = this.createAbilityStyle(explosionRadius).build();
    return AbilityDef.createFromJSON(rawAbil);
  }

  static createAbilityStyle(explosionRadius) {
    return (new AbilitySheetSpriteAbilityStyleBuilder())
      .setSheet('weapons_sheet')
      .setCoordIndex(6, 0, 26, 25)
      .setExplosion(AbilityStyle.getExplosionPrefab(
        AbilityStyle.EXPLOSION_PREFABS.PURPLE_EXPLOSION, explosionRadius
      ));
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 3, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.CHAOS;
  }

  static GetAimOffsets() {
    return {x: 0, y: -200};
  }
}

AbilityCore.coreList[3006] = AbilityCore3006;
