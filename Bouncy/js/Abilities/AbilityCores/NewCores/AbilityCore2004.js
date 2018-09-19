class AbilityCore2004 extends AbilityCore {
  static BuildAbilityChild(level) {
    let damage = Math.round(NumbersBalancer.getAbilityDamage(level, 0.15));
    let armorDamage = Math.round(NumbersBalancer.getAbilityDamage(level, 0.25));
    const rawAbil = {
      name: 'Hammer',
      description: 'Swing your hammer in a wide arc, hitting all units in front of you for <<' + damage + '>> anti-armor damage, and <<' + damage + '>> damage.',
      card_text_description: '[[timeout_effects[0].abil_def.hit_effects[0].base_damage]]',
      charge: {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.INSTANT_AOE,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects: [
        {
          effect: ProjectileShape.HitEffects.DAMAGE,
          base_damage: armorDamage,
          damage_type: Unit.DAMAGE_TYPE.ANTI_ARMOR,
          aoe_type: ProjectileShape.AOE_TYPES.BOX,
          aoe_size: {x:[-1, 1], y:[-1, 0]}
        },
        {
          effect: ProjectileShape.HitEffects.DAMAGE,
          base_damage: damage,
          aoe_type: ProjectileShape.AOE_TYPES.BOX,
          aoe_size: {x:[-1, 1], y:[-1, 0]}
      }],
      max_range: {
        left: 1,
        right: 1,
        top: 1, bottom: 0
      },
      icon: "/Bouncy/assets/icons/hammer-drop.png",
    };

    let cooldown = this.getCooldown();
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    rawAbil.style = this.createAbilityStyle().build();
    return AbilityDef.createFromJSON(rawAbil);
  }

  static createAbilityStyle() {
    return (new AbilitySheetSpriteAbilityStyleBuilder())
      .setExplosion(AbilityStyle.getExplosionPrefab(
        AbilityStyle.EXPLOSION_PREFABS.IMPACT
      ));
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }
}

AbilityCore.coreList[2004] = AbilityCore2004;
