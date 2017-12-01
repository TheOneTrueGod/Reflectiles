class UnitBasic extends Unit {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);

    this.movementCredits = 0;
    this.movementSpeed = NumbersBalancer.getUnitSpeed(this);
    this.damage = NumbersBalancer.getUnitDamage(this);
  }

  createCollisionBox() {
    this.collisionBox = [
      new UnitLine(0, -this.physicsHeight / 2, this.physicsWidth / 2, 0, this), // Top Right
      new UnitLine(this.physicsWidth / 2, 0, 0, this.physicsHeight / 2, this), // Bottom Right
      new UnitLine(0, this.physicsHeight / 2, -this.physicsWidth / 2, 0, this), // Bottom Left
      new UnitLine(-this.physicsWidth / 2, 0, 0, -this.physicsHeight / 2, this), // Top Left
    ];
  }

  addEffectSprite(effect) {
    if (!this.gameSprite) {
      return;
    }
    var sprite = null;
    if (effect == FreezeStatusEffect.getEffectType()) {
      sprite = new PIXI.Graphics();
      sprite.position.set(-this.physicsWidth / 2, -this.physicsHeight / 2);
      sprite.lineStyle(3, 0x0000FF)
         .moveTo(0, 0)
         .lineTo(this.physicsWidth, this.physicsHeight)
         .moveTo(this.physicsWidth, 0)
         .lineTo(0, this.physicsHeight)
         .moveTo(0, 0)
         .lineTo(this.physicsWidth, 0)
         .lineTo(this.physicsWidth, this.physicsHeight)
         .lineTo(0, this.physicsHeight)
         .lineTo(0, 0);
      this.gameSprite.addChildAt(sprite, this.gameSprite.children.length - 1);
    } else if (effect == PoisonStatusEffect.getEffectType()) {
      sprite = new PIXI.Graphics();
      sprite.position.set(0, 0);
      var color = 0x00AA00;
      var alpha = 0.5;
      sprite.lineStyle(0, 0, 0)
        .beginFill(color, alpha);

      var path = [];
      for (var i = 0; i < this.collisionBox.length; i++) {
        path.push(new PIXI.Point(
          this.collisionBox[i].x1 / this.gameSprite.scale.x,
          this.collisionBox[i].y1 / this.gameSprite.scale.y
        ));
      }

      sprite.drawPolygon(path);
      this.gameSprite.addChildAt(sprite, 0);
    } else if (effect == InfectStatusEffect.getEffectType()) {
      sprite = new PIXI.Graphics();
      sprite.position.set(0, 0);
      var color = 0x6F256F;
      var alpha = 0.5;
      sprite.beginFill(color, alpha).lineStyle(0, 0, 1);

      var path = [];
      for (var i = 0; i < this.collisionBox.length; i++) {
        path.push(new PIXI.Point(
          this.collisionBox[i].x1 / this.gameSprite.scale.x,
          this.collisionBox[i].y1 / this.gameSprite.scale.y
        ));
      }

      sprite.drawPolygon(path);
      this.gameSprite.addChildAt(sprite, 0);
    } else if (effect == ShieldStatusEffect.getEffectType()) {
      if (!UnitBasic.OUTLINE_FILTER_PURPLE) {
        UnitBasic.OUTLINE_FILTER_PURPLE =
          new PIXI.filters.OutlineFilter(2, 0xc119b9);
      }
      this.gameSprite.filters = [UnitBasic.OUTLINE_FILTER_PURPLE];
      this.createHealthBarSprite(this.gameSprite);
    }
    if (sprite) {

      this.effectSprites[effect] = sprite;
      //this.healthBarSprites.textSprite.bringToFront();
    }
  }

  serializeData() {
    return {
      'movement_credits': this.movementCredits
    };
  }

  loadSerializedData(data) {
    this.movementCredits = data.movement_credits;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  addPhysicsLines(sprite, color) {
    color = color ? color : 0xff0000;
    for (var i = 0; i < this.collisionBox.length; i++) {
      var lineGraphic = new PIXI.Graphics();
      var line = this.collisionBox[i];
      lineGraphic.position.set(
        line.x1 / sprite.scale.x,
        line.y1 / sprite.scale.y
      );
      lineGraphic.lineStyle(3, color)
             .moveTo(0, 0)
             .lineTo(
               (line.x2 - line.x1) / sprite.scale.x,
               (line.y2 - line.y1) / sprite.scale.y
             );
      sprite.addChild(lineGraphic);
    }
  }

  createHealthBarSprite(sprite) {
    // TODO:  If you're seeing some slowdown, there's probably a better way of doing this.
    if (this.healthBarSprites.textSprite) {
      this.gameSprite.removeChild(this.healthBarSprites.textSprite);
      this.healthBarSprites.textSprite = null;
    }
    if (this.health.current <= 0) { return; }
    var colour = 0xFFFFFF;
    var text = this.health.current + this.getShield().current + this.getArmour().current;
    if (this.getShield().current > 0) {
      colour = 0xc119b9;
    } else if (this.getArmour().current > 0) {
      colour = 'darkgray';
    }

    var fontSize = 10;
    var healthBarGraphic = new PIXI.Text(
      text,
      {
        fontWeight: 'bold',
        fontSize: fontSize + 'px',
        fontFamily: 'sans-serif',
        fill : colour,
        align : 'center',

        stroke: 0x000000,
        strokeThickness: 4
      }
    );
    healthBarGraphic.anchor.set(0.5);
    healthBarGraphic.position.set(0, 20);
    sprite.addChild(healthBarGraphic);

    this.healthBarSprites.textSprite = healthBarGraphic;
  }

  createSprite() {
    var sprite = new PIXI.Sprite(
      PIXI.loader.resources['byte_diamond_red'].texture
    );

    this.addPhysicsLines(sprite);
    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);
    for (var effect in this.statusEffects) {
      this.addEffectSprite(this.statusEffects[effect].getEffectType());
    }

    sprite.width = Unit.UNIT_SIZE;
    sprite.height = Unit.UNIT_SIZE;
    return sprite;
  }

  canUseAbilities() {
    return !this.hasStatusEffect(FreezeStatusEffect);
  }
  
  moveForward(boardState) {
    while (this.movementCredits >= 1) {
      var currPos = this.getCurrentPosition();
      var targetPos = {x: currPos.x, y: currPos.y + Unit.UNIT_SIZE};
      var canEnter =
        boardState.sectors.canUnitEnter(boardState, this, targetPos) &&
        boardState.unitEntering(this, targetPos);

      if (canEnter) {
        boardState.sectors.removeUnit(this);
        this.setMoveTarget(targetPos.x, targetPos.y);
        boardState.sectors.addUnit(this);
        this.movementCredits -= 1;
      } else {
        this.movementCredits = Math.min(Math.max(0, 1 - this.movementSpeed), this.movementCredits);
      }
    }
  }

  doMovement(boardState) {
    if (this.hasStatusEffect(FreezeStatusEffect)) {
      return;
    }
    this.movementCredits += this.movementSpeed;
    if (this.movementCredits < 1) { return; }
    this.moveForward(boardState);
  }

  getMoveSpeed() {
    return 2;
  }

  runTick(boardState) {
    if (this.moveTarget === null) {
      return;
    }
    var moveSpeed = this.getMoveSpeed();
    var targ = Victor(this.moveTarget.x - this.x, this.moveTarget.y - this.y);
    if (targ.length() <= moveSpeed) {
      this.x = this.moveTarget.x;
      this.y = this.moveTarget.y;
      this.moveTarget = null;
    } else {
      targ.normalize().multiplyScalar(moveSpeed);
      this.x += targ.x;
      this.y += targ.y;
    }

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;

    if (this.y + this.getSize().bottom * Unit.UNIT_SIZE >= boardState.getUnitThreshold()) {
      this.readyToDel = true;
      boardState.dealDamage(this.damage);
      EffectFactory.createDamagePlayersEffect(
        boardState,
        this.x,
        this.y + this.physicsHeight / 2.0,
      );
    }
  }
}

UnitBasic.loadFromServerData = function(serverData) {
  return Unit.loadFromServerData(serverData);
}

UnitBasic.createAbilityDefs = function() {
  UnitKnight.createAbilityDef();
  UnitBlocker.createAbilityDef();
  UnitProtector.createAbilityDef();
}

UnitBasic.AddToTypeMap();
