class AbilityCore4008 extends AbilityCore {
  static BuildAbilityChild(level) {
    let damagePerTurn = Math.floor(NumbersBalancer.getAbilityDamage(level, 0.15));
    const rawAbil = {
      name: 'Poison Dart',
      description: 'Shoots a dart that poisons a target for <<' + damagePerTurn + '>> poison damage.',
      card_text_description: "<<" + damagePerTurn + ">> Poison",
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [],
      wall_bounces: 1,
      speed: 8,
      hit_effects: [
        {
          damage: damagePerTurn,
          duration: -1,
          effect: ProjectileShape.HitEffects.POISON,
        }
      ],

      icon: "/Bouncy/assets/icons/poison-dart.png",
      action_phase: TurnPhasesEnum.PLAYER_MINOR,
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
      .setSheet('weapons_sheet')
      .setCoordIndex(4, 0, 26, 25, 1)
      .setExplosion(AbilityStyle.getExplosionPrefab(AbilityStyle.EXPLOSION_PREFABS.POISON));
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }
}

AbilityCore.coreList[4008] = AbilityCore4008;
