class ProjectileTrailDef {
  constructor(trailDef) {
    this.trailDef = trailDef;
  }

  createProjectileTrail(boardState, projectile) {
    if (!this.trailDef) {
      return;
    }
    switch (this.trailDef.type) {
      case ProjectileTrailDef.TRAIL_TYPES.SPRITE_COPY:
        if (boardState.tick % 1 == 0) {
          boardState.addProjectile(
            new ProjectileTrailEffect(projectile, idx(this.trailDef, 'trail_length', 4))
          );
        }
        break;
      default:
        throw new Error("Unhandled trail def type: '" + this.trailDef.type + "'");
    }
  }
}

ProjectileTrailDef.TRAIL_TYPES = {
  SPRITE_COPY: 'SPRITE_COPY',
}
