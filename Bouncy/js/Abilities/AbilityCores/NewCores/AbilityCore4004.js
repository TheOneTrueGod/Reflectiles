class AbilityCore4004 extends AbilityCore {
  static BuildAbilityChild(level) {
    let duration = 2;
    let damage = Math.round(NumbersBalancer.getAbilityDamage(level, 1 / 6));
    const rawAbil = {
      name: 'Poison Breath',
      description: 'Exhale poison gas in a <<3>>x<<2>> area, inflicting <<' + damage + '>> poison on all enemies hit.',
      card_text_description: '[[timeout_effects[0].abil_def.hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.INSTANT_AOE,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects: [{
        damage: damage,
        duration: duration,
        effect: ProjectileShape.HitEffects.POISON,
        aoe_type: "BOX",
        aoe_size: {x:[-1, 1],y:[-1, 0]},
      }],
      max_range: {
        left: 2,
        right: 2,
        top: 3, bottom: 0
      },
      icon: "/Bouncy/assets/icons/foam.png",
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
      .setSheet('poison_sheet')
      .setCoords({left: 53, top: 85, right: 72, bottom: 93})
      .setExplosion(AbilityStyle.getExplosionPrefab(AbilityStyle.EXPLOSION_PREFABS.POISON))
      .setRotation(-Math.PI);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }

  static GetAimOffsets() {
    return {x: 0, y: -120};
  }

  static GetDemoUnits() {
    return  [
      [null, null, UnitBasicSquare, UnitShooter, UnitBasicSquare, null],
      [null, null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, null],
      [null, null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, null],
      [null, null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, null],
      [null, null, UnitBasicSquare, UnitShooter, UnitBasicSquare, null]
    ];
  }
}

AbilityCore.coreList[4004] = AbilityCore4004;
