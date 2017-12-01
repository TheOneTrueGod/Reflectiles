class Landmine extends ZoneEffect {
  setCreatorAbility(creatorAbilityID) {
    this.creatorAbility = AbilityDef.abilityDefList[creatorAbilityID];
    this.size = {
      left: 0, right: 0,
      top: 0, bottom: 0
    };

    this.SPRITE = this.creatorAbility.getOptionalParam('sprite', this.SPRITE);
  }

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (phase === TurnPhasesEnum.END_OF_TURN) {
      var units = boardState.sectors.getUnitsAtPosition(this.x, this.y);
      var foundEnemy = false;
      for (var i = 0; i < units.length; i++) {
        var unit = boardState.findUnit(units[i]);
        if (unit instanceof UnitBasic) {
          foundEnemy = true;
        }
      }

      if (foundEnemy) {
        this.explode(boardState);
      }
    }
  }

  explode(boardState) {
    this.readyToDel = true;
    //EffectFactory.createExplosionSpriteAtUnit(boardState, this, 'sprite_explosion');

    var abilList = this.creatorAbility.getOptionalParam('unit_abilities', {});
    for (var i = 0; i < abilList.length; i++) {
      let abil = abilList[i].initializedAbilDef;

      abil.doActionOnTick(this.owningPlayerID, 0, boardState, this, this);
    }
  }

  otherUnitEntering(boardState, unit) {
    return true;
  }

  createHealthBarSprite(sprite) {}
}

Landmine.AddToTypeMap();
