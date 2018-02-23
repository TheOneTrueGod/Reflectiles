// Weapon.  Rocket Launcher.
// Perk Ideas;
// -- Primary Target damage increase
// -- Splash damage increase
// -- Damage up.
// -- -- Side effect of other perks is increasing cooldown
// -- Cooldown Decrease
//
// Path 1; Fire multiple rockets machinegun style
// Path 1 branch;  Micro rockets -- barrage of tiny rockets
// Path 2; Splash radius increases, rocket becomes larger
// Path 3; MIRV -- When the rocket explodes, it releases a cluster of grenades.
class AbilityCore0 extends AbilityCore {
  static BuildAbility(perkList) {
    let perkCounts = AbilityFactory.ConvertPerkListToCounts(perkList);
    let damageCount = idx(perkCounts, 'damage', 0);
    let impactCount = idx(perkCounts, 'impact', 0);
    let radiusCount = idx(perkCounts, 'radius', 0);
    let explosionRadius = 40 + radiusCount * 5;
    const rawAbil = { // 1200 damage expected, 1800 max
      name: 'Explosion',
      description: 'Fires a rocket that deals ' +
        (impactCount > 0 ? '[[hit_effects[0].base_damage]] to the first unit hit, and ' : '') +
        '[[hit_effects[1].base_damage]] damage in a circle of size [[hit_effects[1].aoe_size]]',
      card_text_description: '[[hit_effects[1].base_damage]] 3x3',
      style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setSheet('weapons_sheet')
        .setCoordNums(2, 1, 24, 23)
        .setExplosion(AbilityStyle.getExplosionPrefab(
          AbilityStyle.EXPLOSION_PREFABS.WHITE, explosionRadius
        ))
        .build(),
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      speed: 8,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: true,
      hit_effects:[
        {
          base_damage: 20 * impactCount,
          effect: ProjectileShape.HitEffects.DAMAGE,
        },
        {
          base_damage: 200 + 20 * damageCount,
          effect: ProjectileShape.HitEffects.DAMAGE,
          aoe_type: ProjectileShape.AOE_TYPES.CIRCLE,
          aoe_size: explosionRadius,
        }
      ],
      icon: "/Bouncy/assets/icons/icon_plain_explosion.png"
    };
    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetPerkList() {
    // .addRequirement(new PerkLevelRequirement('damage+', 'max')),
    // .addRequirement(new OrPerkLevelRequirement(
    //  [new PerkLevelRequirement('impact', 'max'),
    //  new PerkLevelRequirement('radius', 'max')]
    //)
    let perkList = [
      // Level 1.
      (new AbilityPerkNode('damage1',      3, [0, 3])),
      // Level 2.
      (new AbilityPerkNode('impact2',      3, [1, 1]))
        .addRequirement(new PerkLevelRequirement('damage1', 'max')),
      (new AbilityPerkNode('radius2',      3, [1, 5]))
        .addRequirement(new PerkLevelRequirement('damage1', 'max')),

      // Level 3.
      (new AbilityPerkNode('damage3',      3, [2, 1]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('impact2', 'max'),
          new PerkLevelRequirement('radius2', 'max')]
        )),

      // Level 4
      (new AbilityPerkNode('rocket count4', 3, [3, 1]))
        .addRequirement(new PerkLevelRequirement('damage3', 'max'))
        .addRequirement(new PerkLevelRequirement('impact2', 'max')),
      (new AbilityPerkNode('impact4', 3, [3, 3]))
        .addRequirement(new PerkLevelRequirement('damage3', 'max')),
      // Level 5

      // Level 6
      (new AbilityPerkNode('cluster rocket', 3, [5, 1])),
      (new AbilityPerkNode('mirv', 3, [5, 3])),

      // Level 7

      (new AbilityPerkNode('nuke', 3, [6, 5])),

      // Level 8
      (new AbilityPerkNode('rocket count6', 3, [7, 0])),
      (new AbilityPerkNode('damage6', 3, [7, 4]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('nuke', 'max'),
          new PerkLevelRequirement('radius2', 'max')]
        )),
      (new AbilityPerkNode('radius6', 3, [7, 5])),

      // Level 9
      (new AbilityPerkNode('fallout zone', 3, [7, 6])),

    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[0] = AbilityCore0;
