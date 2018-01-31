function TabithaDeck() {
  var abilities = [
    {
      name: 'Drill Shot',
      description: 'Shoots a projectile that passes through enemies.<br>' +
        'It deals [[hit_effects[0].base_damage]] damage to up to [[num_hits]] targets.',
      card_text_description: '[[num_hits]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(65, 301, 73, 320).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      collision_behaviours: [
        {behaviour: CollisionBehaviour.PASSTHROUGH, count: 6},
      ],
      num_hits: 7,
      icon: "/Bouncy/assets/icons/icon_plain_drill.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 150
      }],
      charge:{initial_charge: -1, max_charge: 3, charge_type: AbilityDef.CHARGE_TYPES.TURNS}
    },
    {
      name: 'Fireworks',
      description: 'Launches a projectile.<br>' +
        'It explodes into [[timeout_effects[0].abil_def.num_bullets]] bullets ' +
        ' that bounce 2 times.<br>' +
        'Each time, they deal [[timeout_effects[0].abil_def.hit_effects[0].base_damage]] damage.',
      card_text_description: '[[timeout_effects[0].abil_def.num_bullets]] X [[timeout_effects[0].abil_def.hit_effects[0].base_damage]] x 2',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(323, 70, 331, 77).setRotation(0).fixRotation(true).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.TIMEOUT,
      icon: "/Bouncy/assets/icons/icon_plain_burst.png",
      max_bounces: -1,
      hit_effects: [],
      timeout_effects: [
        {
          effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
          abil_def: {
            style: (new AbilitySheetSpriteAbilityStyleBuilder)
              .setSheet('bullet_sheet').setCoordNums(334, 70, 341, 77).setRotation(0).fixRotation(true).build(),
            ability_type: AbilityDef.AbilityTypes.PROJECTILE,
            shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
            speed: 8,
            projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
            collision_behaviours: [
              {behaviour: CollisionBehaviour.BOUNCE, count: 1},
            ],
            num_bullets: 11,
            destroy_on_wall: [],
            hit_effects:
              [{
                effect: ProjectileShape.HitEffects.DAMAGE,
                base_damage: 70
              }],
          }
        }
      ],
      charge:{initial_charge: -1, max_charge: 3, charge_type: AbilityDef.CHARGE_TYPES.TURNS}
    },
    {
      name: 'Rain',
      description: 'Make it rain.<br>Fires [[num_bullets]] projectiles.<br>' +
        'Each one deals [[hit_effects[0].base_damage]] damage, and then splits into [[hit_effects[1].num_bullets]] projectiles that deal [[hit_effects[1].hit_effects[0].base_damage]] damage.<br>' +
        'Can\'t be aimed.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(37, 159, 44, 166).setRotation(0).fixRotation(true).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.RAIN,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: true,
      hit_effects: [{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 20},
        {
          effect: ProjectileShape.HitEffects.BULLET_SPLIT,
          style: (new AbilitySheetSpriteAbilityStyleBuilder)
            .setSheet('bullet_sheet').setCoordNums(19, 159, 24, 166).setRotation(0).fixRotation(true).build(),
          projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
          hit_effects: [{
            effect:ProjectileShape.HitEffects.DAMAGE,
            base_damage: 5,
          }],
          num_bullets: 2
        }
      ],
      num_bullets: 50,
      icon: "/Bouncy/assets/icons/icon_plain_rain.png",
      charge: {"initial_charge":-1, "max_charge": 5, "charge_type":"TURNS"},
    },
    {
      name: 'Chaos Orb',
      description: 'Shoots an orb that rapidly decays.<br>' +
        'It fires [[num_bullets]] projectiles that deal [[hit_effects[0].base_damage]] damage<br>' +
        'Afterwards, it explodes into another [[timeout_effects[0].abil_def.num_bullets]] projectiles',
      card_text_description: '61 X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(166, 296, 184, 314).setRotation(0).fixRotation(true).build(),
      shard_style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(36, 139, 44, 147).setRotation(0).fixRotation(true).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.FROZEN_ORB,
      icon: "/Bouncy/assets/icons/icon_plain_forb.png",
      num_bullets: 50,
      destroy_on_wall: [],
      hit_effects: [
        {
          effect: ProjectileShape.HitEffects.DAMAGE,
          base_damage: 30
        }
      ],
      timeout_effects: [
        {
          effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
          abil_def: {
            style: (new AbilitySheetSpriteAbilityStyleBuilder)
              .setSheet('bullet_sheet').setCoordNums(36, 139, 44, 147).setRotation(0).fixRotation(true).build(),
            ability_type: AbilityDef.AbilityTypes.PROJECTILE,
            shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
            projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
            gravity: {x: 0, y: 0},
            speed: 8,
            size: 6,
            destroy_on_wall: [],
            num_bullets: 11,
            hit_effects:
              [{
                effect: ProjectileShape.HitEffects.DAMAGE,
                base_damage: 30
              }],
          }
        }
      ],
      charge:{"initial_charge": -1, "max_charge": 3, "charge_type":"TURNS"}
    },
    {
      name: 'The Sprinkler',
      description: 'Sprays [[num_bullets]] in a wave, then another [[return_num_bullets]] coming back.<br>' +
        'Each bullet deals [[hit_effects[0].base_damage]] damage, and bounces once.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(274, 68, 295, 79).setRotation(0).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.WAVE,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [],
      collision_behaviours: [
        {behaviour: CollisionBehaviour.BOUNCE, count: 1},
      ],
      num_bullets: 20,
      return_num_bullets: 5,
      icon: "/Bouncy/assets/icons/icon_plain_wave.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 30
      }],
      charge:{initial_charge: -1, max_charge: 4, charge_type: AbilityDef.CHARGE_TYPES.TURNS}
    }
  ];

  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
