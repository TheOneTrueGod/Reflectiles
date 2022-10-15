/**
 * Applies a buff to the casting unit, and possibly units around it.
 * radius: number.
 */
class BuffAbilityDef extends AbilityDef {
  constructor(defJSON, subAbility) {
    super(defJSON, subAbility);

    this.radius = defJSON["radius"] ? defJSON["radius"] : 0;
    this.hitEffects = defJSON["hit_effects"] ? defJSON["hit_effects"] : [];

    if (defJSON.hit_effects) {
      for (var i = 0; i < defJSON.hit_effects.length; i++) {
        if (defJSON.hit_effects[i].abil_def) {
          this.loadNestedAbilityDefs([defJSON.hit_effects[i]]);
        }
      }
    }
  }

  getValidTarget(target, playerID) {
    return target;
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    super.doActionOnTick(playerID, tick, boardState, castPoint, targetPoint);
    if (tick === 0) {
      let targets = this.getBuffTargets(boardState);
      var damageDealt = 0;
      targets.forEach((target) => {
        for (var i = 0; i < this.hitEffects.length; i++) {
          var hitEffect = HitEffect.getHitEffectFromType(
            this.hitEffects[i],
            this,
            null
          );
          damageDealt += hitEffect.doHitEffect(
            boardState,
            target,
            null,
            playerID
          );
        }
      });
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > 0;
  }

  getBuffTargets(boardState) {
    return boardState.getAllUnitsByCondition((unit) => {
      return true;
    });
  }

  createTargetSprite() {
    return new PIXI.Sprite(ImageLoader.getSquareTexture("targetters", 0));
  }

  createTargettingGraphic(startPos, endPos, color) {
    let targettingContainer = new PIXI.Container();
    let newSprite = this.createTargetSprite();
    newSprite.anchor.set(0.5);
    newSprite.x = startPos.x;
    newSprite.y = startPos.y - 40;
    targettingContainer.addChild(newSprite);
    newSprite.alpha = 0.5;
    newSprite.width = 20;
    newSprite.height = 20;
    return targettingContainer;
  }
}
