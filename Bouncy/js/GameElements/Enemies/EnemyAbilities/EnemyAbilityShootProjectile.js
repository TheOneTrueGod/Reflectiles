class EnemyAbilityShootProjectile extends EnemyAbility {
  constructor(unit, damage) {
    super(unit);
    this.damage = damage;
  }

  doEffects(boardState, forecast) {
    if (!this.unit.canUseAbilities()) { return; }

    const src = {x: this.unit.x, y: this.unit.y};
    const targets = forecast.getTargetPos(boardState);
    targets.forEach((target) => {
      var projectile = new EnemyProjectile(
        src, target,
        Math.atan2(target.y - src.y, target.x - src.x),
        { 'damage_to_players': this.damage }
      );
      projectile.addUnitHitCallback(this.unitHitCallback);
      boardState.addProjectile(projectile);
    });
  }

  createForecast(boardState, unit, abilityIndex) {
    let player_ids = boardState.getPlayerIDs();

    if (!player_ids) { return undefined; }

    const target = player_ids[Math.floor(Math.random() * player_ids.length)];
    return new AbilityForecast(unit, abilityIndex, AbilityForecast.TARGET_TYPES.PLAYER_ID, [target]);
  }

  unitHitCallback(boardState, unit, intersection, projectile) {

  }
}
