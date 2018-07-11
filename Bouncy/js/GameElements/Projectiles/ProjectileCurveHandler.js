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

  static getCurveHandler(curveDef, startAngle, aimAngle) {
    if (curveDef === null) {
      return null;
    }
    switch (curveDef.type) {
      case ProjectileCurveHandler.CURVE_TYPES.CONSTANT_CURVE:
        return new ProjectileCurveHandler(curveDef);
      case ProjectileCurveHandler.CURVE_TYPES.TO_AIM_ANGLE:
        return new ProjectileCurveHandlerToAimAngle(curveDef, startAngle, aimAngle);
    }
    throw new Error("No curve handler for curve def '" + curveDef + "'");
  }
}

class ProjectileCurveHandlerToAimAngle extends ProjectileCurveHandler {
  constructor(curveDef, startAngle, aimAngle) {
    super(curveDef);
    let curve_amount = (aimAngle - startAngle);
    if (curve_amount > Math.PI) {
      curve_amount -= Math.PI * 2;
    } else if (curve_amount < -Math.PI) {
      curve_amount += Math.PI * 2;
    }

    this.curve_amount = curve_amount / this.curve_time;
  }
}

ProjectileCurveHandler.CURVE_TYPES = {
  TO_ANGLE: 'to_angle',
  TO_AIM_ANGLE: 'to_aim_angle',
  CONSTANT_CURVE: 'constant_curve',
}
