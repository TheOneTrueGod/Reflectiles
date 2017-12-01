class Physics {

}

// reflects a point
// https://stackoverflow.com/questions/573084/how-to-calculate-bounce-angle
Physics.reflect = function(angleIn, wallVector) {
  var vectorIn = Victor(Math.cos(angleIn), Math.sin(angleIn)).normalize();
  var normalizedWall = wallVector.clone().normalize();
  //console.log("NormaliedWall: ", normalizedWall);
  normal = Victor(normalizedWall.y, -normalizedWall.x); // Also try y, -x;
  //console.log(normal);
  var perpendicularComponent = normal.clone().multiplyScalar(vectorIn.clone().dot(normal));
  //console.log("perpendicularComponent: ", perpendicularComponent);
  var parallelComponent = vectorIn.clone().subtract(perpendicularComponent);
  //console.log("parallelComponent: ", parallelComponent);
  var vectorOut = parallelComponent.add(perpendicularComponent.multiplyScalar(-1));
  //console.log("VectorIn: ", vectorIn);
  //console.log("VectorOut: ", vectorOut);
  return vectorOut;
}

Physics.checkLineIntersection = function(
  line1StartX, line1StartY, line1EndX, line1EndY,
  line2StartX, line2StartY, line2EndX, line2EndY
) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator === 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
    /*
    // it is worth noting that this should be the same as:
    x = line2StartX + (b * (line2EndX - line2StartX));
    y = line2StartX + (b * (line2EndY - line2StartY));
    */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a >= 0 && a <= 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b >= 0 && b <= 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
}

Physics.truncate = function(x) {
  if (x < 0) { return Math.ceil(x); }
  return Math.floor(x);
}

Physics.findAllIntersectedLines = function(x1, y1, x2, y2, lines) {
  var hitLines = [];
  for (var i = 0; i < lines.length; i++) {
    var l2 = lines[i];
    var intersectionPoint = Physics.checkLineIntersection(
      x2, y2, x1, y1,
      l2.x1, l2.y1, l2.x2, l2.y2
    );
    if (
      intersectionPoint &&
      intersectionPoint.onLine1 && intersectionPoint.onLine2
    ) {
      var id = -1;
      if (l2.unit) { id = l2.unit.id; }
      hitLines.push({
        x: intersectionPoint.x, y: intersectionPoint.y, line: l2, id: id});
    }
  }

  hitLines.sort((i1, i2) => {
    var dist1 = (i1.x - x1) ** 2 + (i1.y - y1) ** 2;
    var dist2 =  (i2.x - x1) ** 2 + (i2.y - y1) ** 2;
    if (i1.line.unit && i2.line.unit && dist1 == dist2) {
      dist1 = distSqr(i1.line.unit, {x: x1, y: y1});
      dist2 = distSqr(i2.line.unit, {x: x1, y: y1});
    }
    if (dist1 > dist2) {
      return 1;
    } else if (dist2 > dist1) {
      return -1;
    }
  })
  return hitLines;
}

Physics.findIntersectPoint = function(x1, y1, x2, y2, lines, reflectOrPassThrough) {
  var closest = null;
  for (var i = 0; i < lines.length; i++) {
    var l2 = lines[i];
    if (reflectOrPassThrough && !reflectOrPassThrough(l2)) {
      continue;
    }
    var intersectionPoint = Physics.checkLineIntersection(
      x2, y2, x1, y1,
      l2.x1, l2.y1, l2.x2, l2.y2
    );
    if (
      Physics.truncate(intersectionPoint.x * 10000) === Physics.truncate(x1 * 10000) &&
      Physics.truncate(intersectionPoint.y * 10000) === Physics.truncate(y1 * 10000)
      ||
      Physics.truncate(intersectionPoint.x * 10000) === Physics.truncate(x2 * 10000) &&
      Physics.truncate(intersectionPoint.y * 10000) === Physics.truncate(y2 * 10000)
    ) {
      continue;
    }
    if (
      intersectionPoint &&
      intersectionPoint.onLine1 && intersectionPoint.onLine2
    ) {
      var id = -1;
      if (l2.unit) { id = l2.unit.id; }
      if (!closest) {
        closest = {x: intersectionPoint.x, y: intersectionPoint.y, line: l2, id: id};
      } else {
        var closestDist = Math.pow(x1 - closest.x, 2) + Math.pow(y1 - closest.y, 2);
        var newDist = Math.pow(x1 - intersectionPoint.x, 2) + Math.pow(y1 - intersectionPoint.y, 2);
        if (newDist < closestDist) {
          closest = {x: intersectionPoint.x, y: intersectionPoint.y, line: l2, id: id};
        }
      }
    }
  }
  return closest;
}

Physics.doLineReflections = function(x1, y1, angle, distance, lines, collisionCallback, reflectOrPassThrough) {
  var returnLines = [];
  var intersections = [];
  var x2 = x1 + Math.cos(angle) * distance;
  var y2 = y1 + Math.sin(angle) * distance;
  var linesToTest = lines;
  if (lines instanceof Function) {
    linesToTest = lines(new Line(x1, y1, x2, y2));
  }
  var intersection = Physics.findIntersectPoint(x1, y1, x2, y2, linesToTest, reflectOrPassThrough);
  if (intersection) {
    x2 = intersection.x;
    y2 = intersection.y;
  }

  returnLines.push(new Line(
    x1, y1,
    x2, y2
  ));

  if (collisionCallback && reflectOrPassThrough) {
    var hitLines = Physics.findAllIntersectedLines(x1, y1, x2, y2, linesToTest);
    for (var i = 0; i < hitLines.length; i++) {
      if (!intersection || hitLines[i].line !== intersection.line) {
        intersections.push(hitLines[i]);
      }
    }
    if (intersection) {
      intersections.push(intersection);
    }
  }

  if (intersection) {
    var pctDone = Math.pow(Math.pow(y1 - intersection.y, 2) + Math.pow(x1 - intersection.x, 2), 0.5) / distance;
    var distanceLeft = distance * (1 - pctDone);
    var reflectVector = Physics.reflect(
      angle,
      Victor(
        intersection.line.x2 - intersection.line.x1,
        intersection.line.y2 - intersection.line.y1
      )
    );
    reflectVector.multiplyScalar(distanceLeft);
    var recurseResults = Physics.doLineReflections(
      intersection.x, intersection.y,
      reflectVector.horizontalAngle(), distanceLeft,
      lines, collisionCallback, reflectOrPassThrough);

    returnLines = returnLines.concat(recurseResults.reflection_lines);
    intersections = intersections.concat(recurseResults.intersections);
  }

  return {reflection_lines: returnLines, intersections: deduplicate(intersections)};
}

class Line {
  constructor(x1, y1, x2, y2) {
    if (!(this instanceof Line)) {
      return new Line(x1, y1, x2, y2);
    }
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  getVector() {
    return Victor(this.x2 - this.x1, this.y2 - this.y1);
  }

  clone() {
    return new Line(this.x1, this.y1, this.x2, this.y2);
  }

  addX(x) {
    this.x1 += x;
    this.x2 += x;
    return this;
  }

  addY(y) {
    this.y1 += y;
    this.y2 += y;
    return this;
  }

  getNormal() {
    return this.getVector().getNormal();
  }

  getCenterPoint() {
    return Victor((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
  }
}
