class EnemyAbilityShieldWall extends EnemyAbility {
  doEffects(boardState, forecast, skipAnimation = false) {
    for (var i = -1; i <= 1; i++) {
      var castPoint = { x: this.unit.x, y: this.unit.y };
      var targetPoint = {
        x: this.unit.x + Unit.UNIT_SIZE * i,
        y: this.unit.y + Unit.UNIT_SIZE,
      };
      var pos = boardState.sectors.snapPositionToGrid(targetPoint);
      if (
        targetPoint.y <= boardState.boardSize.height - Unit.UNIT_SIZE &&
        targetPoint.x > 0 &&
        targetPoint.x < boardState.boardSize.width
      ) {
        let unitsAtPosition = boardState.sectors.getUnitsAtPosition(
          targetPoint.x,
          targetPoint.y
        );
        let blockSpawn = false;
        for (let intersectUnitId of unitsAtPosition) {
          let intersectUnit = boardState.findUnit(intersectUnitId);
          if (
            intersectUnit.preventsUnitEntry(null) ||
            (intersectUnit instanceof ZoneEffect &&
              (intersectUnit.creatorAbility.ZONE_TYPE ===
                ZoneAbilityDef.ZoneTypes.KNIGHT_SHIELD ||
                intersectUnit.creatorAbility.ZONE_TYPE ===
                  ZoneAbilityDef.ZoneTypes.WARLOCK_SHIELD ||
                intersectUnit.creatorAbility.ZONE_TYPE ===
                  ZoneAbilityDef.ZoneTypes.BLOCKER_BARRIER))
          ) {
            blockSpawn = true;
            this.shieldTargetUnit(boardState, intersectUnit, skipAnimation);
          }
        }
        if (blockSpawn) {
          continue;
        }

        let playerUnits = boardState.getPlayerUnitsAtPosition(targetPoint);
        for (var j = 0; j < playerUnits.length; j++) {
          playerUnits[j].knockback(boardState);
        }
        EnemyAbilityShieldWall.abilityDef.doActionOnTick(
          "enemy",
          0,
          boardState,
          castPoint,
          targetPoint
        );
      }
    }
  }

  shieldTargetUnit(boardState, targetUnit, skipAnimation) {
    if (skipAnimation) {
      this.projectileAnimationOver(targetUnit);
      return;
    }
    boardState.addProjectile(
      new SpriteLerpProjectile(
        this.unit,
        targetUnit,
        0.1,
        1,
        20,
        "zone_armour",
        this.projectileAnimationOver.bind(this, targetUnit)
      )
    );
  }

  projectileAnimationOver(targetUnit) {
    targetUnit.addStatusEffect(
      new ArmourStatusEffect(
        NumbersBalancer.getUnitAbilityNumber(
          this,
          NumbersBalancer.UNIT_ABILITIES.KNIGHT_SHIELD
        )
      )
    );
  }
}
EnemyAbilityShieldWall.createAbilityDef = function () {
  EnemyAbilityShieldWall.abilityDef = AbilityDef.createFromJSON({
    ability_type: AbilityDef.AbilityTypes.ZONE,
    duration: 1,
    zone_type: ZoneAbilityDef.ZoneTypes.KNIGHT_SHIELD,
    zone_size: { left: 0, right: 0, top: 0, bottom: 0 },
    zone_health: {
      health: 0,
      shield: 0,
      armour: NumbersBalancer.getUnitAbilityNumber.bind(
        NumbersBalancer,
        this,
        NumbersBalancer.UNIT_ABILITIES.KNIGHT_SHIELD
      ),
    },
    sprite: "zone_shield",
    deletion_phase: TurnPhasesEnum.ENEMY_ACTION,
    unit_interaction: {
      prevent_player_entry: true,
    },
    can_players_damage: true,
    projectile_interaction: {
      player_projectiles: {},
    },
  });
};
