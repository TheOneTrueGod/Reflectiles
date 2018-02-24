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
    let perks = AbilityCore0.GetPerkList();
    let perkTree = {};
    let perkPcts = {};
    let perkCounts = AbilityFactory.ConvertPerkListToCounts(perkList);
    for (let perk of perks) {
      perkTree[perk.key] = perk;
      perkPcts[perk.key] = idx(perkCounts, perk.key, 0) / perk.levels;
    }

    let rocketCount = 1 + idx(perkCounts, 'rocket count4', 0) + idx(perkCounts, 'rocket count8', 0);

    let damagePctIncrease =
      idx(perkPcts, 'damage1', 0) * 0.25 +
      idx(perkPcts, 'damage2', 0) * 0.5 +
      idx(perkPcts, 'damage3', 0) * 0.25 +
      idx(perkPcts, 'damage radius5', 0) * 0.1 +
      idx(perkPcts, 'damage4', 0) * 0.5 +
      idx(perkPcts, 'damage5', 0) * 0.25 +
      idx(perkPcts, 'damage8', 0) * 0.5 +
      idx(perkPcts, 'damage small8', 0) * 0.5;
    let base_damage = Math.round(200 * (1 + damagePctIncrease) / ((rocketCount - 1) * 0.75 + 1));

    let impactCount = idx(perkCounts, 'impact2', 0) + idx(perkCounts, 'impact5', 0);

    let impact_damage = Math.round(base_damage * (impactCount / 10));
    base_damage -= impact_damage / 2;
    base_damage = Math.round(base_damage);

    let radiusIncrease =
      idx(perkPcts, 'radius2', 0) * 0.5 +
      idx(perkPcts, 'damage radius5', 0) * 0.5;

    let explosionRadius = Math.round(40 * (1 + radiusIncrease));
    const rawAbil = {
      name: 'Explosion',
      description: 'Fires ' +
        (rocketCount == 1 ? 'a rocket that deals' : '[[num_bullets]] rockets that deal ') +
        (impact_damage > 0 ? '[[hit_effects[0].base_damage]] to the first unit hit, and ' : '') +
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
      shape: ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      speed: 8,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: true,
      num_bullets: rocketCount,
      accuracy_decay: Math.PI / 32.0,
      hit_effects:[
        {
          base_damage: impact_damage,
          effect: ProjectileShape.HitEffects.DAMAGE,
        },
        {
          base_damage: base_damage,
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
    let perkList = [
      // Level 1.
      (new AbilityPerkNode('damage1',      3, [0, 3])),
      // Level 2.
      (new AbilityPerkNode('impact2',      5, [1, 1]))
        .addRequirement(new PerkLevelRequirement('damage1')),
      (new AbilityPerkNode('radius2',      5, [1, 5]))
        .addRequirement(new PerkLevelRequirement('damage1')),
      (new AbilityPerkNode('damage2',      5, [1, 3]))
        .addRequirement(new PerkLevelRequirement('damage1')),

      // Level 3.
      (new AbilityPerkNode('damage3',      3, [2, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('impact2'),
          new PerkLevelRequirement('radius2')]
        )),

      // Level 4
      (new AbilityPerkNode('rocket count4', 3, [3, 1]))
        .addRequirement(new OrPerkLevelRequirement([
          new PerkLevelRequirement('damage3'),
          new PerkLevelRequirement('impact2')
        ])),
      (new AbilityPerkNode('damage4', 6, [3, 4]))
        .addRequirement(new PerkLevelRequirement('damage3')),
      // Level 5
      (new AbilityPerkNode('impact5',      5, [4, 0]))
        .addRequirement(new PerkLevelRequirement('rocket count4')),
      (new AbilityPerkNode('damage5', 3, [4, 5]))
        .addRequirement(new PerkLevelRequirement('radius2')),
      (new AbilityPerkNode('damage radius5', 3, [4, 3]))
        .addRequirement(new PerkLevelRequirement('rocket count4')),
      // Level 6
      (new AbilityPerkNode('cluster rocket', 3, [5, 1]))
        .addRequirement(new PerkLevelRequirement('rocket count4')),

      // Level 7
      (new AbilityPerkNode('mirv', 3, [6, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('damage5'),
          new PerkLevelRequirement('damage radius5')]
        )),
      (new AbilityPerkNode('nuke', 3, [6, 5]))
        .addRequirement(new PerkLevelRequirement('damage5')),

      // Level 8
      (new AbilityPerkNode('damage small8', 3, [7, 2]))
        .addRequirement(new PerkLevelRequirement('cluster rocket')),
      (new AbilityPerkNode('rocket count8', 3, [7, 0]))
        .addRequirement(new PerkLevelRequirement('cluster rocket')),
      (new AbilityPerkNode('damage8', 3, [7, 4]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('nuke'),
          new PerkLevelRequirement('mirv')]
        )),
      (new AbilityPerkNode('radius8', 3, [7, 5]))
        .addRequirement(new PerkLevelRequirement('nuke')),

      // Level 9
      (new AbilityPerkNode('fallout zone', 3, [7, 6]))
        .addRequirement(new PerkLevelRequirement('nuke')),

    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[0] = AbilityCore0;
