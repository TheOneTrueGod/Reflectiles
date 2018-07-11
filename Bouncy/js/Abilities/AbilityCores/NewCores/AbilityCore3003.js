class AbilityCore3003 extends AbilityCore {
  static BuildAbilityChild(level) {
    let numShards = 30;
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1.5) / numShards);
    const rawAbil = {
      name: 'Chaos Orb',
      description: 'Shoots an orb that rapidly decays.<br>' +
        'It fires [[num_bullets]] projectiles that deal [[hit_effects[0].base_damage]] damage each.<br>',
      card_text_description: '61 X [[hit_effects[0].base_damage]]',
      shard_style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setSheet('bullet_sheet')
        .setCoordNums(36, 139, 44, 147)
        .setRotation(0)
        .fixRotation(true)
        .build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.FROZEN_ORB,
      icon: "/Bouncy/assets/icons/icon_plain_forb.png",
      num_bullets: numShards,
      destroy_on_wall: [],
      collision_behaviours: [],
      shot_gap: 4,
      gravity: {
        x: 0,
        y: 0,
      },
      hit_effects: [
        {
          effect: ProjectileShape.HitEffects.DAMAGE,
          base_damage: hitDamage
        }
      ],
      timeout_effects: [],
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
      .setSheet('bullet_sheet').setCoordNums(166, 296, 184, 314).setRotation(0).fixRotation(true);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 3, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.CHAOS;
  }
}

AbilityCore.coreList[3003] = AbilityCore3003;
