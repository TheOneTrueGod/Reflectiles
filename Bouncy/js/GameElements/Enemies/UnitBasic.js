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
      sprite = FreezeStatusEffect.addEffectSprite(this);
    } else if (effect == PoisonStatusEffect.getEffectType()) {
      sprite = PoisonStatusEffect.addEffectSprite(this);
    } else if (effect == InfectStatusEffect.getEffectType()) {
      sprite = InfectStatusEffect.addEffectSprite(this);
    } else if (effect == ShieldStatusEffect.getEffectType()) {
      sprite = ShieldStatusEffect.addEffectSprite(this);
    } else if (effect == WeaknessStatusEffect.getEffectType()) {
      sprite = WeaknessStatusEffect.addEffectSprite(this);
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

  createSpriteFromResource(resource) {
    var sprite = new PIXI.Sprite(
      PIXI.loader.resources[resource].texture
    );

    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);
    /*for (var effect in this.statusEffects) {
      this.addEffectSprite(this.statusEffects[effect].getEffectType());
    }*/

    sprite.width = this.physicsWidth;
    sprite.height = this.physicsHeight;
    return sprite;
  }

  createSprite() {
    this.createSpriteFromResource('byte_diamond_red');
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

  doHorizontalMovement(boardState) {
    var currPos = this.getCurrentPosition();
    let directions = [-1, 1];
    let pctMoved = boardState.sectors.getGridCoord(this).x / boardState.getMaxColumn();
    if (boardState.getRandom() >= pctMoved) {
      directions = [1, -1];
    }

    for (let dx of directions) {
      let targetPos = {x: currPos.x + dx * Unit.UNIT_SIZE, y: currPos.y};
      let canEnter =
        boardState.sectors.canUnitEnter(boardState, this, targetPos) &&
        boardState.unitEntering(this, targetPos);

      if (canEnter) {
        boardState.sectors.removeUnit(this);
        this.setMoveTarget(targetPos.x, targetPos.y);
        boardState.sectors.addUnit(this);
        return true;
      }
    }
    return false;
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

  getMoveTime() { return 20; }

  playMovement(pct) {
    this.x = lerp(this.startMovementPos.x, this.moveTarget.x, pct);
    this.y = lerp(this.startMovementPos.y, this.moveTarget.y, pct);
  }

  runTick(boardState) {
    super.runTick(boardState);
    if (this.moveTarget === null) {
      return;
    }
    var moveSpeed = this.getMoveSpeed();
    var targ = Victor(this.moveTarget.x - this.x, this.moveTarget.y - this.y);
    let movePct = boardState.tick / this.getMoveTime();
    if (movePct >= 1 && !this.spawnEffectTime) {
      this.x = this.moveTarget.x;
      this.y = this.moveTarget.y;
      this.moveTarget = null;
    } else if (this.startMovementPos && this.moveTarget) {
      this.playMovement(movePct);
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
