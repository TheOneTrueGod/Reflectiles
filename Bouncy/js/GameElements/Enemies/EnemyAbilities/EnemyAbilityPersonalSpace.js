class EnemyAbilityPersonalSpace extends EnemyAbility {
  constructor(unit, damage, minRow) {
    super(unit);
    this.damage = damage;
    this.minRow = minRow;
  }

  shootUnit(boardState, playerCastPoint) {
    var projectile = new EnemyProjectile (
      {x: this.unit.x, y: this.unit.y}, playerCastPoint,
      Math.atan2(playerCastPoint.y - this.unit.y, playerCastPoint.x - this.unit.x),
      { 'damage_to_players': this.damage }
    );
    projectile.addUnitHitCallback(this.unitHitCallback);
    boardState.addProjectile(projectile);
  }

  doEffects(boardState) {
    if (!this.unit.canUseAbilities()) { return; }
    let playerUnits = boardState.getAllPlayerUnits();
    for (let playerID in playerUnits) {
      let gridCoord = boardState.sectors.getGridCoord(playerUnits[playerID]);
      if (gridCoord.y < this.minRow) {
          this.shootUnit(boardState, playerUnits[playerID]);
      }
    }
  }

  unitHitCallback(boardState, unit, intersection, projectile) {

  }
}
