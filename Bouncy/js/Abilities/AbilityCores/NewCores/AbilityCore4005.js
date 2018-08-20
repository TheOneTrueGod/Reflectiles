class AbilityCore4005 extends AbilityCore {
  static BuildAbilityChild(level) {
    let duration = 5;
    let hitDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1)) / duration;
    const rawAbil = {
      name: 'Gun Turret',
      description: 'Create a turret.<br>' +
        'It shoots every turn, dealing [[unit_abilities[0].abil_def.hit_effects[0].base_damage]] damage.<br>' +
        'The turret lasts for [[duration]] turns, or until an enemy touches it or shoots it.' +
        '<br>Limited range.',
      card_text_description: '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]] / turn',
      zone_tooltip_name: 'Gun Turret',
      zone_tooltip_description: 'Shoots a bullet every turn for ' +
        '[[unit_abilities[0].abil_def.hit_effects[0].base_damage]] damage.<br>' +
        'If an enemy moves into the turret, the turret is destroyed.',
      ability_type: AbilityDef.AbilityTypes.CREATE_UNIT,
      duration,
      turret_image: 3,
      projectile_interaction: {enemy_projectiles: {destroy: true}},
      unit_abilities: [{
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
          projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
          destroy_on_wall: [BorderWallLine.TOP],
          speed: 8,
          hit_effects:[{effect: ProjectileShape.HitEffects.DAMAGE, base_damage: hitDamage}],
          style: this.createAbilityStyle().build(),
        }
      }],
      max_range: {top: 2, bottom: -1, left: 2, right: 2},
      icon: "/Bouncy/assets/icons/turret.png",
      max_summon: 2,
    };

    let cooldown = this.getCooldown();
    if (cooldown !== null) {
      rawAbil.charge = cooldown;
    }

    return AbilityDef.createFromJSON(rawAbil);
  }

  static createAbilityStyle() {
    return (new AbilitySheetSpriteAbilityStyleBuilder())
      .setSheet('bullet_sheet')
      .setCoordNums(36, 139, 44, 147)
      .setRotation(0)
      .fixRotation(true);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }
}

AbilityCore.coreList[4005] = AbilityCore4005;
