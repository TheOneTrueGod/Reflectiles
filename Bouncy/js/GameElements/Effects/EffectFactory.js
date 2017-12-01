class EffectFactory {}

EffectFactory.createUnitDyingEffect = function(boardState, unit) {
  if (
    !(unit instanceof UnitBasic) &&
    !(unit instanceof Turret)
  ) {
    return;
  }
  var num_shards = 2;
  for (var x = 0; x < num_shards; x++) {
    for (var y = 0; y < num_shards; y++) {
      boardState.addProjectile(
        new SpriteShatterEffect(
          unit.getShatterSprite(),
          {x: unit.x, y: unit.y},
          {x: x / num_shards, y: y / num_shards, w: 1 / num_shards, h: 1 / num_shards},
          {x: (x - (num_shards - 1) / 2),
           y: (y - (num_shards - 1) / 2)
         }, // speed
          20
        )
      );
    }
  }
}

EffectFactory.createDamagePlayersEffect = function(boardState, x, y) {
  for (var i = -2; i <= 2; i++) {
    var angle = -Math.PI / 2.0 + Math.PI / 8.0 * i;
    boardState.addProjectile(
      new LineEffect(new Line(
        x + Math.cos(angle) * 10,
        y + Math.sin(angle) * 10,
        x + Math.cos(angle) * 25,
        y + Math.sin(angle) * 25
      ),
      0xFF0000,
      {x: Math.cos(angle), y: Math.sin(angle)}
      )
    );
  }
}

EffectFactory.createDamageEntireUnitEffect = function(boardState, targetUnit) {
  if (targetUnit.readyToDelete()) { return; }
  var collisionBox = targetUnit.getCollisionBox();
  for (var i = 0; i < collisionBox.length; i++) {
    boardState.addProjectile(new LineEffect(collisionBox[i]));
  }
}

EffectFactory.createExplosionSpriteAtUnit = function(boardState, targetPos, AOESprite) {
  if (!AOESprite) { return; }

  for (var i = 0; i < 2; i++) {
    boardState.addProjectile(
      new SpriteEffect(
        {
          x: targetPos.x + (Math.random() * 0.5 - 0.25) * Unit.UNIT_SIZE,
          y: targetPos.y + (Math.random() * 0.5 - 0.25) * Unit.UNIT_SIZE},
        AOESprite, 0.5, 15
      )
    );
  }
}

EffectFactory.createDamageEffect = function(boardState, intersection) {
  var color = 0xffffff;
  if (intersection.line instanceof UnitCriticalLine) {
    color = 0xff0000;
  }
  if (intersection.line) {
    var bullets = 4;
    for (var i = 0; i < bullets; i++) {
      var centerPoint = intersection.line.getCenterPoint();
      var angle = Math.PI / 4 * (i - (bullets / 2 - 0.5)) / (bullets / 2 - 0.5);
      var normal = intersection.line.getNormal();
      //console.log(normal);
      boardState.addProjectile(new CircleEffect(
        centerPoint, 1, 0xffffff, normal.multiplyScalar(2).addAngle(angle)
      ));
    }

    boardState.addProjectile(
      new LineEffect(intersection.line, color)
    );

  }
}

EffectFactory.createExplosionEffect = function(boardState, unit) {

}
