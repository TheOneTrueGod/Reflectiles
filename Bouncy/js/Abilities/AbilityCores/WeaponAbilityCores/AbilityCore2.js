class AbilityCore2 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    const CENTER_WAVES = 5;
    const CENTER_BULLETS = 2 + idx(perkCounts, 'center bullets 3', 0);
    let damagePerkPct = (
      idx(perkPcts, 'damage 0', 0) +
      idx(perkPcts, 'damage 1', 0) +
      idx(perkPcts, 'damage 3', 0) +
      idx(perkPcts, 'damage 32', 0) * 2 +
      idx(perkPcts, 'damage 5', 0) +
      idx(perkPcts, 'damage 6', 0) +
      idx(perkPcts, 'damage 6-2', 0) * 2 +
      idx(perkPcts, 'damage 7', 0) * 2 +
      idx(perkPcts, 'damage 7-2', 0) * 2
    ) / 14;
    let bulletCountPerkPct = (
        idx(perkPcts, 'more bullets 0', 0) +
        idx(perkPcts, 'more bullets 1', 0) +
        idx(perkPcts, 'more bullets 1-2', 0) +
        idx(perkPcts, 'more bullets 2', 0) * 2 +
        idx(perkPcts, 'more bullets 5', 0) +
        idx(perkPcts, 'more bullets 6', 0) * 2 +
        idx(perkPcts, 'more bullets 7', 0) * 2
      ) / 9;
    let tighterSpreadPerkPct = (
      idx(perkPcts, 'tighter spread 2', 0) +
      idx(perkPcts, 'tighter spread 6', 0) +
      idx(perkPcts, 'tighter spread 7', 0)
    ) / 3;

    let totalDamage = lerp(1500, 6000, (damagePerkPct * 3 + bulletCountPerkPct) / 4);
    if (this.hasPerk(perkPcts, 'enemy bounce 3')) {
      totalDamage *= AbilityConstants.BOUNCE_DAMAGE_PENALTY;
    }
    let num_bullets = Math.floor(lerp(10, 45, bulletCountPerkPct)) * 2;
    let damageDivisor = num_bullets;
    if (this.hasPerk(perkPcts, 'center wave')) {
      damageDivisor += (CENTER_WAVES * CENTER_BULLETS);
    }
    let damage = Math.floor(totalDamage / damageDivisor);
    let shot_delay = Math.round(lerp(4.5, 2, bulletCountPerkPct));
    let destroy_on_wall = true;
    if (this.hasPerk(perkPcts, 'wall bounce 3')) {
      destroy_on_wall = [BorderWallLine.TOP];
    }

    let angle_spread = lerp(Math.PI / 3.0, Math.PI / 1.5, bulletCountPerkPct - tighterSpreadPerkPct);
    let angle_offset = lerp(-Math.PI / 16.0, -Math.PI / 4.0, bulletCountPerkPct - tighterSpreadPerkPct);
    let styleBuilder = (new AbilitySheetSpriteAbilityStyleBuilder)
      .setSheet('bullet_sheet').setCoordNums(274, 68, 295, 79).setRotation(0);

    let collisionBehaviours = [];
    if (this.hasPerk(perkPcts, 'enemy bounce 3')) {
      totalDamage *= AbilityConstants.BOUNCE_DAMAGE_PENALTY;
      collisionBehaviours.push(
        {behaviour: CollisionBehaviour.BOUNCE, count: 1}
      );
    }
    let hitEffects = [{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: damage}];
    let rageDescription = '';
    if (this.hasPerk(perkPcts, 'rage buff 3')) {
      let rageEffect = {
        effect: ProjectileShape.HitEffects.SHOOTER_BUFF,
        effect_max: 1.1 + (this.hasPerk(perkPcts, 'rage amount 4') ? 0.1 : 0),
        effect_gain: 0.002,
        effect_base: 1,
        duration: 1 + (this.hasPerk(perkPcts, 'rage duration 4') ? 1 : 0),
      };
      hitEffects.push(rageEffect);
      rageDescription = "Every bullet that hits an enemy increases your damage by " +
        "<<" + (rageEffect.effect_gain * 100) + ">>% up to a maximum of <<" + Math.floor(rageEffect.effect_max * 100 - 100) + ">>% " +
        "for the next <<" + rageEffect.duration + ">> turn" + (rageEffect.duration > 1 ? "s" : '') +
        "<br>";
    }

    const rawAbil = { // 1440 damage
      name: 'Double Wave',
      description: 'Sprays [[child_abilities[0].num_bullets]] bullets that deal [[child_abilities[0].hit_effects[0].base_damage]] damage in two waves.<br>' +
        (this.hasPerk(perkPcts, 'center wave') ? 'Also shoots [[child_abilities[1].num_bullets]] bullets in <<' + CENTER_WAVES + '>> waves down the center.<br>' : '') +
        rageDescription,
      card_text_description: '[[child_abilities[0].num_bullets]] X [[child_abilities[0].hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.MULTIPART,
      icon: "/Bouncy/assets/icons/icon_plain_wave.png",
      charge: {"initial_charge":-1, "max_charge": 5, "charge_type":"TURNS"},
      child_abilities: [
        {
          style: styleBuilder.build(),
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.DOUBLE_WAVE,
          projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
          num_bullets: num_bullets,
          return_num_bullets: 0,
          destroy_on_wall: destroy_on_wall,
          hit_effects: hitEffects,
          angle_spread: angle_spread,
          angle_offset: angle_offset,
          shot_delay: shot_delay,
          collision_behaviours: collisionBehaviours,
        }
      ],
    };
    if (this.hasPerk(perkPcts, 'center wave')) {
      for (var i = 0; i < CENTER_WAVES; i++) {
        let centerShot = {
          timing_offset: 10 * i,
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.TRI_SHOT,
          style: styleBuilder.build(),
          projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
          num_bullets: CENTER_BULLETS,
          min_angle: Math.PI / 16.0,
          max_angle: Math.PI / 16.0,
          collision_behaviours: collisionBehaviours,
          hit_effects: hitEffects,
        }
        rawAbil.child_abilities.push(centerShot);
      }
    }

    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetPerkList() {
    let perkList = [
      // Level 0
      (new AbilityPerkNode('more bullets 0',        3, [0, 2])),
      (new AbilityPerkNode('damage 0',              3, [0, 4])),
      // Level 1
      (new AbilityPerkNode('more bullets 1',        3, [1, 1]))
        .addRequirement(new PerkLevelRequirement('more bullets 0')),
      (new AbilityPerkNode('damage 1',              3, [1, 3]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('more bullets 0'),
          new PerkLevelRequirement('damage 0')]
        )),
      (new MaxxedAbilityPerkNode('more bullets 1-2',     3, [1, 5]))
        .addRequirement(new PerkLevelRequirement('damage 0')),
      // Level 2
      (new AbilityPerkNode('tighter spread 2',      2, [2, 2]))
        .addRequirement(new PerkLevelRequirement('more bullets 1')),
      (new AbilityPerkNode('more bullets 2',        6, [2, 4]))
        .addRequirement(new PerkLevelRequirement('more bullets 1-2')),
      (new MaxxedAbilityPerkNode('center wave',     2, [2, 6]))
        .addRequirement(new PerkLevelRequirement('damage 0')),
      // Level 3
      (new AbilityPerkNode('damage 3',              3, [3, 0]))
        .addRequirement(new PerkLevelRequirement('more bullets 1')),
      (new MaxxedAbilityPerkNode('wall bounce 3',   2, [3, 1]))
        .addRequirement(new PerkLevelRequirement('more bullets 1')),
      (new MaxxedAbilityPerkNode('rage buff 3',     2, [3, 3]))
        .addRequirement(new PerkLevelRequirement('damage 1')),
      (new AbilityPerkNode('damage 32',             6, [3, 4]))
        .addRequirement(new PerkLevelRequirement('more bullets 2')),
      (new MaxxedAbilityPerkNode('enemy bounce 3',  2, [3, 5]))
        .addRequirement(new PerkLevelRequirement('more bullets 1-2')),
      (new AbilityPerkNode('center bullets 3',      3, [3, 6]))
        .addRequirement(new PerkLevelRequirement('center wave')),
      // Level 4
      (new MaxxedAbilityPerkNode('rage duration 4', 2, [4, 2]))
        .addRequirement(new PerkLevelRequirement('rage buff 3')),
      (new MaxxedAbilityPerkNode('rage amount 4',   2, [4, 4]))
        .addRequirement(new PerkLevelRequirement('rage buff 3')),
      // Level 5
      (new AbilityPerkNode('more bullets 5',        3, [5, 1]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('damage 3'),
          new PerkLevelRequirement('wall bounce 3')]
        )),
      (new AbilityPerkNode('damage 5',               3, [5, 5]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('enemy bounce 3'),
          new PerkLevelRequirement('center bullets 3'),
          new PerkLevelRequirement('rage amount 4')]
        )),
      // Level 6
      (new AbilityPerkNode('more bullets 6',         6, [6, 0]))
        .addRequirement(new PerkLevelRequirement('more bullets 5')),
      (new AbilityPerkNode('damage 6',               3, [6, 2]))
        .addRequirement(new OrPerkLevelRequirement(
          [new PerkLevelRequirement('rage buff 3'),
          new PerkLevelRequirement('more bullets 5')]
        )),
      (new AbilityPerkNode('damage 6-2',        6, [6, 4]))
        .addRequirement(new PerkLevelRequirement('damage 5')),
      (new AbilityPerkNode('tighter spread 6',       2, [6, 6]))
        .addRequirement(new PerkLevelRequirement('damage 5')),
      // Level 7
      (new AbilityPerkNode('damage 7',               6, [7, 1]))
        .addRequirement(new PerkLevelRequirement('damage 6')),
      (new AbilityPerkNode('tighter spread 7',       3, [7, 2]))
        .addRequirement(new PerkLevelRequirement('damage 6')),
      (new AbilityPerkNode('more bullets 7',       6, [7, 3]))
        .addRequirement(new PerkLevelRequirement('damage 6')),
      (new AbilityPerkNode('damage 7-2',             6, [7, 5]))
        .addRequirement(new PerkLevelRequirement('damage 5')),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[2] = AbilityCore2;
