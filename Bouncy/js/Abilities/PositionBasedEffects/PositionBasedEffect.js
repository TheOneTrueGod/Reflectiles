class PositionBasedEffect {
  constructor(positionEffectDef, abilityDef) {
    this.positionEffectDef = positionEffectDef;
    this.abilityDef = abilityDef;
  }

  doEffect(boardState, projectile) {

  }
}

PositionBasedEffect.EFFECTS = {
  USE_ABILITY:'USE_ABILITY',
  BULLET_EXPLOSION:'BULLET_EXPLOSION'
}

PositionBasedEffect.getEffectFromType = function(positionEffectDef, abilityDef, projectileShape) {
  switch(positionEffectDef.effect) {
    case PositionBasedEffect.EFFECTS.BULLET_EXPLOSION:
      return new BulletExplosionEffect(positionEffectDef, abilityDef, projectileShape);
    case PositionBasedEffect.EFFECTS.USE_ABILITY:
      return new UseAbilityEffect(positionEffectDef, abilityDef, projectileShape);
  }
  return new PositionBasedEffect(positionEffectDef, abilityDef);
}
