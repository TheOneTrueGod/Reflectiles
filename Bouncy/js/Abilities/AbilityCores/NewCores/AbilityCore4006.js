// TODO:
// [] Change the icon
// [] Change the cooldown
// [] Change the style
// [] Change the rawAbil
class AbilityCore4006 extends AbilityCore {
  static BuildAbilityChild(level) {
    let duration = 6;
    let shotCooldown = 1;
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 0.6)) / duration * shotCooldown;
    let explosionRadius = Math.floor(Unit.UNIT_SIZE);

    const rawAbil = {
      name: 'Cannon Turret',
      description: 'Create a cannon turret.<br>' +
        'It shoots every other turn, dealing [[unit_abilities[0].abil_def.hit_effects[0].base_damage]] damage in a small area.<br>' +
        'The turret lasts for [[duration]] turns, or until an enemy touches it or shoots it.' +
        '<br>Limited range.',
      card_text_description: '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]] / 2 turn',
      zone_tooltip_name: 'Cannon Turret',
      zone_tooltip_description: 'Shoots a bullet every turn that explodes, dealing ' +
        '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]] damage in a 3x3 box.<br>' +
        'If an enemy moves into the turret, the turret is destroyed.',
      ability_type: AbilityDef.AbilityTypes.CREATE_UNIT,
      duration,
      turret_image: 4,
      projectile_interaction: {},
      unit_abilities: [{
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
          projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
          destroy_on_wall: [BorderWallLine.TOP],
          speed: 8,
          hit_effects:[{
            effect: ProjectileShape.HitEffects.DAMAGE,
            base_damage: hitDamage,
            aoe_type: ProjectileShape.AOE_TYPES.CIRCLE,
            aoe_size: explosionRadius,
          }],
          charge: {initial_charge: -1, max_charge: shotCooldown, charge_type: AbilityDef.CHARGE_TYPES.TURNS},
          style: this.createAbilityStyle(explosionRadius).build(),
        }
      }],
      max_range: {top: 2, bottom: -1, left: 2, right: 2},
      icon: "/Bouncy/assets/icons/cannon.png",
      max_summon: 2,
    };

    let cooldown = this.getCooldown();
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    return AbilityDef.createFromJSON(rawAbil);
  }

  static createAbilityStyle(explosionRadius) {
    return (new AbilitySheetSpriteAbilityStyleBuilder())
      .setSheet('weapons_sheet')
      .setCoordNums(2, 1, 24, 23)
      .setExplosion(AbilityStyle.getExplosionPrefab(
        AbilityStyle.EXPLOSION_PREFABS.WHITE, explosionRadius
      ));
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 3, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }
}

AbilityCore.coreList[4006] = AbilityCore4006;
