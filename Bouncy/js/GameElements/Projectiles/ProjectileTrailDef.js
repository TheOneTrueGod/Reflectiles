class ProjectileTrailDef {
  constructor(trailDef) {
    this.trailDef = trailDef;
  }

  createProjectileTrail(boardState, projectile, intersectionPoint) {
    if (!this.trailDef) {
      return;
    }

    const trailTarget = intersectionPoint ? intersectionPoint : projectile;

    switch (this.trailDef.type) {
      case ProjectileTrailDef.TRAIL_TYPES.SPRITE_COPY:
        if (boardState.tick % 1 == 0) {
          boardState.addProjectile(
            new ProjectileTrailEffect(projectile, idx(this.trailDef, 'trail_length', 4))
          );
        }
        break;
      case ProjectileTrailDef.TRAIL_TYPES.LINE:
        boardState.addProjectile(
          new LineEffect(
            {x1: trailTarget.x, y1: trailTarget.y, x2: projectile.lastX, y2: projectile.lastY},
            idx(this.trailDef, 'color', 0x888888),
            null,
            idx(this.trailDef, 'duration', 5),
            idx(this.trailDef, 'options', {}),
           )
        );
        break;
      default:
        throw new Error("Unhandled trail def type: '" + this.trailDef.type + "'");
    }
  }
}

ProjectileTrailDef.TRAIL_TYPES = {
  SPRITE_COPY: 'SPRITE_COPY',
  LINE: 'LINE'
}
