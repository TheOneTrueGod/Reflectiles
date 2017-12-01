class GhostProjectile extends Projectile {
  constructor(startPoint, targetPoint, angle, abilityDef) {
    super(startPoint, targetPoint, angle, abilityDef, {});
    this.hitEnemy = false;
    this.ghost_time = abilityDef.getOptionalParam('duration', 10);
    this.start_ghost_time = this.ghost_time;
  }

  shouldBounceOffLine(line) {
    if (line instanceof BorderWallLine) {
      return line.side !== BorderWallLine.BOTTOM;
    }
    return false;
  }

  hitWall(boardState, intersection) {
    super.hitWall(boardState, intersection);
    this.ghost_time = this.start_ghost_time;
  }

  hitUnit(boardState, unit, intersection) {
    this.hitEnemy = true;
    this.ghost_time = this.start_ghost_time;
  }

  runTick(boardState, boardWidth, boardHeight) {
    super.runTick(boardState, boardWidth, boardHeight);
    if (this.hitEnemy) {
      if (boardState.sectors.getUnitsAtPosition(this.x, this.y).length !== 0) {
        this.ghost_time = this.start_ghost_time;
      } else {
        this.ghost_time -= 1;
        if (this.ghost_time === 0) {
          this.duration = 0;
        }
      }
    }
  }
}
