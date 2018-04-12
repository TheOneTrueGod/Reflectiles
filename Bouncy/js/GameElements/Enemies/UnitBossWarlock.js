class UnitBossWarlock extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.traits[Unit.UNIT_TRAITS.FROST_IMMUNE] = true;
    this.unitsReincarnated = 0;
    this.unitsToReincarnate = NumbersBalancer.getUnitAbilityNumber(
      this,
      NumbersBalancer.UNIT_ABILITIES.WARLOCK_MAX_SKELETONS_PER_TURN
    );
    this.reincarnateRange = NumbersBalancer.getUnitAbilityNumber(
      this,
      NumbersBalancer.UNIT_ABILITIES.WARLOCK_RANGE
    );
  }

  createCollisionBox() {
    var s = Unit.UNIT_SIZE / 2;

    var t = 0;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;

    var offset = 0;
    // Octagonal

    this.collisionBox = [
      new UnitLine(0, -this.physicsHeight / 2, this.physicsWidth / 2, 0, this), // Top Right
      new UnitLine(r, t - offset, r, s / 2, this), // Right

      new UnitLine(s, s / 2, s / 2, s, this), // BR
      new UnitLine(s / 2, s, -s / 2, s, this), // Bottom
      new UnitLine(-s / 2, s, -s, s / 2, this), // BL

      new UnitLine(l, s / 2, l, t - offset, this), // Left
      new UnitLine(-this.physicsWidth / 2, 0, 0, -this.physicsHeight / 2, this), // Top Left
    ];
  }

  createSprite() {
    return this.createSpriteFromResource('enemy_warlock');
  }

  doMovement(boardState) {
    if (this.hasStatusEffect(FreezeStatusEffect)) {
      return;
    }
    this.movementCredits += this.movementSpeed;
    if (this.movementCredits >= 1) {
      this.doHorizontalMovement(boardState);
    }
  }

  onUnitDying(boardState, dyingUnit) {
    if (
      this.unitsReincarnated < this.unitsToReincarnate &&
      !(dyingUnit instanceof UnitSkeleton) &&
      dyingUnit.getHealth().current <= 0 &&
      dyingUnit instanceof UnitBasic &&
      Math.abs((this.x - dyingUnit.x) / Unit.UNIT_SIZE) <= this.reincarnateRange &&
      Math.abs((this.y - dyingUnit.y) / Unit.UNIT_SIZE) <= this.reincarnateRange
    ) {
      this.unitsReincarnated += 1;
      let newUnit = new UnitSkeleton(dyingUnit.x, dyingUnit.y, this.owner);
      boardState.addUnit(newUnit);
      newUnit.playSpawnEffect(boardState, this, 20);
      return false;
    }
    return super.onUnitDying(boardState, dyingUnit);
  }

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (phase == TurnPhasesEnum.NEXT_TURN || phase == TurnPhasesEnum.START_TURN) {
      this.unitsReincarnated = 0;
    }
    if (phase == TurnPhasesEnum.END_OF_TURN) {
      this.useAbility(boardState);
    }
  }

  doSpawnEffect(boardState) {
    this.useAbility(boardState);
  }

  useAbility(boardState) {
    [
      [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2],
      [-2, -1], [2, -1],     [-2, 0], [2, 0],     [-2, 1], [2, 1],
      [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2],
    ].forEach(offset => {
      let dx = offset[0]; let dy = offset[1];
      var castPoint = {x: this.x, y: this.y};
      var targetPoint = {x: this.x + Unit.UNIT_SIZE * dx, y: this.y + Unit.UNIT_SIZE * dy};
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
              intersectUnit.creatorAbility.ZONE_TYPE === ZoneAbilityDef.ZoneTypes.WARLOCK_SHIELD ||
              intersectUnit.creatorAbility.ZONE_TYPE === ZoneAbilityDef.ZoneTypes.BLOCKER_BARRIER
            ))
          ) {
            blockSpawn = true;
          }
        }
        if (blockSpawn) {
          return;
        }

        let playerUnits = boardState.getPlayerUnitsAtPosition(targetPoint);
        for (var j = 0; j < playerUnits.length; j++) {
          playerUnits[j].knockback();
        }
        UnitBossWarlock.abilityDef.doActionOnTick('enemy', 0, boardState, castPoint, targetPoint);
      }
    });
  }

  isBoss() {
    return true;
  }
}

UnitBossWarlock.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
};

UnitBossWarlock.createAbilityDef = function() {
  UnitBossWarlock.abilityDef = AbilityDef.createFromJSON({
    'ability_type': AbilityDef.AbilityTypes.ZONE,
    'duration': 1,
    "zone_type": ZoneAbilityDef.ZoneTypes.WARLOCK_SHIELD,
    "zone_size":{"left":0,"right":0,"top":0,"bottom":0},
    "zone_health": {
      'health': 0,
      'shield': 0,
      'armour': NumbersBalancer.getUnitAbilityNumber.bind(NumbersBalancer,
        this,
        NumbersBalancer.UNIT_ABILITIES.WARLOCK_SHIELD
      ),
    },
    "sprite": "enemy_bone_wall",
    "deletion_phase": TurnPhasesEnum.ENEMY_ACTION,
    "unit_interaction": {
      'prevent_unit_entry': true,
      'prevent_player_entry': true,
    },
    "can_players_damage": true,
    "projectile_interaction": {
      'player_projectiles': {}
    }
  });
};

UnitBossWarlock.AddToTypeMap();
