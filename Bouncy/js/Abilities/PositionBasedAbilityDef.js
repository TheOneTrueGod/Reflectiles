class PositionBasedAbilityDef extends AbilityDef {
  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    var damageDealt = 0;
    var hitEffects = this.getOptionalParam('hit_effects', []);
    for (var i = 0; i < hitEffects.length; i++) {
      var hitEffect = HitEffect.getHitEffectFromType(hitEffects[i], this, null);
      damageDealt += hitEffect.doHitEffect(boardState, targetPoint, null, null);
    }
  }

  createExplosionEffect(boardState, targetPos) {
    var style = this.getStyle();
    if (style) {
      style.createExplosion(boardState, targetPos, this);
    } else {
      var AOESprite = 'sprite_explosion';
      EffectFactory.createExplosionSpriteAtUnit(boardState, targetPos, AOESprite);
    }
  }
}
