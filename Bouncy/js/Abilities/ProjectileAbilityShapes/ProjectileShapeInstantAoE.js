/* Params
 */
class ProjectileShapeInstantAoE extends ProjectileShape {
  constructor(abilityDef) {
    super(abilityDef);
    this.ACTIVATE_ON_TICK = 0;
  }

  getTextDesc() {
    var hitEffects = this.abilityDef.getHitEffects();
    for (var i = 0; i < hitEffects.length; i++) {
      if (hitEffects[i].effect == ProjectileShape.HitEffects.DAMAGE) {
        return (this.num_bullets + 1) + " X " + idx(hitEffects[i], 'base_damage', 0);
      }
    }
    return 0;
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    if (tick == this.ACTIVATE_ON_TICK) {
      const hitEffects = this.abilityDef.getHitEffects();
      for (let i = 0; i < hitEffects.length; i++) {
        const hitEffect = HitEffect.getHitEffectFromType(hitEffects[i], this.abilityDef, this);
        if (hitEffect.getAoEType() === ProjectileShape.AOE_TYPES.NONE) {
          throw new Error("Don't Use an instant AoE without an AoE");
        }
        hitEffect.doHitEffect(boardState, targetPoint, null,
          new AbilitySource(targetPoint.x, targetPoint.y, this.abilityDef, playerID)
        );
      }
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.ACTIVATE_ON_TICK;
  }

  createTargettingGraphic(startPos, endPos, color) {
    const hitEffects = this.abilityDef.getHitEffects();
    for (let i = 0; i < hitEffects.length; i++) {
      const hitEffect = HitEffect.getHitEffectFromType(hitEffects[i], this.abilityDef, this);
      if (hitEffect.getAoEType() === ProjectileShape.AOE_TYPES.BOX) {
        let aoeSize = hitEffect.getAoESize();
        let size = {
          left: -aoeSize.x[0], right: aoeSize.x[1],
          top: -aoeSize.y[0], bottom: aoeSize.y[1]
        };
        return TargettingDrawHandler.createSquareTarget(
          endPos,
          {
            left: idx(size, 'left', 0),
            right: idx(size, 'right', 0),
            top: idx(size, 'top', 0),
            bottom: idx(size, 'bottom', 0)
          },
          color
        );
      }
    }
  }

  getValidTarget(boardState, target, playerID) {
    let maxRange = this.abilityDef.getOptionalParam('max_range', null);
    if (!maxRange) {
      return target;
    }
    var castPoint = boardState.getPlayerCastPoint(playerID, this.abilityDef.getActionPhase(), true);
    return AbilityTargetCalculations.getBoxTarget(
      boardState,
      target,
      castPoint,
      maxRange
    );
  }
}
