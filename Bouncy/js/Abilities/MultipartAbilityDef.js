class MultipartAbilityDef extends AbilityDef {
  constructor(defJSON, subAbility) {
    super(defJSON, subAbility);

    this.loadNestedAbilityDefs(defJSON.child_abilities);
    this.child_abilities = [];
    for (var i = 0; i < this.rawDef.child_abilities.length; i++) {
      let initialized = this.rawDef.child_abilities[i].initializedAbilDef;
      if (!initialized) {
        throw new Error("ability didn't initialize; " + this.rawDef.child_abilities);
      }
      this.child_abilities.push(initialized);
    }
  }

  createTargettingGraphic(startPos, endPos, color) {
    let sprite = new PIXI.Sprite();
    for (let abil of this.child_abilities) {
      sprite.addChild(abil.createTargettingGraphic(startPos, endPos, color));
    }
    return sprite;
  }

  hasFinishedDoingEffect(tickOn) {
    for (let i = 0; i < this.child_abilities.length; i++) {
      let abil = this.child_abilities[i];
      if (!abil.hasFinishedDoingEffect(tickOn - this.getTimingOffset(tickOn, abil))) {
        return false;
      }
    }
    return true;
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    super.doActionOnTick(playerID, tick, boardState, castPoint, targetPoint);
    for (let i = 0; i < this.child_abilities.length; i++) {
      let abil = this.child_abilities[i];
      if (
        abil.TIMING_OFFSET === MultipartAbilityDef.TIMING_OFFSET.AFTER &&
        abil.TIMING_OFFSET_AFTER_TICK === undefined
      ) {
        if (i === 0) {
          abil.TIMING_OFFSET_AFTER_TICK = tick;
        } else {
          let prevAbil = this.child_abilities[i - 1];
          if (prevAbil.hasFinishedDoingEffect(tick)) {
            abil.TIMING_OFFSET_AFTER_TICK = tick;
          }
        }
      }
      abil.doActionOnTick(playerID, tick - this.getTimingOffset(tick, abil), boardState, castPoint, targetPoint);
    }
  }

  getTimingOffset(tick, abil) {
    if (abil.TIMING_OFFSET === MultipartAbilityDef.TIMING_OFFSET.AFTER) {
      if (abil.TIMING_OFFSET_AFTER_TICK) {
        return abil.TIMING_OFFSET_AFTER_TICK;
      }
      return tick + 1;
    }
    return abil.TIMING_OFFSET;
  }
}

MultipartAbilityDef.TIMING_OFFSET = {
  AFTER: 'after',
};
