// To Replace;
// COOLDOWN_HERE = integer representing the cooldown of this ability
// CORE_NUMBER = integer of the core
class AbilityCoreCORE_NUMBER extends AbilityCore {
  static BuildAbilityChild(perkList, perkPcts, perkCounts) {

    const rawAbil = {
      name: 'Explosion',
      description: 'Description Goes Here ',
      card_text_description: 'Card Text 3x3',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.CHAIN_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: true,
      num_bullets: 10,
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

    let cooldown = this.getCooldown(perkList, perkCounts);
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    rawAbil.style = abilityStyle.build();
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

  static getCooldown(perkList, perkCounts) {
    return {initial_charge: -1, max_charge: COOLDOWN_HERE, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCoreCORE_NUMBER.coreList[0] = AbilityCoreCORE_NUMBER;
