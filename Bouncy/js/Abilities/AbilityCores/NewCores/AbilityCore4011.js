// TODO:
// [] Change the style
class AbilityCore4011 extends AbilityCore {
  static BuildAbilityChild(level) {
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1));
    const rawAbil = {
      name: 'Spread the Sickness',
      description: `Take half of the <<poison>> and <<freeze>> currently on an enemy, and apply them to the enemy units adjacent to it`,
      card_text_description: `${hitDamage}`,
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [],
      wall_bounces: 1,
      hit_effects: [
        {
          base_damage: hitDamage,
          effect: ProjectileShape.HitEffects.SPREAD_DEBUFFS,
          debuff_list: {
            [PoisonStatusEffect.name]: 0.5,
            [FreezeStatusEffect.name]: 0.5,
          },
        },
        {
          // To get the effect to show up
          damage: 0,
          effect: ProjectileShape.HitEffects.POISON,
          aoe_type: "BOX",
          aoe_size: { x:[-1, 1], y:[-1, 1] },
        },
      ],
      icon: "/Bouncy/assets/icons/deathcap.png"
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
    return {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }
}

AbilityCore.coreList[4011] = AbilityCore4011;
