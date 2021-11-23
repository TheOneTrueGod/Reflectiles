// TODO:
// [] Change the icon
// [] Change the cooldown
// [] Change the style
// [] Change the rawAbil
class AbilityCore4014 extends AbilityCore {
  static BuildAbilityChild(level) {
    let duration = 2;
    let damage = Math.round(NumbersBalancer.getAbilityDamage(level, 0.2));
    const rawAbil = {
      name: 'Wall of Poison',
      description: 'Poisons all enemies in the same line as you inflicting <<' + damage + '>> poison on all enemies hit.',
      card_text_description: '[[timeout_effects[0].abil_def.hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.INSTANT_AOE,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects: [{
        damage: damage,
        duration: duration,
        effect: ProjectileShape.HitEffects.POISON,
        aoe_type: "BOX",
        aoe_size: {x:[-20, 20],y:[0, 0]},
      }],
      max_range: {
        left: 0,
        right: 0,
        top: 0, bottom: 0
      },
      icon: "/Bouncy/assets/icons/skills_poison/wave-crest.png",
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

AbilityCore.coreList[4014] = AbilityCore4014;
