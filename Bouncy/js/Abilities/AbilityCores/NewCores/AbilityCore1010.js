// TODO:
// [] Change the icon
class AbilityCore1010 extends AbilityCore {
  static BuildAbilityChild(level) {
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 0.1));
    const rawAbil = {
      name: 'Pistol',
      description: `Fire a quick shot dealing <<${hitDamage}>> damage`,
      card_text_description: `${hitDamage}`,
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,

      speed: 40,
      destroy_on_wall: [],
      wall_bounces: 1,
      hit_effects: [
        {
          base_damage: hitDamage,
          effect: ProjectileShape.HitEffects.DAMAGE,
        }
      ],
      icon: "/Bouncy/assets/icons/pistol.png",
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
    return (new AbilitySheetSpriteAbilityStyleBuilder())
      .setSheet('bullet_sheet')
      .setCoordNums(0, 0, 1, 1)
      .setRotation(0)
      .fixRotation(true)
      .setTrailDef({ type: ProjectileTrailDef.TRAIL_TYPES.LINE, duration: 7, color: 0x888888, options: { width: 4 } });
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 3, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[1010] = AbilityCore1010;
