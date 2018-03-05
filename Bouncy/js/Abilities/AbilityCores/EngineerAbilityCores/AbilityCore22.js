class AbilityCore22 extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    const rawAbil = {
      name: 'Focused Fire',
      description: 'Shoots a shot, and commands all of your turrets to fire at your target.  This reduces their cooldowns if they are unable to fire.<br>' +
        'It deals [[hit_effects[0].base_damage]] damage.<br>It also makes all of your turrets aim where you are aiming.',
      card_text_description: '[[hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      special_effects: [AbilityDef.SPECIAL_EFFECTS.TURRET_AIM, AbilityDef.SPECIAL_EFFECTS.TURRET_FIRE],
      icon: "/Bouncy/assets/icons/targeting.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: 200
      }],
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
    return CardDeckTypes.ENGINEER;
  }
}

AbilityCore.coreList[22] = AbilityCore22;
