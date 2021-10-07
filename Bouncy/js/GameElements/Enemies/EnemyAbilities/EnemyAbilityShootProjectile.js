class EnemyAbilityShootProjectile extends EnemyAbility {
  constructor(unit, damage) {
    super(unit);
    this.damage = damage;
  }

  doEffects(boardState, forecast) {
    if (!this.unit.canUseAbilities()) { return; }

    const src = {x: this.unit.x, y: this.unit.y};
    const target = forecast.getTargetPos(boardState);
    
    var projectile = new EnemyProjectile(
      src, target,
      Math.atan2(target.y - src.y, target.x - src.x),
      { 'damage_to_players': this.damage }
    );
    projectile.addUnitHitCallback(this.unitHitCallback);
    boardState.addProjectile(projectile);
  }

  unitHitCallback(boardState, unit, intersection, projectile) {

  }
}
