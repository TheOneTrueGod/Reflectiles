// TODO:
// [] Change the icon
// [] Change the cooldown
// [] Change the style
// [] Change the rawAbil
class AbilityCore4010 extends AbilityCore {
  static BuildAbilityChild(level) {
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 0.1));
    let duration = 3;

    const rawAbil = {
      name: 'Deadly Poison',
      description: `Infects three target units in a <<3>>x<<1>> area with ${hitDamage} poison damage, and afflicts them with Deadly Poison for ${duration} turns, preventing poison damage from being reduced.`,
      card_text_description: `${hitDamage}`,
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [],
      wall_bounces: 1,
      hit_effects: [
        {
          damage: hitDamage,
          effect: ProjectileShape.HitEffects.POISON,
          aoe_type: "BOX",
          aoe_size: { x:[-1, 1], y:[0, 0] },
        },
        {
          duration: duration,
          effect: ProjectileShape.HitEffects.SPECIAL_STATUS,
          special_effect: SpecialStatusEffect.SPECIAL_EFFECTS.DEADLY_POISON,
          aoe_type: "BOX",
          aoe_size: { x:[-1, 1], y:[0, 0] },
        }
      ],
      icon: "/Bouncy/assets/icons/help.png"
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
    return {initial_charge: -1, max_charge: 4, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }
}

AbilityCore.coreList[4010] = AbilityCore4010;
