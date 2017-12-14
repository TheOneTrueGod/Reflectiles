// Likes status effects over direct damage
// Phasing shot -- passes through things at a certain distance
// He likes the frozen orb and effects like that
// Shoot an enemy.  If it dies, it explodes.
// [done] Passthrough projectile.
// [done] AoE Explodes on contact.


function SeanDeck() {
  var abilities = [
    { // 1000 damage.  500 more per turn
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
    { // 3000 damage max
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
          num_bullets: 30,
          gravity: {x: 0, y: 0},
          hit_effects: [{
            effect: ProjectileShape.HitEffects.DAMAGE,
            base_damage: 100
          }],
        }
      }],
      icon: "../Bouncy/assets/icons/nuclear.png"
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
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      destroy_on_wall: true,
      num_bullets: 25,
      bullet_wave_delay: 3,
      accuracy_decay: Math.PI / 128.0,
      icon: "../Bouncy/assets/icons/bullets.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 30
      },
      {
        effect: ProjectileShape.HitEffects.POISON,
        damage: 15,
        duration: 1
      }],
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
            speed: 8,
            gravity: {x: 0, y: 0},
            angle_start: -Math.PI / 4.0,
            angle_end: Math.PI / 4.0,
            num_bullets: 10,
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
      hit_effects:[{
        damage: 100,
        duration: 3,
        effect:ProjectileShape.HitEffects.POISON,
        aoe_type: "BOX",
        aoe_size:{x:[-2,2],y:[-1,1]}
      }],
      icon: "../Bouncy/assets/icons/poison-gas.png",
      charge:{initial_charge: -1, max_charge: 6, charge_type: "TURNS"}
    }
  ];

  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
