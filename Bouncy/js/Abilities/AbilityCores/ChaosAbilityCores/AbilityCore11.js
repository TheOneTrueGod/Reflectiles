class AbilityCore11 extends AbilityCore {
  static BuildAbility(perkList) {
    const rawAbil = {
      name: 'Fireworks',
      description: 'Launches a projectile.<br>' +
        'It explodes into [[timeout_effects[0].abil_def.num_bullets]] bullets ' +
        ' that bounce 2 times.<br>' +
        'Each time, they deal [[timeout_effects[0].abil_def.hit_effects[0].base_damage]] damage.',
      card_text_description: '[[timeout_effects[0].abil_def.num_bullets]] X [[timeout_effects[0].abil_def.hit_effects[0].base_damage]] x 2',
      style: (new AbilitySheetSpriteAbilityStyleBuilder)
        .setSheet('bullet_sheet').setCoordNums(323, 70, 331, 77).setRotation(0).fixRotation(true).build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.TIMEOUT,
      icon: "/Bouncy/assets/icons/icon_plain_burst.png",
      max_bounces: -1,
      hit_effects: [],
      timeout_effects: [
        {
          effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
          abil_def: {
            style: (new AbilitySheetSpriteAbilityStyleBuilder)
              .setSheet('bullet_sheet').setCoordNums(334, 70, 341, 77).setRotation(0).fixRotation(true).build(),
            ability_type: AbilityDef.AbilityTypes.PROJECTILE,
            shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
            speed: 8,
            projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
            collision_behaviours: [
              {behaviour: CollisionBehaviour.BOUNCE, count: 1},
            ],
            num_bullets: 11,
            destroy_on_wall: [],
            hit_effects:
              [{
                effect: ProjectileShape.HitEffects.DAMAGE,
                base_damage: 70
              }],
          }
        }
      ],
      charge:{initial_charge: -1, max_charge: 3, charge_type: AbilityDef.CHARGE_TYPES.TURNS}
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
    return CardDeckTypes.CHAOS;
  }
}

AbilityCore.coreList[11] = AbilityCore11;
