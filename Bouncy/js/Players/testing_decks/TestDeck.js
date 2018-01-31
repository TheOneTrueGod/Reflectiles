function TestDeck() {
  var abilities = [
    { // 1200 damage expected, 1800 max
      name: 'Explosion',
      description: 'Fires a single bullet, dealing [[hit_effects[0].base_damage]] damage in a 3x3 area',
      card_text_description: '[[hit_effects[0].base_damage]] 3x3',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      collision_behaviours: [
        {behaviour: CollisionBehaviour.PASSTHROUGH, count: 2},
        {behaviour: CollisionBehaviour.BOUNCE, count: 1},
        {behaviour: CollisionBehaviour.PASSTHROUGH, count: 1},
        {behaviour: CollisionBehaviour.BOUNCE, count: 1},
      ],
      hit_effects:[{base_damage: 50, effect:ProjectileShape.HitEffects.DAMAGE}],
      icon: "/Bouncy/assets/icons/icon_plain_explosion.png"
    },
    {
      ability_type: AbilityDef.AbilityTypes.ZONE,
      unit_interaction: {
        prevent_unit_entry: true,
        unit_enter:[{
          effect: "ABILITY",
          ability_source: "BELOW_UNIT",
          abil_def: {
            "ability_type": AbilityDef.AbilityTypes.PROJECTILE,
            "shape": ProjectileAbilityDef.Shapes.SINGLE_SHOT,
            "projectile_type":"PENETRATE",
            "hit_effects":[{"effect": ProjectileShape.HitEffects.DAMAGE, "base_damage":400}]
          }
        }]
      },
      projectile_interaction: {enemy_projectiles: {destroy: true}},
      duration: 6,
      zone_size: {left:1, right:1, top:0, bottom:0, y_range: 0},
      max_range: {left: 5, right: 5, top: 1, bottom: 1},
      unit_enter_effect: {},
      icon: "/Bouncy/assets/icons/icon_plain_shield.png",
      charge: {"initial_charge":-1,"max_charge":3,"charge_type":"TURNS"},
    },
    { // 2440 damage max.  Actually dealing less than that
      name: 'Shoot \'em up',
      description: 'Shoots a wild spray of bullets.<br>' +
        '[[num_bullets]] bullets deal [[hit_effects[0].base_damage]] damage',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(29, 301, 37, 320).setRotation(Math.PI / 2).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: true,
      num_bullets: 1000,
      bullet_wave_delay: 1,
      accuracy_decay: Math.PI / 32.0,
      icon: "/Bouncy/assets/icons/bullets.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 10
      },
      {
        effect: ProjectileShape.HitEffects.POISON,
        damage: 10,
        duration: 2
      }],
    },
    {
      name: 'Bouncy Wall',
      description: 'Creates a zone around you that lasts [[duration]] turns.<br>' +
        'Any projectile entering or leaving the zone becomes Powerful, dealing 20% extra damage.',
      card_text_description: '+20%',
      zone_tooltip_name: 'Rage',
      zone_tooltip_description: 'Any projectile entering or leaving this zone becomes Powerful, dealing 20% extra damage.',
      ability_type: AbilityDef.AbilityTypes.ZONE,
      projectile_interaction: {
        player_projectiles: {
          buff: {type: Projectile.BuffTypes.DAMAGE},
          force_passthrough: true,
        },
      },
      unit_interaction: { prevent_unit_entry: false },
      duration: 3,
      zone_size: {left: 0, right: 0, top: 1, bottom: 1, y_range: 0},
      max_range: {left: 5, right: 5, top: 5, bottom: 5},
      icon: "/Bouncy/assets/icons/icon_strong.png",
      charge: {initial_charge: -1, max_charge: 5, charge_type: "TURNS"},
    }
  ];
  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
