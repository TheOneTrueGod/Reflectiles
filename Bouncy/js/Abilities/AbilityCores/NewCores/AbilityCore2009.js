// TODO:
// [] Change the icon
// [] Change the cooldown
// [] Change the style
// [] Change the rawAbil
class AbilityCore2009 extends AbilityCore {
  static BuildAbilityChild(level) {
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1));
    const rawAbil = {
      name: 'Assasinate',
      description: 'Deal <<' + hitDamage + '>> damage to a single unit with a well-placed knife.  Very short range.',
      card_text_description: '<<' + hitDamage + '>>',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [],
      wall_bounces: 1,
      duration: 10,
      speed: 8,
      hit_effects: [
        {
          base_damage: hitDamage,
          effect: ProjectileShape.HitEffects.DAMAGE,
        }
      ],
      icon: "/Bouncy/assets/icons/backstab.png"
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
      .setSheet('weapons_sheet')
      .setCoordNums(54, 2, 75, 23);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 4, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }
}

AbilityCore.coreList[2009] = AbilityCore2009;
