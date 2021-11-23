class EnemyAbilityExplode extends EnemyAbility {
  constructor(unit, damage) {
    super(unit);
    this.damage = damage;
  }

  doEffects(boardState, forecast) {
    if (!this.unit.canUseAbilities()) { return; }

    const src = {x: this.unit.x, y: this.unit.y};

    const targets = forecast.getTargetPos(boardState);
    const num_targets = targets.length;
    targets.forEach((targetPos) => {
      boardState.addProjectile(
        new EnemyProjectile(
          src,
          targetPos,
          Math.atan2(targetPos.y - src.y, targetPos.x - src.x),
          {
            'damage_to_players': this.damage / num_targets,
          }
        ).addUnitHitCallback(this.unitHitCallback.bind(this))
      );
    })
  }

  createForecast(boardState, unit, abilityIndex) {
    let player_ids = boardState.getPlayerIDs();

    if (!player_ids) { return undefined; }

    return new AbilityForecast(unit, abilityIndex, AbilityForecast.TARGET_TYPES.PLAYER_ID, player_ids);
  }

  unitHitCallback(boardState, unit, intersection, projectile) {

  }
}
