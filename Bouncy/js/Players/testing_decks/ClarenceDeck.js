// Deployables.  If an enemy walks into a turret, it destroys it.
// (1) Shoot a projectile.  All turrets shoot at the cursor this turn as well.
// (2) Place a turret.  Lasts X turns.  Every turn, it shoots a single bullet straight up.
// (3) Place a cannon turret.  Lasts X turns.  Every turn, it shoots
// (4) Landmines.  Shoot a projectile.  When it hits an enemy, (3?) landmines scatter in the 2x3 space below the target.
// (5) Place a bomb on the ground.  After X (3?) turns, it explodes into a bunch
//      of projectiles.  Enemies push the bomb down when they walk into it, and
//      it can damage players

// Card Text for rose of death is wrong
// Cooldowns
// Direction the turrets shoot by default

const OLD_CLARENCE_ABILITIES = {
  ROSE_OF_DEATH: {
    name: 'Rose of Death',
    description: 'Creates one giant bomb<br>' +
      'After [[duration]] turns, it explodes, dealing 500 damage in a small area, and 300 damage in a 3-wide line going up the lane.',
    card_text_description: '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]]',
    ability_type: AbilityDef.AbilityTypes.CREATE_UNIT,
    duration: 5,
    unit: SummonUnitAbilityDef.UNITS.PUSHABLE_EXPLOSIVE,
    sprite: {texture: 'deployables', index: 6, end_index: 10},
    unit_abilities: [{
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.POSITION,
          projectile_type: "HIT",
          speed: 8,
          hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 200, aoe_type:"BOX", aoe_size: {x: [-1, 1], y: [-1, 1]}}],
          charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
        }
      }, {
      abil_def: {
        ability_type: AbilityDef.AbilityTypes.POSITION,
        projectile_type: "HIT",
        speed: 8,
        hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 300, aoe_type:"BOX", aoe_size: {x: [-1, 1], y: [-10, 1]}}],
        charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
      }
    }],
    max_range: {top: 3, bottom: -1, left: 1, right: 1},
    icon: "../Bouncy/assets/icons/spiral-bloom.png",
    charge: {initial_charge: -1, max_charge: 0, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
  }
};

