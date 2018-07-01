class AbilityCoreNUMBER extends AbilityCore {
  static BuildAbilityChild(level) {
    const rawAbil = {};

    let cooldown = this.getCooldown();
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    rawAbil.style = this.createAbilityStyle().build();
    return AbilityDef.createFromJSON(rawAbil);
  }

  static createAbilityStyle() {
    return (new AbilitySheetSpriteAbilityStyleBuilder())
      .setSheet('weapons_sheet')
      .setCoordNums(2, 1, 24, 23)
      .setExplosion(AbilityStyle.getExplosionPrefab(
        AbilityStyle.EXPLOSION_PREFABS.WHITE, explosionRadius
      ));
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCoreNUMBER.coreList[0] = AbilityCoreNUMBER;
