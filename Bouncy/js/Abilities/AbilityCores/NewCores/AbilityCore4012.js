// TODO:
// [] Change the icon
// [] Change the cooldown
// [] Change the style
class AbilityCore4012 extends AbilityCore {
  static BuildAbilityChild(level) {
    let pierces = 1;
    let numBullets = 15;
    let impactDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 0.5) / numBullets / (pierces + 1));
    let poisonDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1.5) / numBullets / (pierces + 1));

    const rawAbil = {
      name: 'Poison Nova',
      description: `Release a wave of <<${numBullets}>> poison blasts around you, dealing <<${impactDamage}>> damage, inflicting <<${poisonDamage}>> poison, and <<immobilizing>> them.`,
      card_text_description: `${impactDamage}`,
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.BULLET_EXPLOSION,  
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      num_bullets: numBullets,
      destroy_on_wall: [BorderWallLine.BOTTOM, BorderWallLine.TOP, BorderWallLine.RIGHT, BorderWallLine.LEFT],
      wall_bounces: 0,
      angle_start: Math.PI / 2,
      gravity: {x: 0, y: 0},
      speed_decay: {x: 0.99, y: 0.99},
      collision_behaviours: [
        { behaviour: CollisionBehaviour.PASSTHROUGH, count: pierces },
      ],
      duration: 30,
      speed: 8,
      hit_effects: [
        {
          effect: ProjectileShape.HitEffects.DAMAGE,
          base_damage: impactDamage
        },
        {
          effect: ProjectileShape.HitEffects.POISON,
          damage: poisonDamage,
        },
        {
          effect: ProjectileShape.HitEffects.IMMOBILIZE,
          duration: 1,
        }
      ],
      icon: "/Bouncy/assets/icons/gooey-molecule.png"
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
      .setSheet('poison_sheet')
      .setCoords({left: 53, top: 85, right: 72, bottom: 93})
      .setExplosion(AbilityStyle.getExplosionPrefab(AbilityStyle.EXPLOSION_PREFABS.POISON))
      .setRotation(-Math.PI);
  }

  static getCooldown() {
    return {initial_charge: -1, max_charge: 2, charge_type: AbilityDef.CHARGE_TYPES.TURNS};
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }
}

AbilityCore.coreList[4012] = AbilityCore4012;
