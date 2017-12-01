class UseAbilityEffect extends PositionBasedEffect {
  constructor(positionEffectDef, abilityDef) {
    super(positionEffectDef, abilityDef);
  }

  doEffect(boardState, projectile) {
    if (this.positionEffectDef.initializedAbilDef) {
      var castPoint = {x: projectile.x, y: projectile.y};
      var targetPoint = {
        x: projectile.x + Math.cos(projectile.angle) * projectile.speed,
        y: projectile.y + Math.sin(projectile.angle) * projectile.speed
      };
      this.positionEffectDef.initializedAbilDef.doActionOnTick(
        null,
        0, boardState, castPoint, targetPoint);
    }
  }
}
