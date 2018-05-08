class ZoneEffect extends Unit {
  constructor(x, y, owner, id, creatorAbilityID, owningPlayerID) {
    super(x, y, owner, id);
    this.timeLeft = {current: 3, max: 3}; // Placeholder.  Will replace in a bit.
    this.DELETION_PHASE = TurnPhasesEnum.ENEMY_SPAWN;
    this.SPRITE = null;
    this.zone_icon_sprite = null;
    this.owningPlayerID = owningPlayerID;
    this.spriteScale = {x: 1, y: 1};
    if (creatorAbilityID !== undefined) {
      this.setCreatorAbility(creatorAbilityID);
      this.setMaxHealthValues();
      this.health.current = this.health.max;
      this.armour.current = this.armour.max;
      this.shield.current = this.shield.max;
      var duration = this.creatorAbility.getOptionalParam('duration', 3);
      this.timeLeft = {current: duration, max: duration};
    }

    this.createCollisionBox();
  }

  setMaxHealthValues() {
    var healthTypes = this.creatorAbility.getOptionalParam('zone_health', this.health);
    let health = 0;
    let armour = 0;
    let shield = 0;
    if (healthTypes.health instanceof Function) { health = healthTypes.health(); }
    if (healthTypes.armour instanceof Function) { armour = healthTypes.armour(); }
    if (healthTypes.shield instanceof Function) { shield = healthTypes.shield(); }

    this.health.max = health;
    this.armour.max = armour;
    this.shield.max = shield;
  }

  isRealUnit() {
    return true;
  }

  dealDamage(boardState, amount, source, damageType) {
    if (this.creatorAbility.isZoneDamageableByPlayers()) {
      return super.dealDamage(boardState, amount, source, damageType);
    }
    return;
  }

  createTooltip() {
    return UnitTooltips.createZoneTooltip(this);
  }

  addStatusEffect(effect) { /* Zones are immune */ }

  hitsEnemyProjectiles() {
    var projectileInteraction = this.creatorAbility.getOptionalParam(
      "projectile_interaction", null);
    return idx(projectileInteraction, "enemy_projectiles", false) !== false;
  }

  hitsPlayerProjectiles() {
    var projectileInteraction = this.creatorAbility.getOptionalParam(
      "projectile_interaction", null);
    return idx(projectileInteraction, "player_projectiles", false) !== false;
  }

  getInteractionForProjectile(projectile) {
    var projectileInteraction = this.creatorAbility.getOptionalParam(
      "projectile_interaction", null);
    if (!projectileInteraction) { return null; }

    if (projectile instanceof EnemyProjectile) {
      return idx(projectileInteraction, "enemy_projectiles", null);
    } else if (projectile instanceof Projectile) {
      return idx(projectileInteraction, "player_projectiles", null);
    }
    return {};
  }

  canProjectileHit(projectile) {
    if (this.readyToDelete()) {
      return false;
    }
    let interaction = this.getInteractionForProjectile(projectile);
    if (interaction === null) { return false; }
    return true;
  }

  triggerHit(boardState, unit, intersection, projectile) {
    let interaction = this.getInteractionForProjectile(projectile);
    if (interaction === null) {
      return;
    }

    if (interaction.destroy) {
      this.createHealthBarSprite(this.gameSprite);
      projectile.readyToDel = true;
      if (!this.creatorAbility.getOptionalParam('invulnerable', false)) {
        this.decreaseTime(boardState, 1);
      }
    }

    if (interaction.buff) {
      switch (interaction.buff.type) {
        case Projectile.BuffTypes.DAMAGE:
          projectile.addBuff(new ProjectileDamageBuff());
          break;
        default:
        throw new Error("unhandled buff type: [" + interaction.buff.type + "]");
      }
    }

    if (interaction.ability && interaction.ability.initializedAbilDef) {
      interaction.ability.initializedAbilDef.doActionOnTick(
        this.owningPlayerID,
        0,
        boardState,
        {x: this.x, y: this.y},
        {x: this.x, y: this.y - Unit.UNIT_SIZE},
        this
      );
    }
  }

  createCollisionBox() {
    if (!this.creatorAbility) { return; }
    var projectileInteraction = this.creatorAbility.getOptionalParam(
      "projectile_interaction", null);

    if (projectileInteraction) {
      var l = -((this.size.left + 0.5) * this.physicsWidth);
      var r = ((this.size.right + 0.5) * this.physicsWidth);
      var t = -((this.size.top + 0.5) * this.physicsHeight);
      var b = ((this.size.bottom + 0.5) * this.physicsHeight);

      var lineType = ZoneLine;
      /*if (projectileInteraction.force_bounce) {
        lineType = BouncingLine;
      }*/

      var offset = 0;
      /*if (!(this instanceof Turret)) {
        offset = 1;
      }*/
      this.collisionBox = [
        new lineType(l - offset, t - offset, r + offset, t - offset, this), // Top
        new lineType(r + offset, t - offset, r + offset, b + offset, this), // Right
        new lineType(r + offset, b + offset, l - offset, b + offset, this), // Bottom
        new lineType(l - offset, b + offset, l - offset, t - offset, this), // Left
      ];
    }
  }

  getSize() {
    return {
      left: this.size.left, right: this.size.right,
      top: this.size.top, bottom: this.size.bottom
    };
  }

  setCreatorAbility(creatorAbilityID) {
    this.creatorAbility = AbilityDef.abilityDefList[creatorAbilityID];
    this.size = this.creatorAbility.getZoneSize();

    this.SPRITE = this.creatorAbility.getOptionalParam('sprite', this.SPRITE);
    this.ZONE_ICON = this.creatorAbility.getOptionalParam('zone_icon', this.ZONE_ICON);
    this.DELETION_PHASE = this.creatorAbility.getOptionalParam(
      'deletion_phase', this.DELETION_PHASE);

    this.createCollisionBox();

    var duration = this.creatorAbility.getOptionalParam('duration', 3);
    this.timeLeft.max = duration;
  }

  endOfPhase(boardState, phase) {
    super.endOfPhase(boardState, phase);
    this.creatorAbility.endOfPhase(boardState, phase, this);
    if (phase === this.DELETION_PHASE) {
      this.decreaseTime(boardState, 1);
      this.createHealthBarSprite(this.gameSprite);
    }
  }

  decreaseTime(boardState, amount) {
    this.timeLeft.current -= amount;
    if (this.timeLeft.current <= 0) {
      this.readyToDel = true;
      this.onTimeOut(boardState);
    }
    this.createHealthBarSprite(this.gameSprite);
  }

  onTimeOut(boardState) {

  }

  createSprite() {
    var sprite;
    if (this.SPRITE) {
      if (
        this.SPRITE instanceof Object &&
        this.SPRITE.texture !== undefined &&
        this.SPRITE.index !== undefined
      ) {
        sprite = new PIXI.Sprite(ImageLoader.getSquareTexture(this.SPRITE.texture,
          this.SPRITE.index
        ));
        sprite.anchor.set(0.5);
      } else {
        sprite = new PIXI.Sprite(
          PIXI.loader.resources[this.SPRITE].texture
        );
        sprite.anchor.set(0.5);
      }
      sprite.width = Unit.UNIT_SIZE;
      sprite.height = Unit.UNIT_SIZE;
      this.spriteScale = {x: sprite.scale.x, y: sprite.scale.y};
    } else {
      sprite = new PIXI.Graphics();
      sprite.position.set(this.x, this.y);
      let color = 0x00AA00;
      if (this.creatorAbility.ZONE_TYPE == ZoneAbilityDef.ZoneTypes.MOLOTOV) {
        color = 0xAA0000;
      }
      sprite.lineStyle(4, color);
      var left = ((this.size.left + 0.5) * Unit.UNIT_SIZE);
      var right = ((this.size.right + 0.5) * Unit.UNIT_SIZE);
      var top = ((this.size.top + 0.5) * Unit.UNIT_SIZE);
      var bottom = ((this.size.bottom + 0.5) * Unit.UNIT_SIZE);
      sprite.drawRect(
        -left + 2, -top + 2,
        left + right - 4, top + bottom - 4
      );

      sprite.lineStyle(1, color);
      sprite.drawRect(
        -left + 8, -top + 8,
        left + right - 16, top + bottom - 16
      );
      if (this.creatorAbility.ZONE_TYPE == ZoneAbilityDef.ZoneTypes.MOLOTOV) {
        sprite.lineStyle(1, color);
        sprite.drawRect(
          -left + 12, -top + 12,
          left + right - 24, top + bottom - 24
        );
      }

      if (this.ZONE_ICON) {

        let backgroundSprite =
          new PIXI.Sprite(PIXI.loader.resources[this.ZONE_ICON].texture);
        backgroundSprite.anchor.set(0.5);
        backgroundSprite.width = 25;
        backgroundSprite.height = 25;
        sprite.addChild(backgroundSprite);
        backgroundSprite.tint = 0xFFFFFF;

        this.zone_icon_sprite =
          new PIXI.Sprite(PIXI.loader.resources[this.ZONE_ICON].texture);
        this.zone_icon_sprite.anchor.set(0.5);
        this.zone_icon_sprite.width = 25;
        this.zone_icon_sprite.height = 25;
        sprite.addChild(this.zone_icon_sprite);

        this.zone_icon_sprite.tint = 0x00FF00;
      }
      this.createHealthBarSprite(sprite);
    }

    return sprite;
  }

  addToBackOfStage() {
    return true;
  }

  createHealthBarSprite(sprite) {
    // TODO:  If you're seeing some slowdown, there's probably a better way of doing this.
    if (this.healthBarSprites.textSprite) {
      this.gameSprite.removeChild(this.healthBarSprites.textSprite);
      this.healthBarSprites.textSprite = null;
    }
    var healthPct = this.timeLeft.current / Math.max(this.timeLeft.max, 1);
    if (this.zone_icon_sprite) {
      this.zone_icon_sprite.alpha = healthPct;
    }
    if (this.health.current <= 0) { return; }
    var fontSize = 14;// + Math.floor(healthPct) * 6;
    var healthBarGraphic = new PIXI.Text(
      this.timeLeft.current,
      {
        fontWeight: 'bold',
        fontSize: fontSize + 'px',
        fontFamily: 'sans-serif',

        fill : 0x00AA00,
        align : 'center',

        stroke: 0x000000,
        strokeThickness: 4
      }
    );
    healthBarGraphic.anchor.set(0.5);
    healthBarGraphic.position.set(
      (-this.size.left / 2 + this.size.right / 2) * Unit.UNIT_SIZE,
      (-this.size.top / 2 + this.size.bottom / 2) * Unit.UNIT_SIZE
    );
    sprite.addChild(healthBarGraphic);

    this.healthBarSprites.textSprite = healthBarGraphic;
  }

  serializeData() {
    return {
      'duration': this.timeLeft,
      'creator_id': this.creatorAbility.index,
      'owning_player_id': this.owningPlayerID,
    };
  }

  loadSerializedData(data) {
    this.timeLeft = data.duration;
    this.setCreatorAbility(data.creator_id);
    this.owningPlayerID = data.owning_player_id;
  }

  preventsUnitEntry(unit) {
    if (unit instanceof UnitCore) {
      return idx(this.creatorAbility.getOptionalParam('unit_interaction', {}), 'prevent_player_entry', false);
    }
    return false;
  }

  otherUnitEntering(boardState, unit) {
    this.creatorAbility.unitEnteringZone(boardState, unit, this);
    return this.creatorAbility.canUnitPassThrough(unit);
  }
}

ZoneEffect.AddToTypeMap();
