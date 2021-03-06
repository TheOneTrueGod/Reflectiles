function TJDeck() {
  var abilities = [
    { // 1200 damage expected, 1800 max
      name: 'Explosion',
      description: 'Fires a single bullet, dealing [[hit_effects[0].base_damage]] damage in a 3x3 area',
      card_text_description: '[[hit_effects[0].base_damage]] 3x3',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: true,
      hit_effects:[{base_damage: 200, effect:ProjectileShape.HitEffects.DAMAGE, aoe_type:"BOX"}],
      icon: "/Bouncy/assets/icons/icon_plain_explosion.png"
    },
    { // 1200 max damage
      name: 'Shotgun',
      description: 'Fires a spray of [[num_bullets]] bullets, dealing [[hit_effects[0].base_damage]] damage.<br>These bullets will penetrate their targets.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(334, 70, 340, 76).setRotation(0).fixRotation(true).build(),
      destroy_on_wall: true,
      shape: ProjectileAbilityDef.Shapes.SPRAY_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.PENETRATE,
      destroy_on_wall: true,
      hit_effects: [{base_damage: 120, effect: ProjectileShape.HitEffects.DAMAGE}],
      num_bullets: 10,
      icon: "/Bouncy/assets/icons/shotgun.png",
      charge: {initial_charge: -1, max_charge: 2, charge_type: "TURNS"},
    },
    { // 1440 damage
      name: 'Double Wave',
      description: 'Sprays [[num_bullets]] in two waves.<br>' +
        'Each bullet deals [[hit_effects[0].base_damage]] damage.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(274, 68, 295, 79).setRotation(0).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.DOUBLE_WAVE,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      num_bullets: 36,
      return_num_bullets: 0,
      destroy_on_wall: true,
      icon: "/Bouncy/assets/icons/icon_plain_wave.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 50
      }],
      charge: {"initial_charge":-1, "max_charge": 5, "charge_type":"TURNS"},
    }, { // 2250 max damage.
      name: 'Rain',
      description: 'Make it rain.<br>Fires [[num_bullets]] projectiles.<br>' +
        'Each one deals [[hit_effects[0].base_damage]] damage, and then splits into [[hit_effects[1].num_bullets]] projectiles that deal [[hit_effects[1].hit_effects[0].base_damage]] damage.<br>' +
        'Can\'t be aimed.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setSheet('bullet_sheet').setCoordNums(37, 159, 44, 166).setRotation(0).fixRotation(true).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.RAIN,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: true,
      hit_effects: [
        {effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 20},
        {
          effect: ProjectileShape.HitEffects.BULLET_SPLIT,
          style: (new AbilitySheetSpriteAbilityStyleBuilder())
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
      name: 'Rage',
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
      zone_size: {left: 1, right:1, top:1, bottom:1, y_range: 0},
      max_range: {left: 0, right: 0, top: 0, bottom: 0},
      icon: "/Bouncy/assets/icons/icon_strong.png",
      charge: {initial_charge: -1, max_charge: 5, charge_type: "TURNS"},
    }
  ];
  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}

const OLD_TJ_ABILITIES = {
  SPREAD_SHOT: { // 1400 damage expected
    name: 'Spread Shot',
    description: 'Fires [[num_bullets]] bullets, each dealing [[hit_effects[0].base_damage]] damage',
    card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
    ability_type: AbilityDef.AbilityTypes.PROJECTILE,
    shape: "TRI_SHOT",
    style: (new AbilitySheetSpriteAbilityStyleBuilder)
      .setSheet('bullet_sheet').setCoordNums(275, 69, 294, 78).setRotation(0).build(),
    projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
    destroy_on_wall: true,
    num_bullets: 7,
    hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 200}],
    charge: {initial_charge: -1, max_charge: 2, charge_type: "TURNS"},
  },
};
