class ProjectileCurveHandler {
  constructor(curveDef) {
    this.type = curveDef.curve_type;
    this.curve_amount = curveDef.curve_amount;
    this.curve_time = curveDef.curve_time;
  }

  doCurveEffects(projectile, currTick) {
    if (currTick < this.curve_time) {
      projectile.angle += this.curve_amount;
    }
  }

  static getCurveHandler(curveDef) {
    if (curveDef === null) {
      return null;
    }
    return new ProjectileCurveHandler(curveDef);
  }
}

ProjectileCurveHandler.CURVE_TYPES = {
  TO_ANGLE: 'to_angle',
  CONSTANT_CURVE: 'constant_curve',
}
