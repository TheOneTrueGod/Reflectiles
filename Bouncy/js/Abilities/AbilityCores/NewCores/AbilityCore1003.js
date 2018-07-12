class AbilityCore1003 extends AbilityCore {
  static BuildAbilityChild(level) {
    let num_bounces = 3;
    let base_damage = Math.round(NumbersBalancer.getAbilityDamage(level, 1) / (num_bounces + 1));
    const rawAbil = {
      name: 'Bouncing Bullet',
      description: 'Shoot a single bullet that bounces up to ' +
        '<<' + num_bounces + '>> times, dealing <<' + base_damage + '>> damage.',
      card_text_description: '[[hit_effects[1].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      speed: 16,
      scale: 0.5,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [],
      wall_bounces: num_bounces,
      collision_behaviours: [
        {behaviour: CollisionBehaviour.BOUNCE, count: num_bounces},
      ],
      hit_effects: [{
        base_damage: base_damage,
        effect: ProjectileShape.HitEffects.DAMAGE,
      }],
      icon: "/Bouncy/assets/icons/bouncing_bullet.png"
    };;

    let cooldown = this.getCooldown();
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    rawAbil.style = this.createAbilityStyle().build();
    return AbilityDef.createFromJSON(rawAbil);
  }

  static createAbilityStyle() {
    return (new AbilitySheetSpriteAbilityStyleBuilder())
      .setSheet('bullet_sheet')
      .setCoordNums(36, 139, 44, 147)
      .setRotation(0)
      .fixRotation(true);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[1003] = AbilityCore1003;
