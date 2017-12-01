class UnitCore extends Unit {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
  }

  createSprite() {
    var sprite = new PIXI.Sprite(
      PIXI.loader.resources['core'].texture
    );

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0xFFFF00);
    graphics.drawCircle(0, 0, 20);
    graphics.endFill();

    this.selectedSprite = graphics;
    this.selectedSprite.visible = false;

    sprite.addChild(graphics);
    sprite.anchor.set(0.5);
    
    if (this.owner == $('#gameContainer').attr('playerID')) {
      if (!UnitCore.OUTLINE_FILTER_RED) {
        UnitCore.OUTLINE_FILTER_RED = new PIXI.filters.OutlineFilter(2, 0xff4000);
      }
      sprite.filters = [UnitCore.OUTLINE_FILTER_RED];
    } else {
      sprite.alpha = 0.8;
    }

    return sprite;
  }

  canSelect() {
    return MainGame.playerID == this.owner;
  }

  touchedByEnemy(boardState, unit) {
    if (unit.damage && this.y < boardState.getUnitThreshold()) {
      boardState.dealDamage(unit.damage);
      this.knockback();
    }
  }
  
  knockback() {
    this.y = this.y + Unit.UNIT_SIZE;
  }

  getMoveSpeed() {
    return 4;
  }

  runTick(boardState) {
    if (this.moveTarget) {
      var moveVec = Victor(this.moveTarget.x - this.x, this.moveTarget.y - this.y);
      var ang = Math.atan2(
        this.moveTarget.y - this.y,
        this.moveTarget.x - this.x
      );

      var moveSpeed = this.getMoveSpeed();

      if (moveVec.length() <= moveSpeed) {
        this.x = this.moveTarget.x;
        this.y = this.moveTarget.y;
        this.moveTarget = null;
      } else {
        this.x += Math.cos(ang) * moveSpeed;
        this.y += Math.sin(ang) * moveSpeed;
      }
    }
    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }
}

UnitCore.loadFromServerData = function(serverData) {
  return Unit.loadFromServerData(serverData);
}

UnitCore.AddToTypeMap();
