class SingleHitProjectile extends StandardProjectile {
  constructor(playerID, startPoint, targetPoint, angle, abilityDef, projectileOptions) {
    super(playerID, startPoint, targetPoint, angle, abilityDef, projectileOptions);
    this.max_bounces = 0;
  }
}
