class AbilityCore25 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    let damage = lerp(150, 1400, (
      idx(perkPcts, 'damage 1', 0) +
      idx(perkPcts, 'damage 2', 0) * 2 +
      idx(perkPcts, 'damage 3', 0) * 3 +
      idx(perkPcts, 'damage 4', 0) * 3
    ) / 9
    );

    damage = Math.floor(damage);

    let hit_effects =
      [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: damage,
        aoe_type: ProjectileShape.AOE_TYPES.BOX,
        aoe_size: {x:[-1, 1], y:[-1, 0]}
      }];

    let description = 'Swing your hammer in a wide arc, hitting all units in front of you for <<' + damage + '>> damage.';

    if (this.hasPerk(perkPcts, 'freeze')) {
      hit_effects.push({
        effect: ProjectileShape.HitEffects.FREEZE,
        duration: 1,
        aoe_type: ProjectileShape.AOE_TYPES.BOX,
        aoe_size: {x:[-1, 1], y:[-1, 0]}
      });

      description += "<br>Freezes all units hit for one turn.";
    };

    const rawAbil = {
      name: 'Hammer',
      description,
      card_text_description: '[[timeout_effects[0].abil_def.hit_effects[0].base_damage]]',
      charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.INSTANT_AOE,
      style: (new AbilitySheetSpriteAbilityStyleBuilder())
        .setExplosion(AbilityStyle.getExplosionPrefab(
          AbilityStyle.EXPLOSION_PREFABS.IMPACT
        ))
        .build(),
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects,
      max_range: {
        left: 1,
        right: 1,
        top: 1 + this.hasPerk(perkPcts, 'range up'), bottom: 0
      },
      icon: "/Bouncy/assets/icons/hammer-drop.png",
      charge: this.getCooldown(perkList, perkPcts),
    };
    return AbilityDef.createFromJSON(rawAbil);
  }

  static getCooldown(perkList, perkPcts) {
    let perkCount = perkList.length;
    let cooldown = 2 + this.hasPerk(perkPcts, 'freeze');

    cooldown = Math.round(cooldown);
    if (cooldown <= 1) {
      return null;
    }

    return {initial_charge: -1, max_charge: cooldown, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetPerkList() {
    let perkList = [
      (new AbilityPerkNode('damage 1', 10, [0, 3])),
      (new MaxxedAbilityPerkNode('freeze', 5, [1, 2]))
        .addRequirement(new PerkLevelRequirement('damage 1')),
      (new AbilityPerkNode('damage 2', 15, [2, 3]))
        .addRequirement(new PerkLevelRequirement('damage 1', 'max')),
      (new MaxxedAbilityPerkNode('range up', 5, [3, 4]))
        .addRequirement(new PerkLevelRequirement('damage 2')),
      (new AbilityPerkNode('damage 3', 15, [4, 3]))
        .addRequirement(new PerkLevelRequirement('damage 2', 'max')),
      (new MaxxedAbilityPerkNode('width up', 5, [5, 2]))
        .addRequirement(new PerkLevelRequirement('damage 3')),
      (new MaxxedAbilityPerkNode('height up', 5, [5, 4]))
        .addRequirement(new PerkLevelRequirement('damage 3')),
      (new AbilityPerkNode('damage 4', 20, [6, 3]))
        .addRequirement(new PerkLevelRequirement('damage 3', 'max')),
    ];
    return perkList;
  }

  static GetDemoUnits() {
    return  [
      [null, null, UnitShooter, UnitBasicSquare, UnitShooter],
      [null, null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [null, null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [null, null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [null, null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [null, null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
    ];
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }
}

AbilityCore.coreList[25] = AbilityCore25;
