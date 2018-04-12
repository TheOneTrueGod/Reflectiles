class AbilityCore1 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let shootAbilities = [];
    let description = '';
    let grenadeRadius = lerp(Unit.UNIT_SIZE * 1.5, Unit.UNIT_SIZE * 2.5,
      idx(perkPcts, 'grenade area', 0)
    );
    if (this.hasPerk(perkPcts, 'grenade')) {
      let grenadeDamage = lerp(50, 200,
        (
          idx(perkPcts, 'grenade damage 1', 0) +
          idx(perkPcts, 'grenade damage 2', 0) +
          idx(perkPcts, 'grenade damage 3', 0) * 2
        ) / 4
      );

      let numGrenades = 1 + this.hasPerk(perkPcts, 'double grenade') + this.hasPerk(perkPcts, 'triple grenade');

      if (numGrenades > 1) {
        grenadeDamage *= Math.pow(AbilityConstants.MULTISHOT_DAMAGE_PENALTY, numGrenades - 1);
      }
      grenadeDamage = Math.floor(grenadeDamage);

      let grenadeText = "a grenade";
      if (numGrenades > 1) {
        grenadeText = "<<" + numGrenades + ">> grenades";
      }

      description += "Throw " + grenadeText + " that deals <<" + grenadeDamage + ">> in a <<" + grenadeRadius + ">> radius.";
      shootAbilities.push({
        destroy_on_wall: true,
        ability_type: AbilityDef.AbilityTypes.PROJECTILE,
        shape: ProjectileAbilityDef.Shapes.CHAIN_SHOT,
        speed: 6,
        accuracy_decay: Math.PI / 16.0,
        num_bullets: numGrenades,
        bullet_wave_delay: 20,
        accuracy: {
          min_radius: 20,
          max_radius: Math.ceil(100 - idx(perkPcts, 'grenade accuracy', 0) * 40),
          min_dist: 100,
          max_dist: 300,
        },
        projectile_type: ProjectileShape.ProjectileTypes.GRENADE,
        timeout_effects: [
          {
            effect: PositionBasedEffect.EFFECTS.USE_ABILITY,
            abil_def: {
              ability_type: AbilityDef.AbilityTypes.POSITION,
              hit_effects:[{
                effect: ProjectileShape.HitEffects.DAMAGE,
                base_damage: grenadeDamage,
                aoe_type: ProjectileShape.AOE_TYPES.CIRCLE,
                aoe_size: grenadeRadius,
              }],
            }
          },
        ],
      });
      description += "<br>";
    }

    description += "Fire a spray of ";
    if (this.hasPerk(perkPcts, 'second volley')) {
      let smallVolleyBullets = Math.floor(lerp(6, 9, idx(perkPcts, 'more bullets', 0)));
      let smallVolleyDamage = Math.floor(lerp(400, 900,
        (
          idx(perkPcts, '2 damage 1', 0) +
          idx(perkPcts, '2 damage 2', 0) +
          idx(perkPcts, '2 damage 3', 0) * 2
        ) / 4
      ) / smallVolleyBullets);
      description += '<<' + smallVolleyBullets + '>> bullets, dealing <<' + smallVolleyDamage + '>> damage.<br>';
      shootAbilities.push({
        destroy_on_wall: true,
        ability_type: AbilityDef.AbilityTypes.PROJECTILE,
        shape: ProjectileAbilityDef.Shapes.SPRAY_SHOT,
        projectile_type: ProjectileShape.ProjectileTypes.PENETRATE,
        hit_effects: [{base_damage: smallVolleyDamage, effect: ProjectileShape.HitEffects.DAMAGE}],
        duration: 40,
        min_angle: Math.PI / 10.0 * (lerp(1, 1.2, idx(perkPcts, 'wide cone', 0))),
        max_angle: Math.PI / 6.0 * (lerp(1, 1.2, idx(perkPcts, 'wide cone', 0))),
        speed_decay: {x: 0.99, y: 0.99},
        num_bullets: smallVolleyBullets,
        timing_offset: 30 * shootAbilities.length,
      });

      description += 'Fire a second spray of ';
    }

    let num_bullets = 10;
    let damage = Math.floor(lerp(1200, 3000, (
      idx(perkPcts, '1 damage 1', 0) +
      idx(perkPcts, '1 damage 2', 0) +
      idx(perkPcts, '1 damage 3', 0) +
      idx(perkPcts, '1 damage 4', 0) * 2
    ) / 5) / num_bullets);

    description += '<<' + num_bullets + '>> bullets, dealing <<' + damage + '>> damage.<br>';
    shootAbilities.push({
      destroy_on_wall: true,
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SPRAY_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.PENETRATE,
      hit_effects: [{base_damage: damage, effect: ProjectileShape.HitEffects.DAMAGE}],
      num_bullets: num_bullets,
      min_angle: Math.PI / 10.0 * (lerp(1, 0.5, idx(perkPcts, 'narrow cone', 0))),
      max_angle: Math.PI / 6.0 * (lerp(1, 0.5, idx(perkPcts, 'narrow cone', 0))),
      timing_offset: 25 * shootAbilities.length,
    });

    description += 'These bullets will penetrate their targets.';

    const rawAbil = {
      name: 'Shotgun',
      description,
      ability_type: AbilityDef.AbilityTypes.MULTIPART,
      style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setSheet('bullet_sheet')
        .setCoordNums(334, 70, 340, 76)
        .setRotation(0)
        .fixRotation(true)
        .setExplosion(AbilityStyle.getExplosionPrefab(
          AbilityStyle.EXPLOSION_PREFABS.WHITE, grenadeRadius
        ))
        .build(),
      icon: "/Bouncy/assets/icons/shotgun.png",
      charge: {initial_charge: -1, max_charge: 2, charge_type: "TURNS"},
      child_abilities: shootAbilities,
    }
    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetPerkList() {
    let perkList = [
      // First path
      (new AbilityPerkNode('1 damage 1',                    5, [1, 1])),
      (new AbilityPerkNode('1 damage 2',                    5, [3, 1]))
        .addRequirement(new PerkLevelRequirement('1 damage 1')),
      (new MaxxedAbilityPerkNode('narrow cone',                   3, [3, 0]))
        .addRequirement(new PerkLevelRequirement('1 damage 1')),
      (new AbilityPerkNode('1 damage 3',                    5, [5, 1]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('1 damage 2'),
          new PerkLevelRequirement('narrow cone')]
        )),
      (new AbilityPerkNode('1 damage 4',                    8, [6, 1]))
        .addRequirement(new PerkLevelRequirement('1 damage 3')),
      // Second Path
      (new MaxxedAbilityPerkNode('second volley',    3, [0, 2])),
      (new AbilityPerkNode('2 damage 1',       5, [2, 2]))
        .addRequirement(new PerkLevelRequirement('second volley')),
      (new AbilityPerkNode('2 damage 2',       5, [4, 2]))
        .addRequirement(new PerkLevelRequirement('2 damage 1')),
      (new AbilityPerkNode('wide cone',                     5, [3, 3]))
        .addRequirement(new PerkLevelRequirement('2 damage 1')),
      (new AbilityPerkNode('more bullets',                     5, [5, 3]))
        .addRequirement(new PerkLevelRequirement('wide cone')),
      (new AbilityPerkNode('2 damage 3',                    8, [6, 2]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('2 damage 2'),
          new PerkLevelRequirement('more bullets')]
        )),
      // Third Path
      (new MaxxedAbilityPerkNode('grenade',        3, [2, 5]))
        .addRequirement(new PerksSpentRequirement(5)),
      (new AbilityPerkNode('grenade damage 1',     5, [3, 5]))
        .addRequirement(new PerkLevelRequirement('grenade')),
      (new AbilityPerkNode('grenade damage 2',     5, [4, 6]))
        .addRequirement(new PerkLevelRequirement('grenade damage 1')),
      (new AbilityPerkNode('grenade accuracy',     5, [4, 4]))
        .addRequirement(new PerkLevelRequirement('grenade damage 1')),
      (new MaxxedAbilityPerkNode('double grenade', 3, [5, 5]))
        .addRequirement(new PerkLevelRequirement('grenade damage 1')),
      (new AbilityPerkNode('grenade damage 3',    8, [6, 4]))
        .addRequirement(new PerkLevelRequirement('grenade accuracy')),
      (new MaxxedAbilityPerkNode('triple grenade',   6, [6, 5]))
        .addRequirement(new PerkLevelRequirement('double grenade')),
      (new AbilityPerkNode('grenade area',        5, [6, 6]))
        .addRequirement(new PerkLevelRequirement('grenade damage 2')),
    ];
    return perkList;
  }

  static GetAimOffsets() {
    return {x: 0, y: -30 * 8};
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[1] = AbilityCore1;
