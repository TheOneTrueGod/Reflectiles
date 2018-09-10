class AbilityCore3002 extends AbilityCore {
  static BuildAbilityChild(level) {
    let numExplosions = 4;
    let num_bullets = 10;
    let base_damage = Math.round(NumbersBalancer.getAbilityDamage(level, 1) / (num_bullets * numExplosions));
    const rawAbil = {
      name: 'Fireworks',
      description: 'Launches a firework.<br>' +
        'It explodes into <<' + num_bullets * numExplosions + '>> shards that deal <<' + base_damage + '>> damage.',
      card_text_description: '[[timeout_effects[0].abil_def.num_bullets]] X [[timeout_effects[0].abil_def.hit_effects[0].base_damage]] x 2',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.TIMEOUT,
      icon: "/Bouncy/assets/icons/icon_plain_burst.png",
      max_bounces: -1,
      hit_effects: [],
      timeout_effects: [
        AbilityCore3002.makeFireworkSubAbil(base_damage, num_bullets, 8, (Math.PI * 2 / num_bullets / 4 * 0)),
        AbilityCore3002.makeFireworkSubAbil(base_damage, num_bullets, 7, (Math.PI * 2 / num_bullets / 4 * 1)),
        AbilityCore3002.makeFireworkSubAbil(base_damage, num_bullets, 7.5, (Math.PI * 2 / num_bullets / 4 * 2)),
        AbilityCore3002.makeFireworkSubAbil(base_damage, num_bullets, 8.5, (Math.PI * 2 / num_bullets / 4 * 3)),
      ],
    };

    let cooldown = this.getCooldown();
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    rawAbil.style = this.createAbilityStyle().build();
    return AbilityDef.createFromJSON(rawAbil);
  }

  static makeFireworkSubAbil(base_damage, num_bullets, speed, angle_offset) {
    return {
      effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
      abil_def: {
        style: (new AbilitySheetSpriteAbilityStyleBuilder)
          .setSheet('bullet_sheet').setCoordNums(334, 70, 341, 77).setRotation(0).fixRotation(true).build(),
        ability_type: AbilityDef.AbilityTypes.PROJECTILE,
        shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
        speed,
        projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
        duration: 80,
        gravity: {x: 0, y: 0},
        max_bounces: AbilityConstants.MINOR_WALL_BOUNCES,
        collision_behaviours: [],
        num_bullets,
        angle_offset,
        destroy_on_wall: [],
        bounce_on_wall: {'BOTTOM': true, 'TOP': true, 'LEFT': true, 'RIGHT': true},
        hit_effects:
          [{
            effect: ProjectileShape.HitEffects.DAMAGE,
            base_damage: base_damage
          }],
      }
    };
  }

  static createAbilityStyle() {
    return (new AbilitySheetSpriteAbilityStyleBuilder)
      .setSheet('bullet_sheet')
      .setCoordNums(323, 70, 331, 77)
      .setRotation(0)
      .fixRotation(true);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.CHAOS;
  }
}

AbilityCore.coreList[3002] = AbilityCore3002;
