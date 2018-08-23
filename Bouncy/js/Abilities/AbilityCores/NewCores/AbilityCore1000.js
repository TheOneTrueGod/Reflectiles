class AbilityCore1000 extends AbilityCore {
  static BuildAbilityChild(level) {
    let base_damage = Math.round(NumbersBalancer.getAbilityDamage(level, 1) / 4);
    let explosionRadius = 40;
    const rawAbil = {
      name: 'Explosion',
      description: 'Fire a rocket that deals [[hit_effects[0].base_damage]] ' +
        'damage in a circle of size [[hit_effects[0].aoe_size]].',
      card_text_description: '[[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      speed: 8,
      scale: 0.5,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [],
      wall_bounces: 1,
      hit_effects: [
        {
          base_damage: base_damage,
          effect: ProjectileShape.HitEffects.DAMAGE,
          aoe_type: ProjectileShape.AOE_TYPES.CIRCLE,
          aoe_size: explosionRadius,
        }
      ],
      icon: "/Bouncy/assets/icons/icon_plain_explosion.png"
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
      .setCoordNums(2, 1, 24, 23)
      .setExplosion(AbilityStyle.getExplosionPrefab(
        AbilityStyle.EXPLOSION_PREFABS.WHITE, explosionRadius
      ));
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[1000] = AbilityCore1000;
