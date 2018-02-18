class AbilityCore24 extends AbilityCore {
  static BuildAbility(perkList) {
    const rawAbil = {
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
      icon: "/Bouncy/assets/icons/molotov.png",
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
              '[[phase_effects[0].abil_def.hit_effects[0].base_damage]] damage.<br>',
            duration: 3,
            unit_interaction: { prevent_unit_entry: false },
            phase_effects: [{
              effect: "ABILITY",
              phase: TurnPhasesEnum.ENEMY_MOVE,
              abil_def: {
                ability_type: AbilityDef.AbilityTypes.POSITION,
                projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
                hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 50, aoe_type:"BOX"}],
              },
            }],
            zone_size: {"left":1,"right":1,"top":1,"bottom":1,"y_range": 0},
            charge: {initial_charge: -1, max_charge: 3, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
          }
        }
      ],
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

AbilityCore.coreList[24] = AbilityCore24;
