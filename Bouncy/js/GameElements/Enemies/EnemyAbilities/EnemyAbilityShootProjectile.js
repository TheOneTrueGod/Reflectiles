class EnemyAbilityShootProjectile extends EnemyAbility {
  constructor(unit, damage) {
    super(unit);
    this.damage = damage;
  }

  doEffects(boardState) {
    if (!this.unit.canUseAbilities()) { return; }
    var projectile = new EnemyProjectile(
      {x: this.unit.x, y: this.unit.y}, {x: this.unit.x, y: this.unit.y + 50},
      Math.PI / 2, this.unitHitCallback,
      { 'damage_to_players': this.damage }
    );
    projectile.addUnitHitCallback(this.unitHitCallback);
    boardState.addProjectile(projectile);
  }

  unitHitCallback(boardState, unit, intersection, projectile) {

  }
}
