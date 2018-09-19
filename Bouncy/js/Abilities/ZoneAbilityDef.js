class ZoneAbilityDef extends AbilityDef {
  constructor(defJSON, subAbility) {
    super(defJSON, subAbility);
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
    if (
      defJSON.projectile_interaction &&
      defJSON.projectile_interaction.enemy_projectiles &&
      defJSON.projectile_interaction.enemy_projectiles.ability
    ) {
      this.loadNestedAbilityDefs(defJSON.projectile_interaction.enemy_projectiles.ability);
    }
    this.MAX_RANGE = this.getOptionalParam('max_range', {left: 0, right: 0, top: 0, bottom: 0});
    this.ZONE_TYPE = this.getOptionalParam('zone_type', null);
    this.CAN_PLAYERS_DAMAGE = this.getOptionalParam('can_players_damage', null);
  }

  getValidTarget(target, playerID) {
    var castPoint = MainGame.boardState.getPlayerCastPoint(playerID, this.getActionPhase());
    // TODO: Pass in boardState.  Too lazy right now.
    return AbilityTargetCalculations.getBoxTarget(MainGame.boardState, target, castPoint, this.MAX_RANGE);
  }

  isZoneDamageableByPlayers() {
    return this.CAN_PLAYERS_DAMAGE;
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
      newUnit.visible = false;
      boardState.addUnit(newUnit);
      newUnit.playSpawnEffect(boardState, castPoint, 20);
      newUnit.visible = true;
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > 0;
  }

  createTargettingGraphic(startPos, endPos, color) {
    return TargettingDrawHandler.createSquareTarget(endPos, this.getZoneSize(), color);
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
          zone,
        )
      }
    });
  }

  unitEnteringZone(boardState, unit, zone) {
    var unitInteraction = this.getOptionalParam('unit_interaction', {});
    idx(unitInteraction, 'unit_enter', []).forEach((enterEffect) => {
      switch (enterEffect.effect) {
        case ZoneAbilityDef.UnitEffectTypes.DAMAGE:
          unit.dealDamage(boardState, idx(enterEffect, 'damage', 100), undefined, Unit.DAMAGE_TYPE.NORMAL);
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
      zone.decreaseHealth(boardState, 1);
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
