class AbilityCore4003 extends AbilityCore {
  static BuildAbilityChild(level) {
    let num_bullets = 12;
    let shotDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1.5) / num_bullets);
    const rawAbil = { // 3000 damage max
      name: 'Infect',
      description: "Shoots a projectile that hits a single enemy<br>" +
        'That enemy is infected.  If they die in the next [[hit_effects[0].duration]] ' +
        'turns, they explode into [[hit_effects[0].abil_def.num_bullets]] bullets, ' +
        'each one dealing [[hit_effects[0].abil_def.hit_effects[0].base_damage]] damage.',
      card_text_description: '[[hit_effects[0].abil_def.num_bullets]] X [[hit_effects[0].abil_def.hit_effects[0].base_damage]]',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects: [{
        effect: ProjectileShape.HitEffects.INFECT,
        duration: 2,
        abil_def: {
          ability_type: AbilityDef.AbilityTypes.PROJECTILE,
          shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,
          projectile_type: ProjectileShape.ProjectileTypes.PENETRATE,
          //bullet_speed: 6,
          speed: 8,
          num_bullets,
          gravity: {x: 0, y: 0},
          hit_effects: [{
            effect: ProjectileShape.HitEffects.DAMAGE,
            base_damage: shotDamage
          }],
        }
      }],
      icon: "/Bouncy/assets/icons/nuclear.png",
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
      .setCoordNums(393, 157, 406, 171)
      .setRotation(0)
      .fixRotation(true);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 3, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }
}

AbilityCore.coreList[4003] = AbilityCore4003;
