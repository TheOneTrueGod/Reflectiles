class AbilityCore9 extends AbilityCore {
  static BuildAbility(perkList) {
    const rawAbil = {
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
      icon: "/Bouncy/assets/icons/icon_plain_hearts.png",
      charge: {"initial_charge":-1,"max_charge":3,"charge_type":"TURNS"}
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

AbilityCore.coreList[9] = AbilityCore9;
