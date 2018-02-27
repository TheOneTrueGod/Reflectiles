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
    let perkResults = this.BuildPerkDetails(perkList); let perkPcts = perkResults.perkPcts; let perkCounts = perkResults.perkCounts;

    let shape = ProjectileAbilityDef.Shapes.CHAIN_SHOT;

    let rocketCount = 1 + idx(perkCounts, 'rocket count4', 0) + idx(perkCounts, 'rocket count8', 0);
    let isClusterRocket = idx(perkPcts, 'cluster rocket') === 1;
    let isIncindiary = idx(perkPcts, 'incindiary') === 1;

    let damagePctIncrease =
      idx(perkPcts, 'damage1', 0) * 0.25 +
      idx(perkPcts, 'damage2', 0) * 0.5 +
      idx(perkPcts, 'damage3', 0) * 0.25 +
      idx(perkPcts, 'damage radius5', 0) * 0.1 +
      idx(perkPcts, 'damage4', 0) * 0.5 +
      idx(perkPcts, 'damage5', 0) * 0.25 +
      idx(perkPcts, 'damage8', 0) * 0.5 +
      idx(perkPcts, 'damage82', 0) * 0.5 +
      idx(perkPcts, 'damage6', 0) * 0.25;

    let impactCount = idx(perkCounts, 'impact2', 0) + idx(perkCounts, 'impact5', 0);

    let radiusIncrease =
      idx(perkPcts, 'radius2', 0) * 0.5 +
      idx(perkPcts, 'damage radius5', 0) * 0.5;

    let explosionRadius = 40 * (1 + radiusIncrease);
    let projectileSpeed = 8;
    let incindiaryPct = 0;

    if (isClusterRocket) {
      rocketCount = 10 + 5 * rocketCount;
      explosionRadius /= 2;
      damagePctIncrease += 1;
    }

    if (isIncindiary) {
      incindiaryPct = 0.5 + idx(perkPcts, 'fire damage', 0) * 0.5;
    }

    explosionRadius = Math.round(explosionRadius);

    let base_damage = Math.round(200 * (1 + damagePctIncrease) / ((rocketCount - 1) * 0.75 + 1));
    let impact_damage = Math.round(base_damage * (impactCount / 10));
    let incindiary_damage = Math.round(base_damage * incindiaryPct);
    base_damage -= impact_damage / 4;
    base_damage -= incindiary_damage / 4;
    base_damage = Math.max(Math.round(base_damage), 0);

    let abilityStyle = (new AbilitySheetSpriteAbilityStyleBuilder())
      .setSheet('weapons_sheet')
      .setCoordNums(2, 1, 24, 23)
      .setExplosion(AbilityStyle.getExplosionPrefab(
        AbilityStyle.EXPLOSION_PREFABS.WHITE, explosionRadius
      ));

    let fire_size_upgrades = idx(perkCounts, 'fire radius', 0);
    let fireSquaresHit = AbilityCore0.getFireZoneSize(fire_size_upgrades);
    fireSquaresHit = (1 + fireSquaresHit[0] + fireSquaresHit[2]) * (1 + fireSquaresHit[1] + fireSquaresHit[3]);
    const rawAbil = {
      name: 'Explosion',
      description: 'Fires ' +
        (rocketCount == 1 ? 'a rocket that deals ' : '[[num_bullets]] rockets that deal ') +
        (impact_damage > 0 ? '[[hit_effects[0].base_damage]] to the first unit hit, and ' : '') +
        '[[hit_effects[1].base_damage]] damage in a circle of size [[hit_effects[1].aoe_size]].' +
        (isIncindiary ? '<br>Leaves behind a fire zone that deals [[hit_effects[2].abil_def.phase_effects[0].abil_def.hit_effects[0].base_damage]] damage per turn for [[hit_effects[2].abil_def.duration]] turns.  The fire hits <<' + fireSquaresHit + '>> square' + (fireSquaresHit > 1 ? 's' : '') + '.' : ''),
      card_text_description: '[[hit_effects[1].base_damage]] 3x3',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: shape,
      speed: projectileSpeed,
      scale: 0.5,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: true,
      num_bullets: rocketCount,
      accuracy_decay: Math.PI / 32.0,
      hit_effects: [
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

    if (isClusterRocket) {
      rawAbil.shape = ProjectileAbilityDef.Shapes.RAIN;
      rawAbil.speed_decay = 0.9;
      rawAbil.gravity = {x: 0, y: -0.9};
      rawAbil.shots_per_tick = 1;
      abilityStyle.setScale(0.75);
    }

    if (isIncindiary) {
      rawAbil.hit_effects.push(AbilityCore0.getIncindiaryEffect(
        incindiary_damage, fire_size_upgrades
      ));
    } else {
      rawAbil.hit_effects.push({});
    }

    let cooldown = this.getCooldown(perkList);
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    rawAbil.style = abilityStyle.build();
    return AbilityDef.createFromJSON(rawAbil);
  }

  static getCooldown(perkList, perkCounts) {
    let perkCount = perkList.length;
    let cooldown = perkCount * 0.3 - 3;
    cooldown -= idx(perkCounts, 'recharge 4', 0);

    cooldown = Math.round(cooldown);
    if (cooldown <= 1) {
      return null;
    }

    return {initial_charge: -1, max_charge: cooldown, charge_type: "TURNS"};
  }

  static getIncindiaryEffect(incindiary_damage, fire_size_upgrades) {
    let size = AbilityCore0.getFireZoneSize(fire_size_upgrades);
    return {
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
            hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: incindiary_damage, aoe_type:"BOX", aoe_size: {"x":[-size[0], size[2]], y:[-size[1], size[3]]}}],
          },
        }],
        zone_size: {"left":size[0],"right":size[2],"top":size[1],"bottom":size[3],"y_range": 0},
        charge: {initial_charge: -1, max_charge: 3, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
      }
    };
  }

  static getFireZoneSize(fire_size_upgrades) {
    return [
      fire_size_upgrades >= 2 ? 1 : 0, // x1
      fire_size_upgrades >= 1 ? 1 : 0, // y1
      fire_size_upgrades >= 2 ? 1 : 0, // x2
      fire_size_upgrades >= 3 ? 1 : 0, // y2
    ];
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
      (new AbilityPerkNode('recharge 4', 8, [3, 3]))
        .addRequirement(new PerkLevelRequirement('damage3')),
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
      (new AbilityPerkNode('damage6', 3, [6, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('damage5'),
          new PerkLevelRequirement('damage radius5')]
        )),
      (new AbilityPerkNode('incindiary', 3, [6, 5]))
        .addRequirement(new PerkLevelRequirement('damage5')),

      // Level 8
      (new AbilityPerkNode('damage82', 3, [7, 2]))
        .addRequirement(new PerkLevelRequirement('cluster rocket')),
      (new AbilityPerkNode('rocket count8', 3, [7, 0]))
        .addRequirement(new PerkLevelRequirement('cluster rocket')),
      (new AbilityPerkNode('damage8', 3, [7, 4]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('incindiary'),
          new PerkLevelRequirement('damage6')]
        )),
      (new AbilityPerkNode('fire radius', 3, [7, 5]))
        .addRequirement(new PerkLevelRequirement('incindiary')),

      // Level 9
      (new AbilityPerkNode('fire damage', 3, [7, 6]))
        .addRequirement(new PerkLevelRequirement('incindiary')),

    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[0] = AbilityCore0;
