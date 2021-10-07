class EnemyAbility {
  constructor(unit) {
    this.unit = unit;
  }

  doEffects(boardState, forecast) {
    
  }

  createForecastGraphic(user, endPos, color) {
    const startPos = { x: user.x, y: user.y };

    // Create a new Graphics object and add it to the scene
    var lineGraphic = new PIXI.Graphics();
    let circleSize = 25;

    var angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
    var dist = ((endPos.x - startPos.x) ** 2 + (endPos.y - startPos.y) ** 2) ** 0.5;
    let maxDist = 50;

    if (dist < maxDist || true) {
      lineGraphic.lineStyle(1, color)
        .moveTo(startPos.x, startPos.y);
      lineGraphic.lineTo(endPos.x, endPos.y);
    } else {
      // draw two line fragments, one from the source and one from the destination.
    }
    lineGraphic.drawCircle(endPos.x, endPos.y, circleSize);

    return lineGraphic;
  }
}
