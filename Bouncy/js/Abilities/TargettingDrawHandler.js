class TargettingDrawHandler {
  static createSquareTarget(target, size, color) {
    var lineGraphic = new PIXI.Graphics();
    var pos = MainGame.boardState.sectors.snapPositionToGrid(target);

    var left = ((size.left + 0.5) * Unit.UNIT_SIZE);
    var right = ((size.right + 0.5) * Unit.UNIT_SIZE);
    var top = ((size.top + 0.5) * Unit.UNIT_SIZE);
    var bottom = ((size.bottom + 0.5) * Unit.UNIT_SIZE);

    lineGraphic.position.set(pos.x, pos.y);

    lineGraphic
      .lineStyle(1, color)
      .drawRect(
        -left, -top,
        left + right, top + bottom
      );

    return lineGraphic;
  }
}
