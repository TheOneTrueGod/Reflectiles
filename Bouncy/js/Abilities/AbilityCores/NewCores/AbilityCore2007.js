// TODO:
// [] Change the weapon type
// [] Change the icon
// [] Change the cooldown
// [] Change the style
// [] Change the rawAbil
class AbilityCore2007 extends AbilityCore {
  static BuildAbilityChild(level) {
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1));
    const rawAbil = {
      name: '',
      description: '',
      card_text_description: '',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [],
      wall_bounces: 1,
      hit_effects: [
        {
          base_damage: hitDamage,
          effect: ProjectileShape.HitEffects.DAMAGE,
        }
      ],
      icon: "/Bouncy/assets/icons/icon_plain_explosion.png"
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
      .setCoordNums(2, 1, 24, 23);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }
}

AbilityCore.coreList[2007] = AbilityCore2007;
