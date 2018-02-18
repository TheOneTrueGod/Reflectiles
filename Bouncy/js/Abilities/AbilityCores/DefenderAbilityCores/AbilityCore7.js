class AbilityCore7 extends AbilityCore {
  static BuildAbility(perkList) {
    const rawAbil = {
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
      icon: "/Bouncy/assets/icons/icon_plain_shield.png",
      charge: {"initial_charge":-1,"max_charge":3,"charge_type":"TURNS"},
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
    return CardDeckTypes.DEFENDER;
  }
}

AbilityCore.coreList[7] = AbilityCore7;
