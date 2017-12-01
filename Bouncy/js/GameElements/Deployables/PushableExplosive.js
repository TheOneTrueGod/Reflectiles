class PushableExplosive extends ZoneEffect {
  constructor(x, y, owner, id, creatorAbilityID, owningPlayerID) {
    super(x, y, owner, id, creatorAbilityID, owningPlayerID);
  }

  setCreatorAbility(creatorAbilityID) {
    this.creatorAbility = AbilityDef.abilityDefList[creatorAbilityID];
    this.size = {
      left: 0, right: 0,
      top: 0, bottom: 0
    };

    this.SPRITE = this.creatorAbility.getOptionalParam('sprite', this.SPRITE);
  }

  dealDamage(boardState, amount) {
    return;
  }

  createSprite() {
    if (this.SPRITE && this.SPRITE.index && this.SPRITE.end_index) {
      this.healthBasedSprites = [];
      var container = new PIXI.Graphics();
      for (var i = this.SPRITE.index; i <= this.SPRITE.end_index; i++) {
        var sprite = new PIXI.Sprite(ImageLoader.getSquareTexture(this.SPRITE.texture,
          i
        ));
        sprite.anchor.set(0.5);
        sprite.visible = i == this.SPRITE.index;

        this.healthBasedSprites.push(sprite);

        container.addChild(sprite);
      }

      this.updateHealthSprite();

      container.width = Unit.UNIT_SIZE;
      container.height = Unit.UNIT_SIZE;

      this.spriteScale = {x: sprite.scale.x, y: sprite.scale.y};

      return container;
    }
    return super.createSprite();
  }

  updateHealthSprite() {
    for (var i = 0; i < this.healthBasedSprites.length; i++) {
      this.healthBasedSprites[i].visible = false;
      if (i == this.timeLeft.max - this.timeLeft.current) {
        this.healthBasedSprites[i].visible = true;
      }
    }
  }

  onTimeOut(boardState) {
    this.explode(boardState);
  }

  explode(boardState) {
    this.readyToDel = true;

    var abilList = this.creatorAbility.getOptionalParam('unit_abilities', []);
    for (var i = 0; i < abilList.length; i++) {
      let abil = abilList[i].initializedAbilDef;

      abil.doActionOnTick(this.owningPlayerID, 0, boardState, this, this);
    }
  }

  otherUnitEntering(boardState, unit) {
    /*var target = {x: this.x, y: this.y + Unit.UNIT_SIZE};
    var canEnter =
      boardState.sectors.canUnitEnter(boardState, this, target) &&
      boardState.unitEntering(this, target);

    if (canEnter) {
      boardState.sectors.removeUnit(this);
      this.setMoveTarget(target.x, target.y);
      boardState.sectors.addUnit(this);
    }*/
    this.readyToDel = true;
    return true;
  }

  createHealthBarSprite(sprite) {
    this.updateHealthSprite();
  }
}

PushableExplosive.AddToTypeMap();
