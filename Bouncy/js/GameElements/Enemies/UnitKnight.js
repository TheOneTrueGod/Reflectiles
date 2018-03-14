class UnitKnight extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
  }

  createCollisionBox() {
    var t = -this.physicsHeight / 2;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;

    var s = Unit.UNIT_SIZE / 2;

    var offset = 0;
    this.collisionBox = [
      new UnitLine(-s, -s / 2, -s / 2, -s, this), // TL
      new UnitLine(-s / 2, -s, s / 2, -s, this), // Top
      new UnitLine(s / 2, -s, s, -s / 2, this), // TR

      new UnitLine(s, -s / 2, r, b + offset, this), // Right
      new UnitLine(r + offset, b, l - offset, b, this), // Bottom
      new UnitLine(l, b + offset, -s, -s / 2, this), // Left
    ];
  }

  createSprite() {
    return this.createSpriteFromResource('enemy_knight');
  }

  unitHitCallback(boardState, unit, intersection, projectile) {
    var hitEffect = new DamageHitEffect({
      'base_damage': this.health.max / 8
    }, null);
    hitEffect.doHitEffect(boardState, unit, intersection, projectile);
  }

  doSpawnEffect(boardState) {
    this.useAbility(boardState);
  }

  useAbility(boardState) {
    for (var i = -1; i <= 1; i++) {
      var castPoint = {x: this.x, y: this.y};
      var targetPoint = {x: this.x + Unit.UNIT_SIZE * i, y: this.y + Unit.UNIT_SIZE};
      var pos = boardState.sectors.snapPositionToGrid(targetPoint);
      if (
        targetPoint.y <= boardState.boardSize.height - Unit.UNIT_SIZE &&
        targetPoint.x > 0 &&
        targetPoint.x < boardState.boardSize.width
      ) {
        let unitsAtPosition = boardState.sectors.getUnitsAtPosition(targetPoint.x, targetPoint.y);
        let blockSpawn = false;
        for (let intersectUnitId of unitsAtPosition) {
          let intersectUnit = boardState.findUnit(intersectUnitId);
          if (
            intersectUnit.preventsUnitEntry(null) ||
            (
              intersectUnit instanceof ZoneEffect && (
              intersectUnit.creatorAbility.ZONE_TYPE === ZoneAbilityDef.ZoneTypes.KNIGHT_SHIELD ||
              intersectUnit.creatorAbility.ZONE_TYPE === ZoneAbilityDef.ZoneTypes.BLOCKER_BARRIER
            ))
          ) {
            blockSpawn = true;
          }
        }
        if (blockSpawn) {
          continue;
        }

        let playerUnits = boardState.getPlayerUnitsAtPosition(targetPoint);
        for (var j = 0; j < playerUnits.length; j++) {
          playerUnits[j].knockback();
        }
        UnitKnight.abilityDef.doActionOnTick('enemy', 0, boardState, castPoint, targetPoint);
      }
    }
  }

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (!this.canUseAbilities()) { return; }
    if (phase == TurnPhasesEnum.END_OF_TURN) {
      this.useAbility(boardState);
    }
  }
}

UnitKnight.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}

UnitKnight.createAbilityDef = function() {
  UnitKnight.abilityDef = AbilityDef.createFromJSON({
    'ability_type': AbilityDef.AbilityTypes.ZONE,
    'duration': 1,
    "zone_type": ZoneAbilityDef.ZoneTypes.KNIGHT_SHIELD,
    "zone_size":{"left":0,"right":0,"top":0,"bottom":0},
    "zone_health": {
      'health': 0,
      'shield': 0,
      'armour': NumbersBalancer.getUnitAbilityNumber.bind(NumbersBalancer,
        this,
        NumbersBalancer.UNIT_ABILITIES.KNIGHT_SHIELD
      ),
    },
    "sprite": "zone_shield",
    "deletion_phase": TurnPhasesEnum.ENEMY_ACTION,
    "unit_interaction": {
      'prevent_unit_entry': true,
      'prevent_player_entry': true,
    },
    "projectile_interaction": {
      'player_projectiles': {}
    }
  });
};

UnitKnight.AddToTypeMap();
