class SpreadDebuffsHitEffect extends HitEffect {
  /** 
   * Effect:  Copy some percentage of debuffs on one target, and apply them to adjacent targets
   *
   * Additional properties;
   * debuff_list: Map<StatusEffect.name, percentage of effect to apply to adjacent targets
   * 
   * Example:
   * debuff_list: { [PoisonStatusEffect.name]: 0.5, [ImmobilizeStatusEffect.name]: 0.5 }
   * will take half of the poison and half of the immobilize that the target currently has, and apply it to all adjacent units
   * 
   * */ 
  doHitEffectOnUnit(boardState, unit, intersection, projectile) {
    if (!this.meetsCondition(boardState, unit, intersection, projectile)) {
      return 0;
    }
    var debuffTypes = idx(this.hitEffectDef, 'debuff_list', {});
    Object.keys(debuffTypes).forEach((effectName) => {
      const EffectClass = StatusEffect.StatusEffectTypeMap[effectName];
      const statusEffect = unit.getStatusEffect(EffectClass);
      // if they don't have the effect, don't do anything
      if (statusEffect === undefined) { return; }

      const percent = debuffTypes[effectName];

      let doneTransfer = false;
      
      const spreadCoords = unit.getCoordsInRange(boardState, 1);
      
      spreadCoords.forEach(({ x, y }) => {
        const unitsInSquare = boardState.sectors.getUnitsAtGridSquare(x, y);
        unitsInSquare.forEach((transferUnitId) => {
          if (!doneTransfer) {
            doneTransfer = true;
          }
          const newStatusEffect = statusEffect.clone();

          newStatusEffect.duration = newStatusEffect.duration * percent;
          if (newStatusEffect.damage) {
            newStatusEffect.damage = newStatusEffect.damage * percent;
          }
          const transferUnit = boardState.getUnitById(transferUnitId);
          transferUnit.addStatusEffect(newStatusEffect);
        })
      })
    });
    // todo maybe;  Remove some of the status effect from the existing unit
  }
}
