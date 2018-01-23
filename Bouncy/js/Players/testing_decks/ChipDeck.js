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
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      num_bullets: 5,
      hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 180}]
    },{
      name: 'Drill Shot',
      description: 'Shoots a projectile that passes through enemies.<br>' +
        'It deals [[hit_effects[0].base_damage]] damage to up to [[num_hits]] targets.',
      card_text_description: '[[num_hits]] X [[hit_effects[0].base_damage]]',
      /*style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(275, 69, 294, 78).setRotation(0).setTrail({type: 'laser'}).build(),*/
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      collision_behaviours: [
        {behaviour: CollisionBehaviour.PASSTHROUGH, count: 3},
      ],
      num_hits: 4,
      icon: "../Bouncy/assets/icons/icon_plain_drill.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 250
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
            shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
            projectile_type: "PENETRATE",
            "hit_effects":[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 400}]
          }
        }]
      },
      projectile_interaction: {enemy_projectiles: {destroy: true}},
      duration: 6,
      zone_size: {left:1, right:1, top:0, bottom:0, y_range: 0},
      max_range: {left: 5, right: 5, top: 1, bottom: 1},
      unit_enter_effect: {},
      icon: "../Bouncy/assets/icons/icon_plain_shield.png",
      charge: {"initial_charge":-1,"max_charge":3,"charge_type":"TURNS"},
    },{
      name: 'Freeze',
      description: 'Freezes a 3x3 square of enemies for [[hit_effects[1].duration]] turns',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects: [
        {effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 100, aoe_type: "BOX"},
        {effect: ProjectileShape.HitEffects.FREEZE, duration: 3, aoe_type: "BOX"}
      ],
      icon: "../Bouncy/assets/icons/icon_plain_frost.png",
      charge: {"initial_charge":-1,"max_charge":3,"charge_type":"TURNS"}
    },{
      name: 'Mass Weaken',
      description: 'Deals [[hit_effects[0].base_damage]] to each enemy in a 5x3 radius.<br>' +
        'Applies weakness to each enemy hit for [[hit_effects[1].duration]] turns, increasing the damage they take by 50%',
      card_text_description: '100 5x3',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects:[{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 100,
        aoe_type: "BOX",
        aoe_size: {"x":[-2, 2], y:[-1, 1]}
      },
      {
        effect: ProjectileShape.HitEffects.WEAKNESS,
        duration: 2,
        aoe_type: "BOX",
        aoe_size: {"x":[-2, 2], y:[-1, 1]},
      }],
      icon:"../Bouncy/assets/icons/icon_plain_hearts.png",
      charge: {"initial_charge":-1,"max_charge":3,"charge_type":"TURNS"}
    }];

  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
