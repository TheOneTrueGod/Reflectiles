class AbilityCore4001 extends AbilityCore {
  static BuildAbilityChild(level) {
    let numShards = 10;
    let shardDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1) / numShards);

    const rawAbil = {
      name: 'Ghost Shot',
      description: 'Launches a projectile that passes through all enemies in its path.<br>' +
        'After, it explodes into [[timeout_effects[0].abil_def.num_bullets]] shards that ' +
          'deal [[timeout_effects[0].abil_def.hit_effects[0].base_damage]] damage.',
      card_text_description: '[[timeout_effects[0].abil_def.num_bullets]] X [[timeout_effects[0].abil_def.hit_effects[0].base_damage]]',
      style: (new BulletSheetSpriteAbilityStyleBuilder).setImageIndex(0).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      max_angle: Math.PI / 8.0,
      min_angle: Math.PI / 16.0,
      projectile_type: ProjectileShape.ProjectileTypes.GHOST,
      icon: "/Bouncy/assets/icons/incoming-rocket.png",
      ghost_time: 1,
      hit_effects: [],
      timeout_effects: [
        {
          effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
          abil_def: {
            style: (new BulletSheetSpriteAbilityStyleBuilder).setImageIndex(1).build(),
            ability_type: AbilityDef.AbilityTypes.PROJECTILE,
            shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
            inherit_angle: true,
            projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
            speed: 6,
            gravity: {x: 0, y: 0},
            angle_start: -Math.PI / 4.0,
            angle_end: Math.PI / 4.0,
            num_bullets: numShards,
            collision_behaviours: [],
            hit_effects: [{
              effect: ProjectileShape.HitEffects.DAMAGE,
              base_damage: shardDamage
            }],
          }
        }
      ],
    };

    let cooldown = this.getCooldown();
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    return AbilityDef.createFromJSON(rawAbil);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 3, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }
}

AbilityCore.coreList[4001] = AbilityCore4001;
