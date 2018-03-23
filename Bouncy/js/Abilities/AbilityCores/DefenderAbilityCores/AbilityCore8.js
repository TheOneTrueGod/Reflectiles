// Fire some ice shards when shooting.  The ice shards deal damage
//   - Ice shards pierce once
// Create an ice block in squares in AoE that have no enemies
//   - Increase ice block health
// Create 3x1 wall of ice blocks in front of yourself
// Increase stun time by 1 turn
class AbilityCore8 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    const rawAbil = {
      name: 'Freeze',
      description: 'Freezes a 3x1 square of enemies for [[hit_effects[1].duration]] turns',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects: [
        {effect: ProjectileShape.HitEffects.DAMAGE, base_damage: 100, aoe_type: "BOX", aoe_size: {x: [-1, 1], y: [0, 0]}},
        {effect: ProjectileShape.HitEffects.FREEZE, duration: 3, aoe_type: "BOX", aoe_size: {x: [-1, 1], y: [0, 0]}}
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
