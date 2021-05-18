// TODO:
// [] Change the style
// [] Change the rawAbil
class AbilityCore5000 extends AbilityCore {
  static BuildAbilityChild(level) {
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1));
    const rawAbil = {
      name: 'Meteor',
      description: `Deal ${hitDamage} damage in a 3x3 area`,
      card_text_description: `${hitDamage}`,
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.INSTANT_AOE,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects: [{
        damage: hitDamage,
        effect: ProjectileShape.HitEffects.DAMAGE,
        aoe_type: "BOX",
        aoe_size: { x:[-1, 1], y:[-1, -1] },
      }],
      max_range: {
        left: 4,
        right: 4,
        top: 4, bottom: 1
      },
      icon: "/Bouncy/assets/icons/meteor.png"
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
    return {initial_charge: -1, max_charge: 3, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.EARTHMASTER;
  }
}

AbilityCore.coreList[5000] = AbilityCore5000;
