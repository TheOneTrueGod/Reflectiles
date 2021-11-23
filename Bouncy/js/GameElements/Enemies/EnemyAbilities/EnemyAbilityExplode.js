class EnemyAbilityExplode extends EnemyAbility {
  constructor(unit, damage) {
    super(unit);
    this.damage = damage;
  }

  doEffects(boardState, forecast) {
    if (!this.unit.canUseAbilities()) { return; }

    let player_ids = boardState.getPlayerIDs();
    const num_players = player_ids.length;
    const src = {x: this.unit.x, y: this.unit.y};
    for (var i = 0; i < num_players; i++) {
      const target = boardState.playerCastPoints[player_ids[i]];
      const targetPos = {x: target.x, y: target.y };
      
      boardState.addProjectile(
        new EnemyProjectile(
          src,
          targetPos,
          Math.atan2(target.y - src.y, target.x - src.x),
          {
            'damage_to_players': this.damage / num_players,
          }
        ).addUnitHitCallback(this.unitHitCallback.bind(this))
      );
    }
  }

  createForecast(boardState, unit, abilityIndex) {
    let player_ids = boardState.getPlayerIDs();

    if (!player_ids) { return undefined; }

    const target = player_ids[Math.floor(Math.random() * player_ids.length)];
    return new AbilityForecast(unit, abilityIndex, AbilityForecast.TARGET_TYPES.PLAYER_ID, target);
  }

  unitHitCallback(boardState, unit, intersection, projectile) {

  }
}
