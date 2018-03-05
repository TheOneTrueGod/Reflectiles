class AbilityCore21 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    const rawAbil = {
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
      projectile_interaction: {enemy_projectiles: {destroy: true}},
      unit_abilities: [{
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
          projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
          destroy_on_wall: [BorderWallLine.TOP],
          speed: 8,
          hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 100, aoe_type:"BOX"}],
          charge: {initial_charge: -1, max_charge: 4, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
        }
      }],
      max_range: {top: 2, bottom: -1, left: 2, right: 2},
      icon: "/Bouncy/assets/icons/cannon.png",
      charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
      max_summon: 2,
    };
    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetPerkList() {
    let perkList = [
      (new AbilityPerkNode('damage',    20, [0, 0])),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.ENGINEER;
  }
}

AbilityCore.coreList[21] = AbilityCore21;
