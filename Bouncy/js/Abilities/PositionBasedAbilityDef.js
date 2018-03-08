class PositionBasedAbilityDef extends AbilityDef {
  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint, source) {
    var damageDealt = 0;
    var hitEffects = this.getOptionalParam('hit_effects', []);
    for (var i = 0; i < hitEffects.length; i++) {
      var hitEffect = HitEffect.getHitEffectFromType(hitEffects[i], this, null);
      damageDealt += hitEffect.doHitEffect(boardState, targetPoint, null, source);
    }
  }
}
