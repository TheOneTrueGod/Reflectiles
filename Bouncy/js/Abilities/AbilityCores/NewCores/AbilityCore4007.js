// TODO:
// [] Change the icon
// [] Change the cooldown
// [] Change the style
// [] Change the rawAbil
class AbilityCore4007 extends AbilityCore {
  static BuildAbilityChild(level) {
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 0.1));
    const rawAbil = {
      name: 'Landmines',
      description: 'Creates [[unit_count]] landmines<br>' +
        'If a unit steps on one, it explodes dealing [[unit_abilities[0].abil_def.hit_effects[0].base_damage]] damage in an area<br>' +
        'They last for [[duration]] turns.<br>Limited range.',
      card_text_description: '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]]',
      zone_tooltip_name: 'Landmine',
      zone_tooltip_description: 'After enemy ends their movement on a landmine, it explodes dealing  ' +
        '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]] damage in a 3x3 box.<br>',
      ability_type: AbilityDef.AbilityTypes.CREATE_UNIT,
      area_type: SummonUnitAbilityDef.AREA_TYPES.LINE,
      unit_count: 5,
      duration: 5,
      unit: SummonUnitAbilityDef.UNITS.LANDMINE,
      sprite: {texture: 'deployables', index: 5},
      unit_abilities: [{
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.POSITION,
          projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
          hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: hitDamage, aoe_type: "BOX"}],
        }
      }],
      max_range: {top: 4, bottom: -1, left: 3, right: 3},
      icon: "/Bouncy/assets/icons/landmine.png",
    };

    let cooldown = this.getCooldown();
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    return AbilityDef.createFromJSON(rawAbil);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 5, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }
}

AbilityCore.coreList[4007] = AbilityCore4007;
