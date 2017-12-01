function TJDeck() {
  var abilities = [
    {
      name: 'Shotgun',
      description: 'Fires a spray of [[num_bullets]] bullets, dealing [[hit_effects[0].base_damage]] damage',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(334, 70, 340, 76).setRotation(0).fixRotation(true).build(),
      destroy_on_wall: true,
      shape: ProjectileAbilityDef.Shapes.SPRAY_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      destroy_on_wall: true,
      hit_effects: [{base_damage: 100, effect: ProjectileShape.HitEffects.DAMAGE}],
      num_bullets: 14
    },
    {
      name: 'Explosion',
      description: 'Fires a single bullet, dealing [[hit_effects[0].base_damage]] damage in a 3x3 area',
      card_text_description: '[[hit_effects[0].base_damage]] 3x3',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      destroy_on_wall: true,
      hit_effects:[{base_damage: 250, effect:ProjectileShape.HitEffects.DAMAGE, aoe_type:"BOX"}],
      icon: "../Bouncy/assets/icons/icon_plain_explosion.png"
    },
    {
      name: 'Spread Shot',
      description: 'Fires [[num_bullets]] bullets, each dealing [[hit_effects[0].base_damage]] damage',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: "TRI_SHOT",
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(275, 69, 294, 78).setRotation(0).build(),
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      num_bullets: 7,
      hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage:200}]
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
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      destroy_on_wall: true,
      hit_effects: [{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 25},
        {
          effect: ProjectileShape.HitEffects.BULLET_SPLIT,
          style: (new AbilitySheetSpriteAbilityStyleBuilder)
            .setSheet('bullet_sheet').setCoordNums(19, 159, 24, 166).setRotation(0).fixRotation(true).build(),
          projectile_type: ProjectileShape.ProjectileTypes.HIT,
          hit_effects: [{
            effect:ProjectileShape.HitEffects.DAMAGE,
            base_damage: 10,
          }],
          num_bullets: 2
        }
      ],
      num_bullets: 50,
      icon: "../Bouncy/assets/icons/icon_plain_rain.png",
      charge: {"initial_charge":-1, "max_charge": 5, "charge_type":"TURNS"},
    }, {
      name: 'Splurt',
      description: 'Deals [[hit_effects[0].base_damage]] AoE damage.  ' +
      'Then splits into [[hit_effects[1].num_bullets]] bullets that each deal [[hit_effects[1].hit_effects[0].base_damage]] damage.',
      card_text_description: '[[hit_effects[0].base_damage]] + [[hit_effects[1].num_bullets]] X [[hit_effects[1].hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      destroy_on_wall: true,
      hit_effects:[
        {
          effect: ProjectileShape.HitEffects.DAMAGE,
          base_damage: 60,
          aoe_type: ProjectileShape.AOE_TYPES.BOX,
          aoe_size:{x: [-1, 1], y:[-1, 0]},
        },
        {
          effect: ProjectileShape.HitEffects.BULLET_SPLIT,
          projectile_type: ProjectileShape.ProjectileTypes.HIT,
          hit_effects: [{
            effect:ProjectileShape.HitEffects.DAMAGE,
            base_damage: 50,
            aoe_type: ProjectileShape.AOE_TYPES.BOX,
            aoe_size:{x: [-1, 1], y:[-1, 0]},
          }],
          num_bullets: 6
        }
       ],
       icon: "../Bouncy/assets/icons/icon_plain_splurt.png",
       charge: {"initial_charge":-1, "max_charge": 5, "charge_type":"TURNS"}
    }
  ];
  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
