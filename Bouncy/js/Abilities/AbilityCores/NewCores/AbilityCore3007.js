class AbilityCore3007 extends AbilityCore {
  static BuildAbilityChild(level) {
    let num_bounces = 4;
    let num_bullets = 30;
    let damage = Math.round(NumbersBalancer.getAbilityDamage(level, 1) / (num_bullets * (num_bounces + 1)));
    const rawAbil = {
      name: 'Beam',
      description: 'Shoots a stream of <<' + num_bullets + '>> magic orbs that deal [[hit_effects[0].base_damage]] damage and bounce up to <<' + num_bounces + '>> times.',
      card_text_description: '<<' + num_bullets + '>> X <<' + num_bounces + '>> X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [],
      wall_bounces: num_bounces + 2,
      collision_behaviours: [
        {behaviour: CollisionBehaviour.BOUNCE, count: num_bounces},
      ],
      num_bullets,
      bullet_wave_delay: 2,
      base_accuracy: 0,
      accuracy_decay: 0,
      icon: "/Bouncy/assets/icons/ringed-beam.svg",
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
      .setSheet('weapons_sheet')
      .setCoordIndex(7, 0, 26, 25)
      .setTrailDef({ type: ProjectileTrailDef.TRAIL_TYPES.LINE, duration: 7, color: 0x888888, options: { width: 4 } });
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 3, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.CHAOS;
  }
}

AbilityCore.coreList[3007] = AbilityCore3007;
