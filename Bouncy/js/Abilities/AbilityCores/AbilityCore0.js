class AbilityCore0 extends AbilityCore {
  static BuildAbility(perkList) {
    let perkCounts = AbilityFactory.ConvertPerkListToCounts(perkList);
    let damageCount = idx(perkCounts, 'damage', 0);
    const rawAbil = { // 1200 damage expected, 1800 max
      name: 'Explosion',
      description: 'Fires a single bullet, dealing [[hit_effects[0].base_damage]] damage in a 3x3 area',
      card_text_description: '[[hit_effects[0].base_damage]] 3x3',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: true,
      hit_effects:[{
        base_damage: 200 + 20 * damageCount,
        effect:ProjectileShape.HitEffects.DAMAGE,
        aoe_type:"BOX"
      }],
      icon: "/Bouncy/assets/icons/icon_plain_explosion.png"
    };
    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetPerkList() {
    let perkList = [
      (new AbilityPerkNode('damage',    20, [0, 0])),
      (new AbilityPerkNode('radius',     1, [0, 3])),
      (new AbilityPerkNode('impact',     1, [0, 1])),
      (new AbilityPerkNode('test 2-1',   1, [1, 1])).addChild('impact'),
      (new AbilityPerkNode('test 2-2',   1, [1, 2])).addChild('impact'),
      (new AbilityPerkNode('test 2-2-1', 1, [2, 2])).addChild('test 2-2'),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[0] = AbilityCore0;
