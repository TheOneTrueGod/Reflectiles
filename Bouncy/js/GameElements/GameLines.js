class GameLine extends Line {
  forceBounce() {
    return false;
  }
}

class BorderWallLine extends GameLine {
  constructor(x1, y1, x2, y2, side) {
    super(x1, y1, x2, y2);
    this.side = side;
  }

  forceBounce() {
    return this.side !== this.BOTTOM;
  }
}

BorderWallLine.LEFT = 'LEFT';
BorderWallLine.RIGHT = 'RIGHT';
BorderWallLine.TOP = 'TOP';
BorderWallLine.BOTTOM = 'BOTTOM';

class UnitLine extends GameLine {
  constructor(x1, y1, x2, y2, unit) {
    super(x1, y1, x2, y2);
    this.unit = unit;
  }

  forceBounce() {
    return false;
  }

  clone() {
    return new UnitLine(this.x1, this.y1, this.x2, this.y2, this.unit);
  }
}

class UnitCriticalLine extends UnitLine {
  constructor(x1, y1, x2, y2, unit, damageMult) {
    super(x1, y1, x2, y2, unit);
    this.damageMultiplier = damageMult !== null ? damageMult : 2;
  }

  getCriticalMultiplier() {
    return this.damageMultiplier;
  }

  clone() {
    return new UnitCriticalLine(this.x1, this.y1, this.x2, this.y2, this.unit, this.damageMultiplier);
  }
}

class BouncingLine extends UnitLine {
  forceBounce() {
    return true;
  }

  clone() {
    return new BouncingLine(this.x1, this.y1, this.x2, this.y2, this.unit);
  }
}

class AbilityTriggeringLine extends UnitLine {
  triggerHit(boardState, unit, intersection, projectile) {
    return this.unit.triggerHit(boardState, unit, intersection, projectile);
  }

  clone() {
    return new AbilityTriggeringLine(this.x1, this.y1, this.x2, this.y2, this.unit);
  }
}
