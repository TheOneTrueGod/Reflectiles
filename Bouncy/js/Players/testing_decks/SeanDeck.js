// Likes status effects over direct damage
// Phasing shot -- passes through things at a certain distance
// He likes the frozen orb and effects like that
// Shoot an enemy.  If it dies, it explodes.
// [done] Passthrough projectile.
// [done] AoE Explodes on contact.


function SeanDeck() {
  var abilities = [
    {
      name: 'Poison Drill',
      description: 'Shoots a projectile that passes through enemies.<br>' +
        'It deals [[hit_effects[0].base_damage]] damage to up to [[num_hits]] targets.<br>' +
        'It also poisons them, dealing [[hit_effects[1].damage]] over [[hit_effects[1].duration]] turns',

      card_text_description: '[[num_hits]] X [[hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(29, 301, 37, 320).setRotation(Math.PI / 2).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.PASSTHROUGH,
      num_hits: 10,
      icon: "../Bouncy/assets/icons/icon_plain_drill.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 50
      },
      {
        effect: ProjectileShape.HitEffects.POISON,
        damage: 50,
        duration: 2
      }],
      "charge":{"initial_charge":-1, "max_charge":4, "charge_type":"TURNS"}
    },
    {
      name: 'Infect',
      description: 'Shoots a projectile that hits a single enemy.<br>' +
        'That enemy is infected.  If they die in the next [[hit_effects[0].duration]] ' +
        'turns, they explode into [[hit_effects[0].abil_def.num_bullets]] bullets, ' +
        'each one dealing [[hit_effects[0].abil_def.hit_effects[0].base_damage]] damage',
      card_text_description: '[[hit_effects[0].abil_def.num_bullets]] X [[hit_effects[0].abil_def.hit_effects[0].base_damage]]',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(393, 157, 406, 171).setRotation(0).fixRotation(true).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      hit_effects: [{
        effect: ProjectileShape.HitEffects.INFECT,
        duration: 2,
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
          projectile_type: ProjectileShape.ProjectileTypes.HIT,
          //bullet_speed: 6,
          speed: 8,
          num_bullets: 20,
          gravity: {x: 0, y: 0},
          hit_effects: [{
            effect: ProjectileShape.HitEffects.DAMAGE,
            base_damage: 100
          }],
        }
      }],
      icon: "../Bouncy/assets/icons/nuclear.png"
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
      num_bullets: 50,
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.FROZEN_ORB,
      icon:"../Bouncy/assets/icons/icon_plain_forb.png",
      hit_effects: [
        {
          effect: ProjectileShape.HitEffects.DAMAGE,
          base_damage: 40
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
            projectile_type: ProjectileShape.ProjectileTypes.HIT,
            gravity: {x: 0, y: 0},
            speed: 8,
            size: 6,
            num_bullets: 11,
            hit_effects:
              [{
                effect: ProjectileShape.HitEffects.DAMAGE,
                base_damage: 40
              }],
          }
        }
      ],
      charge:{"initial_charge": -1, "max_charge": 3, "charge_type":"TURNS"}
    },
    {
      name: 'Ghost Shot',
      description: 'Launches a projectile that doesn\'t do anything until ' +
        'it passes through an enemy unit and travels 2 squares.<br>' +
        'Once it does that, it explodes into [[timeout_effects[0].abil_def.num_bullets]] bullets.<br>' +
        'Each one deals [[timeout_effects[0].abil_def.hit_effects[0].base_damage]] damage.',
      card_text_description: '[[timeout_effects[0].abil_def.num_bullets]] X [[timeout_effects[0].abil_def.hit_effects[0].base_damage]]',
      style: (new BulletSheetSpriteAbilityStyleBuilder).setImageIndex(0).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.GHOST,
      icon: "../Bouncy/assets/icons/incoming-rocket.png",
      duration: 1,
      hit_effects: [],
      timeout_effects: [
        {
          effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
          abil_def: {
            style: (new BulletSheetSpriteAbilityStyleBuilder).setImageIndex(1).build(),
            ability_type: AbilityDef.AbilityTypes.PROJECTILE,
            shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
            inherit_angle: true,
            projectile_type: ProjectileShape.ProjectileTypes.HIT,
            num_bullets: 10,
            speed: 8,
            gravity: {x: 0, y: 0},
            angle_start: -Math.PI / 4.0,
            angle_end: Math.PI / 4.0,
            hit_effects:
              [{
                effect: ProjectileShape.HitEffects.DAMAGE,
                base_damage: 100
              }],
          }
        }
      ],
      "charge":{"initial_charge":-1, "max_charge":3, "charge_type":"TURNS"}
    },
    {
      name: 'Poison Explosion',
      description: 'Fires a single bullet, poisoning all enemies in a 5x3 area<br>' +
        'Deals [[hit_effects[0].damage]] damage over [[hit_effects[0].duration]] turns.',
      card_text_description: '[[hit_effects[0].damage]] 5x3',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('poison_sheet')
        .setCoords({left: 53, top: 85, right: 72, bottom: 93})
        .setExplosion(AbilityStyle.getExplosionPrefab(AbilityStyle.EXPLOSION_PREFABS.POISON))
        .setRotation(-Math.PI).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      hit_effects:[{damage: 75, duration: 3, effect:ProjectileShape.HitEffects.POISON, aoe_type:"BOX","aoe_size":{"x":[-2,2],"y":[-1,1]}}],
      icon: "../Bouncy/assets/icons/poison-gas.png",
      "charge":{"initial_charge":-1, "max_charge":3, "charge_type":"TURNS"}
    }
  ];

  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