function ClarenceDeck() {
  var abilities = [
    {
      name: 'Gun Turret',
      description: 'Create a turret.<br>' +
        'It shoots every turn, dealing [[unit_abilities[0].abil_def.hit_effects[0].base_damage]] damage.<br>' +
        'The turret lasts for [[duration]] turns, or until an enemy touches it or shoots it.' +
        '<br>Limited range.',
      card_text_description: '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]] / turn',
      zone_tooltip_name: 'Gun Turret',
      zone_tooltip_description: 'Shoots a bullet every turn for ' + 
        '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]] damage.<br>' +
        'If an enemy moves into the turret, the turret is destroyed.',
      ability_type: AbilityDef.AbilityTypes.CREATE_UNIT,
      duration: 10,
      turret_image: 3,
      projectile_interaction: {"hits_enemy_projectiles":true, "destroy":true},
      unit_abilities: [{
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
          projectile_type: "HIT",
          destroy_on_wall: [BorderWallLine.TOP],
          speed: 8,
          hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 200}],
          //charge: {initial_charge: -1, max_charge: 1, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
        }
      }],
      max_range: {top: 2, bottom: -1, left: 2, right: 2},
      icon: "../Bouncy/assets/icons/turret.png",
      charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
    },
    {
      name: 'Cannon Turret',
      description: 'Create a cannon turret.<br>' +
        'It shoots every other turn, dealing [[unit_abilities[0].abil_def.hit_effects[0].base_damage]] damage in a small area.<br>' +
        'The turret lasts for [[duration]] turns, or until an enemy touches it or shoots it.' +
        '<br>Limited range.',
      card_text_description: '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]] / 2 turn',
      zone_tooltip_name: 'Cannon Turret',
      zone_tooltip_description: 'Shoots a bullet every turn that explodes, dealing ' + 
        '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]] damage in a 3x3 box.<br>' +
        'If an enemy moves into the turret, the turret is destroyed.',
      ability_type: AbilityDef.AbilityTypes.CREATE_UNIT,
      duration: 10,
      turret_image: 4,
      projectile_interaction: {"hits_enemy_projectiles":true, "destroy":true},
      unit_abilities: [{
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
          projectile_type: "HIT",
          destroy_on_wall: [BorderWallLine.TOP],
          speed: 8,
          hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 150, aoe_type:"BOX"}],
          charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
        }
      }],
      max_range: {top: 2, bottom: -1, left: 2, right: 2},
      icon: "../Bouncy/assets/icons/cannon.png",
      charge: {initial_charge: -1, max_charge: 3, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
    },
    {
      name: 'Focused Fire',
      description: 'Shoots a shot, and commands all of your turrets to fire at your target.  This reduces their cooldowns if they are unable to fire.<br>' +
        'It deals [[hit_effects[0].base_damage]] damage.<br>It also makes all of your turrets aim where you are aiming.',
      card_text_description: '[[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      special_effects: [AbilityDef.SPECIAL_EFFECTS.TURRET_AIM, AbilityDef.SPECIAL_EFFECTS.TURRET_FIRE],
      icon: "../Bouncy/assets/icons/targeting.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 100
      }],
    },
    {
      name: 'Landmines',
      description: 'Creates [[unit_count]] landmines<br>' +
        'If a unit steps on one, it explodes dealing [[unit_abilities[0].abil_def.hit_effects[0].base_damage]] damage in an area<br>' +
        'They last for [[duration]] turns.<br>Limited range.',
      card_text_description: '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]]',
      zone_tooltip_name: 'Landmine',
      zone_tooltip_description: 'After enemy ends their movement on a landmine, it explodes dealing  ' + 
        '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]] damage in a 3x3 box.<br>' +
        'If an enemy moves into the turret, the turret is destroyed.',
      ability_type: AbilityDef.AbilityTypes.CREATE_UNIT,
      area_type: SummonUnitAbilityDef.AREA_TYPES.LINE,
      unit_count: 5,
      duration: 5,
      unit: SummonUnitAbilityDef.UNITS.LANDMINE,
      sprite: {texture: 'deployables', index: 5},
      unit_abilities: [{
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.POSITION,
          projectile_type: "HIT",
          hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 150, aoe_type:"BOX"}],
        }
      }],
      max_range: {top: 3, bottom: -1, left: 3, right: 3},
      icon: "../Bouncy/assets/icons/landmine.png",
      charge: {initial_charge: -1, max_charge: 5, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
    },
    {
      name: 'Molotov',
      description: 'Throws a molotov that explodes into a fireball.<br>' +
        'It explodes dealing [[timeout_effects[0].abil_def.hit_effects[0].base_damage]] damage.<br>' +
        'The fire lingers for [[timeout_effects[1].abil_def.duration]] turns, dealing ' +
        '[[timeout_effects[1].abil_def.phase_effects[0].abil_def.hit_effects[0].base_damage]] ' + 
        'damage per turn',
      card_text_description: '[[timeout_effects[0].abil_def.hit_effects[0].base_damage]]',
      charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      speed: 5,
      accuracy: {
        min_radius: 20,
        max_radius: 100,
        min_dist: 100,
        max_dist: 300,
      },
      projectile_type: ProjectileShape.ProjectileTypes.GRENADE,
      icon: "../Bouncy/assets/icons/molotov.png",
      hit_effects: [],
      timeout_effects: [
        {
          effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
          abil_def: {
            ability_type: AbilityDef.AbilityTypes.POSITION,
            hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 100, aoe_type:"BOX"}],
          }
        },
        {
          effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
          abil_def: {
            ability_type: AbilityDef.AbilityTypes.ZONE,
            zone_type: ZoneAbilityDef.ZoneTypes.MOLOTOV,
            zone_tooltip_name: 'Flames',
            zone_tooltip_description: 'After enemy movement, deals  ' + 
              '[[phase_effects[0].abil_def.hit_effects[0].base_damage]] damage.<br>' +
              'If an enemy moves into the turret, the turret is destroyed.',
            duration: 3,
            unit_interaction: { prevent_unit_entry: false },
            phase_effects: [{
              effect: "ABILITY",
              phase: TurnPhasesEnum.ENEMY_MOVE,
              abil_def: {
                ability_type: AbilityDef.AbilityTypes.POSITION,
                projectile_type: "HIT",
                hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 100, aoe_type:"BOX"}],
              },
            }],
            zone_size: {"left":1,"right":1,"top":1,"bottom":1,"y_range": 0},
          }
        }
      ],
    },
  ];

  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
