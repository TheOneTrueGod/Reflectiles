class AbilityCore8 extends AbilityCore {
  static BuildAbility(perkList) {
    const rawAbil = {
      name: 'Freeze',
      description: 'Freezes a 3x3 square of enemies for [[hit_effects[1].duration]] turns',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects: [
        {effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 100, aoe_type: "BOX"},
        {effect: ProjectileShape.HitEffects.FREEZE, duration: 3, aoe_type: "BOX"}
      ],
      icon: "/Bouncy/assets/icons/icon_plain_frost.png",
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

AbilityCore.coreList[8] = AbilityCore8;
