function ChipDeck() {
  var abilities = [
    {
      name: 'Spread Shot',
      description: 'Shoot [[num_bullets]] projectiles.<br>' +
        'Each one deals [[hit_effects[0].base_damage]] damage.',
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape:"TRI_SHOT",
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(275, 69, 294, 78).setRotation(0).build(),
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      num_bullets: 5,
      hit_effects:[{"effect": ProjectileShape.HitEffects.DAMAGE,"base_damage":200}]
    },{
      name: 'Drill Shot',
      description: 'Shoots a projectile that passes through enemies.<br>' +
        'It deals [[hit_effects[0].base_damage]] damage to up to [[num_hits]] targets.',
      card_text_description: '[[num_hits]] X [[hit_effects[0].base_damage]]',
      /*style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(275, 69, 294, 78).setRotation(0).setTrail({type: 'laser'}).build(),*/
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.PASSTHROUGH,
      num_hits: 3,
      icon: "../Bouncy/assets/icons/icon_plain_drill.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 300
      }],
    },{
      name: 'Shield',
      description: 'Puts up a shield with [[duration]] health.<br>' +
        'It loses one health per turn, or when it defends.<br>' +
        'Whenever a unit tries to enter, relatiate for [[unit_interaction.unit_enter[0].abil_def.hit_effects[0].base_damage]] damage',
      card_text_description: '[[unit_interaction.unit_enter[0].abil_def.hit_effects[0].base_damage]]',
      zone_tooltip_name: 'Shield',
      zone_tooltip_description: 'Protects from bullets.  If an enemy would enter, the shield will retaliate for ' +
        '[[unit_interaction.unit_enter[0].abil_def.hit_effects[0].base_damage]] damage.',
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
      projectile_interaction: {"hits_enemy_projectiles":true, "destroy":true},
      duration: 6,
      zone_size: {"left":1,"right":1,"top":0,"bottom":0,"y_range": 0},
      max_range: {"left": 2, "right": 2, "top": 1, "bottom": 0},
      unit_enter_effect: {},
      icon: "../Bouncy/assets/icons/icon_plain_shield.png",
      charge: {"initial_charge":-1,"max_charge":3,"charge_type":"TURNS"},
    },{
      name: 'Freeze',
      description: 'Freezes a single enemy for [[hit_effects[0].duration]] turns',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      hit_effects: [{"effect": ProjectileShape.HitEffects.FREEZE, "duration":3}],
      icon:"../Bouncy/assets/icons/icon_plain_frost.png",
      charge: {"initial_charge":-1,"max_charge":2,"charge_type":"TURNS"}
    },{
      name: 'Demi',
      description: 'Halves the health of each enemy in a 5x3 radius.<br>' +
        'Does not affect armour or shields.',
      card_text_description: '50% 5x3',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      hit_effects:[{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: "50%",
        aoe_type: "BOX",
        aoe_size: {"x":[-2, 2], "y":[-1, 1]}
      }],
      icon:"../Bouncy/assets/icons/icon_plain_hearts.png"
    }
]
  ;
  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
