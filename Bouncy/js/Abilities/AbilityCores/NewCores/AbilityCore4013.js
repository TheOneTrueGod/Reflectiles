// TODO:
// [] Change the icon
// [] Change the cooldown
// [] Change the style
// [] Change the rawAbil
class AbilityCore4013 extends AbilityCore {
  static BuildAbilityChild(level) {
    const pierces = 1;
    const numBullets = 12;
    let impactDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 0.5) / numBullets / (pierces + 1));
    let poisonDamage = Math.floor(NumbersBalancer.getAbilityDamage(level, 1) / numBullets / (pierces + 1));
    const rawAbil = {
      name: 'Toxic Blast',
      description: `Fires <<12>> projectiles that inflict <<${impactDamage}>> damage, <<${poisonDamage}>> poison and pierce <<once>>`,
      card_text_description: `${impactDamage}`,
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SPRAY_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects: [
        { base_damage: impactDamage, effect: ProjectileShape.HitEffects.DAMAGE },
        {
          effect: ProjectileShape.HitEffects.POISON,
          damage: poisonDamage,
        }
      ],
      collision_behaviours: [
        { behaviour: CollisionBehaviour.PASSTHROUGH, count: pierces },
      ],
      num_bullets: numBullets,
      minSpeed: 8,
      maxSpeed: 10,
      min_angle: Math.PI / 10.0,
      max_angle: Math.PI / 6.0,
      wall_bounces: 0,
      icon: "/Bouncy/assets/icons/goo-skull.png"
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

AbilityCore.coreList[4013] = AbilityCore4013;
