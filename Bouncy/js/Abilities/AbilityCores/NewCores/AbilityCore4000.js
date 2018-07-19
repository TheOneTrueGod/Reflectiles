class AbilityCore4000 extends AbilityCore {
  static BuildAbilityChild(level) {
    let numTargets = 5;
    let totalDamage = NumbersBalancer.getAbilityDamage(level, 1) / numTargets;
    let impactDamage = Math.floor(totalDamage * 0.25);
    let poisonDamage = Math.floor(totalDamage * 0.5);

    const rawAbil = { // 1000 damage.  500 more per turn
      name: 'Poison Drill',
      description: 'Shoots a projectile that passes through enemies.<br>' +
        'It deals <<' + impactDamage + '>> damage, ' +
        'and poisons them for <<' + poisonDamage + '>> poison damage.',
      card_text_description: '[[num_hits]] X <<' + impactDamage + '>>',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      collision_behaviours: [
        {behaviour: CollisionBehaviour.PASSTHROUGH, count: numTargets - 1},
      ],
      wall_bounces: 2,
      num_hits: numTargets,
      icon: "/Bouncy/assets/icons/icon_plain_drill.png",
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: impactDamage
      },{
        effect: ProjectileShape.HitEffects.POISON,
        damage: poisonDamage,
      }],
      charge: {"initial_charge":-1, "max_charge":4, "charge_type":"TURNS"}
    };

    let cooldown = this.getCooldown();
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    rawAbil.style = this.createAbilityStyle().build();
    return AbilityDef.createFromJSON(rawAbil);
  }

  static createAbilityStyle() {
    return (new AbilitySheetSpriteAbilityStyleBuilder)
      .setSheet('bullet_sheet')
      .setCoordNums(29, 301, 37, 320)
      .setRotation(Math.PI / 2);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }
}

AbilityCore.coreList[4000] = AbilityCore4000;
