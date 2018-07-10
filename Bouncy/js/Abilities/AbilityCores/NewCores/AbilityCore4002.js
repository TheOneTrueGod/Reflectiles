class AbilityCore4002 extends AbilityCore {
  static BuildAbilityChild(level) {
    let duration = 3;
    let hitDamage = NumbersBalancer.getAbilityDamage(level, 0.2);
    let damagePerTurn = Math.floor(hitDamage / duration);
    const rawAbil = {
      name: 'Poison Explosion',
      description: 'Fires a poison shot, poisoning all enemies in a <<' + 3 + '>>x<<' + 3 + '>> area for ' +
        '<<' + damagePerTurn + '>> poison damage per turn for <<' + duration + '>> turns.<br>',
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: ProjectileAbilityDef.Shapes.SINGLE_SHOT,
      projectile_type: ProjectileShape.ProjectileTypes.STANDARD,
      hit_effects: [
        {
          damage: damagePerTurn,
          duration: duration,
          effect: ProjectileShape.HitEffects.POISON,
          aoe_type: "BOX",
          aoe_size: {x:[-1, 1],y:[-1, 1]},
        }
      ],
      icon: "/Bouncy/assets/icons/poison-gas.png",
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
    return {initial_charge: -1, max_charge: 3, charge_type: "TURNS"};
  }

  static GetCardDeckType() {
    return CardDeckTypes.POISON;
  }
}

AbilityCore.coreList[4002] = AbilityCore4002;
