class UnitMovementEffects {
  static playJumpingSpawnEffect(boardState, unit, pct) {
    if (!unit.spawnEffectStart) { return; }
    //unit.gameSprite.scale.y = lerp(0, unit.spriteScale.y, pct);
    unit.gameSprite.scale.x = unit.spriteScale.x;
    unit.gameSprite.scale.y = unit.spriteScale.y;

    let jumpHeight = 0;
    if (pct < 0.8) {
      jumpHeight = Math.sin(Math.PI * pct / 0.8) * Unit.UNIT_SIZE / 2;
    }
    unit.x = lerp(unit.spawnEffectStart.x, unit.moveTarget.x, pct);
    unit.y = lerp(unit.spawnEffectStart.y, unit.moveTarget.y, pct) - jumpHeight;
  }

  static playJumpingEffect(unit, pct) {
    let jumpHeight = Math.sin(Math.PI * Math.max(Math.min(1, pct), 0)) * Unit.UNIT_SIZE / 2;
    unit.x = lerp(unit.startMovementPos.x, unit.moveTarget.x, pct);
    unit.y = lerp(unit.startMovementPos.y, unit.moveTarget.y, pct) - jumpHeight;
    if (pct <= 0.2) {
      unit.gameSprite.scale.x = unit.spriteScale.x;
      unit.gameSprite.scale.y = unit.spriteScale.y * 0.8;
    } else if (pct > 0.2 && pct < 0.8) {
      unit.gameSprite.scale.x = unit.spriteScale.x * 0.8;
      unit.gameSprite.scale.y = unit.spriteScale.y;
    } else {
      unit.gameSprite.scale.x = unit.spriteScale.x;
      unit.gameSprite.scale.y = unit.spriteScale.y;
    }

    /*MainGame.boardState.addProjectile(
      new ProjectileTrailEffect(this, 1, lerp(0.8, 0.25, jumpHeight / (Unit.UNIT_SIZE / 2)))
    );*/
  }
}
