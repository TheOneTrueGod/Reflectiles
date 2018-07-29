// TODO:
// [] Change the weapon type
// [] Change the icon
// [] Change the cooldown
// [] Change the style
// [] Change the rawAbil
class AbilityCore2005 extends AbilityCore {
  static BuildAbilityChild(level) {
    let num_bullets = 12;
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1.8) / num_bullets);
    const rawAbil = {
      name: 'Shatter',
      description: 'Shoot <<' + num_bullets + '>> spikes in a circle around you.  Each one deals <<' + hitDamage + '>> damage.',
      card_text_description: '[[num_bullets]] X <<' + hitDamage + '>>',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      destroy_on_wall: [BorderWallLine.BOTTOM],
      gravity: {x: 0, y: 0},
      num_bullets,
      wall_bounces: 1,
      angle_start: Math.PI / 2,
      speed_decay: {x: 0.98, y: 0.98},
      duration: 40,
      speed: 8,
      hit_effects: [
        {
          base_damage: hitDamage,
          effect: ProjectileShape.HitEffects.DAMAGE,
        }
      ],
      icon: "/Bouncy/assets/icons/shatter.png"
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
      .setCoordIndex(3, 0, 26, 25, 1);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.DEFENDER;
  }
}

AbilityCore.coreList[2005] = AbilityCore2005;
