class AbilityCore3004 extends AbilityCore {
  static BuildAbilityChild(level) {
    let num_bullets = 20;
    let return_num_bullets = 5;
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1.5) / (num_bullets + return_num_bullets) / 2);
    const rawAbil = {
      name: 'The Sprinkler',
      description: "Shoot a wave of <<" + (num_bullets + return_num_bullets) + ">> shots that deal <<" + hitDamage + ">> ",
      card_text_description: '[[num_bullets]] X [[hit_effects[0].base_damage]]',
      icon: "/Bouncy/assets/icons/icon_plain_wave.png",
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.WAVE,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [],
      collision_behaviours: [
        {behaviour: CollisionBehaviour.BOUNCE, count: 1},
      ],
      angle_spread: Math.PI / 2.5,
      num_bullets,
      return_num_bullets,
      return_shot_delay: 15,
      hit_effects: [{
        effect: ProjectileShape.HitEffects.DAMAGE,
        base_damage: hitDamage,
      }],
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
      .setSheet('bullet_sheet')
      .setCoordNums(274, 68, 295, 68 + 11)
      .setRotation(0);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 4, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.CHAOS;
  }
}

AbilityCore.coreList[3004] = AbilityCore3004;
