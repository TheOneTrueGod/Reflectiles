class AbilityCore19 extends AbilityCore {
  static BuildAbility(perkList) {
    const rawAbil = {
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
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects:[{
        damage: 100,
        duration: 3,
        effect:ProjectileShape.HitEffects.POISON,
        aoe_type: "BOX",
        aoe_size:{x:[-2,2],y:[-1,1]}
      }],
      icon: "/Bouncy/assets/icons/poison-gas.png",
      charge:{initial_charge: -1, max_charge: 6, charge_type: "TURNS"}
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
    return CardDeckTypes.POISON;
  }
}

AbilityCore.coreList[19] = AbilityCore19;
