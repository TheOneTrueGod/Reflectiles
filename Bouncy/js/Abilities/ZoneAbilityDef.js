class ZoneAbilityDef extends AbilityDef {
  constructor(defJSON) {
    super(defJSON);
    this.rawDef = defJSON;
    if (
      defJSON.unit_interaction &&
      defJSON.unit_interaction.unit_enter
    ) {
      this.loadNestedAbilityDefs(defJSON.unit_interaction.unit_enter);
    }
    if (defJSON.phase_effects) {
      this.loadNestedAbilityDefs(defJSON.phase_effects);
    }
    this.MAX_RANGE = this.getOptionalParam('max_range', {left: 0, right: 0, top: 0, bottom: 0});
    this.ZONE_TYPE = this.getOptionalParam('zone_type', null);
  }

  getValidTarget(target, playerID) {
    var castPoint = MainGame.boardState.getPlayerCastPoint(playerID);
    // TODO: Pass in boardState.  Too lazy right now.
    var castPointCoord = MainGame.boardState.sectors.getGridCoord(castPoint);
    var targetCoord = MainGame.boardState.sectors.getGridCoord(target);

    var targX = Math.min(
      Math.max(castPointCoord.x - this.MAX_RANGE.left, targetCoord.x),
      castPointCoord.x + this.MAX_RANGE.right
    );
    var targY = Math.min(
      Math.max(castPointCoord.y - this.MAX_RANGE.top, targetCoord.y),
      castPointCoord.y + this.MAX_RANGE.bottom
    );

    //console.log(castPointCoord.x - this.MAX_RANGE.left, targetCoord.x, castPointCoord.x + this.MAX_RANGE.right);
    //console.log(castPointCoord.y - this.MAX_RANGE.top, targetCoord.y, castPointCoord.y + this.MAX_RANGE.bottom);

    var target = {x: targX, y: targY};
    if (!target) { return null; }
    return MainGame.boardState.sectors.getPositionFromGrid(target);
/*    var max_range = idx(this.getOptionalParam('zone_size', {}), 'y_range', -1);
    if (max_range == -1) {
      return {x: target.x, y: target.y};
    }

    var maxY = MainGame.boardState.boardSize.height - (max_range + 0.5) * Unit.UNIT_SIZE;
    var y = target.y;
    y = Math.max(y, maxY);
    return {x: target.x, y: y};*/
  }

  getOptionalParam(param, defaultValue) {
    if (param in this.rawDef) {
      return this.rawDef[param];
    }
    return defaultValue;
  }

  getZoneSize() {
    var passedSize = this.getOptionalParam('zone_size', {});
    return {
      left: idx(passedSize, 'left', 0),
      right: idx(passedSize, 'right', 0),
      top: idx(passedSize, 'top', 0),
      bottom: idx(passedSize, 'bottom', 0)
    };
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    if (tick == 0) {
      var pos = boardState.sectors.snapPositionToGrid(targetPoint);
      var newUnit = new ZoneEffect(
        pos.x, pos.y,
        0,
        null,
        this.index,
        playerID
      );
      boardState.addUnit(newUnit);
      newUnit.playSpawnEffect(boardState, castPoint, 20);
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > 0;
  }

  createTargettingGraphic(startPos, endPos, color) {
    var lineGraphic = new PIXI.Graphics();
    var pos = MainGame.boardState.sectors.snapPositionToGrid(endPos);

    var size = this.getZoneSize();
    var left = ((size.left + 0.5) * Unit.UNIT_SIZE);
    var right = ((size.right + 0.5) * Unit.UNIT_SIZE);
    var top = ((size.top + 0.5) * Unit.UNIT_SIZE);
    var bottom = ((size.bottom + 0.5) * Unit.UNIT_SIZE);

    lineGraphic.position.set(pos.x, pos.y);

    lineGraphic
      .lineStyle(1, color)
      .drawRect(
        -left, -top,
        left + right, top + bottom
      );

    return lineGraphic;
  }
  
  endOfPhase(boardState, phase, zone) {
    idx(this.rawDef, 'phase_effects', []).forEach((phaseEffect) => {
      if (
        phaseEffect.effect === "ABILITY" && 
        phaseEffect.phase === phase &&
        phaseEffect.initializedAbilDef
      ) {
        phaseEffect.initializedAbilDef.doActionOnTick(
          zone.owningPlayerID,
          0,
          boardState,
          {x: zone.x, y: zone.y},
          {x: zone.x, y: zone.y},
        )
      }
    });
  }

  unitEnteringZone(boardState, unit, zone) {
    var unitInteraction = this.getOptionalParam('unit_interaction', {});
    idx(unitInteraction, 'unit_enter', []).forEach((enterEffect) => {
      switch (enterEffect.effect) {
        case ZoneAbilityDef.UnitEffectTypes.DAMAGE:
          unit.dealDamage(boardState, idx(enterEffect, 'damage', 100));
          break;
        case ZoneAbilityDef.UnitEffectTypes.ABILITY:
          var abilitySource = idx(enterEffect, 'ability_source', ZoneAbilityDef.AbilitySources.CENTER_ZONE);

          var spotsToHit;
          if (abilitySource === ZoneAbilityDef.AbilitySources.CENTER_ZONE) {
            spotsToHit = [boardState.sectors.getGridPosition(zone)];
          } else if (abilitySource === ZoneAbilityDef.AbilitySources.BELOW_UNIT) {
            spotsToHit = [boardState.sectors.getGridPosition(unit).addScalarY(1)];
          } else if (abilitySource === ZoneAbilityDef.AbilitySources.WHOLE_ZONE) {
            spotsToHit = [];
            var size = this.getZoneSize();
            var coords = boardState.sectors.getGridPosition(zone);
            for (var x = coords.x - size.left; x <= coords.x + size.right; x++) {
              for (var y = coords.y - size.top; y <= coords.y + size.bottom; y++) {
                spotsToHit.push(Victor(x, y));
              }
            }
          }

          var abilDef = enterEffect.initializedAbilDef;
          spotsToHit.forEach((castSector) => {
            var castPoint = castSector.clone().multiplyScalarX(Unit.UNIT_SIZE).multiplyScalarY(Unit.UNIT_SIZE);
            var targetPoint = castSector.clone().addScalarY(-1).multiplyScalarX(Unit.UNIT_SIZE).multiplyScalarY(Unit.UNIT_SIZE)
            abilDef.doActionOnTick(zone.owningPlayerID, 0, boardState, castPoint, targetPoint);
          });
          break;
      }
    })
    if (!this.canUnitPassThrough(unit)) {
      zone.decreaseTime(boardState, 1);
    }
  }

  canUnitPassThrough(unit) {
    return !idx(this.getOptionalParam('unit_interaction', {}), 'prevent_unit_entry', true);
  }
}

ZoneAbilityDef.createUnitInteractionJSON = function(
  prevent_unit_entry,
  unit_enter
) {
  return {
    'prevent_unit_entry': prevent_unit_entry,
    'unit_enter': unit_enter
  };
}

ZoneAbilityDef.createUnitEntryDamageInteraction = function(damage) {
  return {
    'effect': ZoneAbilityDef.UnitEffectTypes.DAMAGE,
    'damage': damage
  };
}

ZoneAbilityDef.createUnitEntryAbilityInteraction = function(
  abilityDef,
  abilitySources
) {
  return {
    'effect': ZoneAbilityDef.UnitEffectTypes.ABILITY,
    'ability_source': abilitySources,
    'abil_def': abilityDef
  };
}

ZoneAbilityDef.UnitEffectTypes = {
  DAMAGE: 'DAMAGE',
  ABILITY: 'ABILITY'
};

ZoneAbilityDef.AbilitySources = {
  WHOLE_ZONE: 'WHOLE_ZONE',
  CENTER_ZONE: 'CENTER_ZONE',
  BELOW_UNIT: 'BELOW_UNIT',
}

ZoneAbilityDef.ZoneTypes = {
  KNIGHT_SHIELD: "KNIGHT_SHIELD",
  MOLOTOV: "MOLOTOV",
  BLOCKER_BARRIER: "BLOCKER_BARRIER",
}
