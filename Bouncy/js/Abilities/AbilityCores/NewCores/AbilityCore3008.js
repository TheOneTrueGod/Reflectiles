// TODO:
// [] Change the icon
// [] Change the cooldown
// [] Change the style
// [] Change the rawAbil
class AbilityCore3008 extends AbilityCore {
  static BuildAbilityChild(level) {
    let num_bullets = 3;
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 0.75) / num_bullets);
    let health = 3;
    let duration = 1;
    const rawAbil = {
      name: 'Counterspell',
      description: 'Puts up a 3x1 arcane barrier that blocks up to [[health]] projectiles for the turn.  ' +
        'For each projectile blocked, the shield shoots three arcane blasts dealing <<' + hitDamage + '>> damage.',
      card_text_description: '3x1',
      zone_tooltip_name: 'Counterspell',
      zone_tooltip_description: 'Protects from bullets.  If the shield would be shot, it will retaliate with ' +
        '[[unit_interaction.unit_enter[0].abil_def.num_bullets]] blasts for ' +
        '[[unit_interaction.unit_enter[0].abil_def.hit_effects[0].base_damage]] damage each.',
      ability_type: AbilityDef.AbilityTypes.ZONE,
      unit_interaction: {
        prevent_unit_entry: false,
      },
      projectile_interaction: {enemy_projectiles: {destroy: true, ability: [{
        effect: ZoneAbilityDef.UnitEffectTypes.ABILITY,
        ability_source: ZoneAbilityDef.AbilitySources.CENTER_ZONE,
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.TRI_SHOT,
          projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
          min_angle: Math.PI / 3.0,
          max_angle: Math.PI / 3.0,
          duration: 50,
          num_bullets,
          curve_def: {
            type: ProjectileCurveHandler.CURVE_TYPES.TO_AIM_ANGLE,
            curve_time: 15,
          },
          speed: 6,
          hit_effects: [{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: hitDamage}],
        }
      }]}},
      duration,
      health,
      zone_size: {
        left: 1, right: 1,
        top: 0, bottom: 0, y_range: 0
      },
      max_range: {
        left: 2,
        right: 2,
        top: 1, bottom: 1
      },
      unit_enter_effect: {},
      zone_icon: 'zone_icon_shield',
      icon: "/Bouncy/assets/icons/counterspell.svg"
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
      .setSheet('weapons_sheet')
      .setCoordIndex(5, 0, 26, 25, 2)
      .setScale(1);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.CHAOS;
  }
}

AbilityCore.coreList[3008] = AbilityCore3008;
