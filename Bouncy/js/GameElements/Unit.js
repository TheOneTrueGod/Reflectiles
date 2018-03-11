class Unit {
  constructor(x, y, owner, id) {
    this.x = x;
    this.y = y;
    this.gameSprite = null;
    this.owner = owner;
    if (!id) {
      this.id = MainGame.boardState.getUnitID();
    } else {
      this.id = id;
    }
    this.selectedSprite = null;
    this.moveTarget = null;

    // See Also Unit.UNIT_SIZE
    let unitSize = this.getUnitSize();
    this.physicsWidth = unitSize.x;
    this.physicsHeight = unitSize.y;
    this.collisionBox = [];
    var health = NumbersBalancer.getUnitHealth(this);
    this.health = {current: health, max: health};
    if (isNaN(this.health.current) || isNaN(this.health.max)) {
      debugger;
    }
    var armour = NumbersBalancer.getUnitArmour(this);
    this.armour = {current: armour, max: armour};
    var shield = NumbersBalancer.getUnitShield(this);
    this.shield = {current: shield, max: shield};
    this.readyToDel = false;

    this.damage = 1;

    this.statusEffects = {};
    this.spawnedThisTurn = true;

    this.healthBarSprites = {
      textSprite: null,
      bar: null
    };
    this.effectSprites = {};
    this.traits = {};

    this.createCollisionBox();
  }

  isInRangeOfCircle(point, radius) {
    let collisionBox = this.getCollisionBox();
    for (let collisionLine of collisionBox) {
      if (Physics.distToSegment(collisionLine, point) <= radius) {
        return true;
      }
    }
    return false;
  }

  doSpawnEffect(boardState) {

  }

  getTraitValue(trait) {
    return this.traits[trait] ? this.traits[trait] : 0;
  }

  getUnitSize() {
    return {x: Unit.UNIT_SIZE, y: Unit.UNIT_SIZE};
  }

  canProjectileHit() { return true; }

  createCollisionBox() {}

  doUnitActions(boardState) {}

  createTooltip() {
    return UnitTooltips.createTooltip(this);
  }

  getStatusEffect(effect) {
    return this.statusEffects[effect.getEffectType()];
  }

  hasStatusEffect(effect) {
    return effect.getEffectType() in this.statusEffects;
  }

  isAlive() {
    return this.health.current > 0;
  }

  heal(amount) {
    this.setHealth(
      Math.min(this.health.max, this.health.current + amount)
    );
  }

  setHealth(amount) {
    this.health.current = Math.max(amount, 0);
    if (
      this.health.current <= 0 && (
        this.health.max > 0 ||
        (
          this.armour.current <= 0 &&
          this.shield.current <= 0
        )
      )
    ) {
      this.readyToDel = true;
    }

    if (isNaN(this.health.current) || isNaN(this.armour.current) || isNaN(this.shield.current)) {
      this.readyToDel = true;
    }

    if (this.healthBarSprites.textSprite && this.gameSprite) {
      this.createHealthBarSprite(this.gameSprite);
    }
  }

  getHealth() {
    return this.health;
  }

  getArmour() {
    return this.armour;
  }

  getShield() {
    var toRet = {current: this.shield.current, max: this.shield.max};
    if (this.hasStatusEffect(ShieldStatusEffect)) {
      var buffCurrent = this.getStatusEffect(ShieldStatusEffect).health.current;
      var buffMax = this.getStatusEffect(ShieldStatusEffect).health.max;
      toRet.current += buffCurrent;
      toRet.max += buffMax;
    }
    return toRet;
  }

  dealDamage(boardState, amount, source) {
    let abilID = null;
    let playerID = null;
    if (source instanceof Projectile) {
      abilID = AbilityDef.findAbsoluteParent(source.abilityDef.index);
      playerID = source.playerID;
    } else if (source instanceof StatusEffect) {
      abilID = AbilityDef.findAbsoluteParent(source.abilityID);
      playerID = source.playerID;
    } else if (source instanceof ZoneEffect && source.owningPlayerID) {
      abilID = AbilityDef.findAbsoluteParent(source.creatorAbility.index);
      playerID = source.owningPlayerID;
    }

    let owningPlayer = boardState.getPlayerUnit(playerID);

    let damageDealt = 0;
    var damageMult = 1;
    for (var key in this.statusEffects) {
      damageMult *= this.statusEffects[key].getDamageMultiplier()
    }
    if (owningPlayer) {
      let damageStatusEffect = owningPlayer.getStatusEffect(PlayerDamageStatusEffect);
      if (damageStatusEffect) {
        damageMult *= damageStatusEffect.amount;
      }
    }
    var maxDamageDealt = this.health.current;
    var damageToDeal = Math.max(amount * damageMult, 0);

    let resiliantValue = this.getTraitValue(Unit.UNIT_TRAITS.RESILIANT);
    if (resiliantValue) {
      damageToDeal = Math.min(damageToDeal, resiliantValue);
    }

    if (this.hasStatusEffect(ShieldStatusEffect)) {
      var shieldEffect = this.statusEffects[ShieldStatusEffect.getEffectType()];
      maxDamageDealt += shieldEffect.health.current;
      let shieldDamage = shieldEffect.dealDamage(Math.floor(Math.max(damageToDeal, 0)));
      damageDealt += shieldDamage;
      damageToDeal -= shieldDamage;

      if (shieldEffect.readyToDelete()) {
        this.removeStatusEffect(shieldEffect.getEffectType());
      }
    }

    if (this.shield.current > 0) {
      maxDamageDealt += this.shield.current;
      if (this.shield.current >= damageToDeal) {
        this.shield.current -= damageToDeal;
        damageDealt += damageToDeal;
        damageToDeal = 0;
      } else {
        damageDealt += this.shield.current;
        damageToDeal -= this.shield.current;
        this.shield.current = 0;
      }
    }

    if (this.armour.current > 0) {
      maxDamageDealt += this.armour.current;
      if (this.armour.current >= damageToDeal) {
        damageDealt += damageToDeal;
        this.armour.current -= damageToDeal;
        damageToDeal = 0;
      } else {
        damageDealt += this.armour.current;
        damageToDeal -= this.armour.current;
        this.armour.current = 0;
      }
    }

    maxDamageDealt = maxDamageDealt / Math.max(damageMult, 0.00001);
    damageDealt += Math.min(this.health.current, Math.floor(damageToDeal));
    this.setHealth(this.health.current - Math.floor(Math.max(damageToDeal, 0)));
    if (amount > 0) {
      boardState.resetNoActionKillSwitch();
    }

    if (!abilID) {
      console.warn("Unknown ability ID: " + abilID);
    }

    if (playerID) {
      boardState.gameStats.addPlayerDamage(playerID, abilID, damageDealt);
    } else {
      boardState.gameStats.addPlayerDamage('unknown', "?", damageDealt);
      console.warn("Unknown source: ", source);
    }

    return damageDealt / Math.max(damageMult, 0.00001);
  }

  delete() {
    this.readyToDel = true;
  }

  readyToDelete() {
    return this.readyToDel;
  }

  getCollisionBox() {
    if (this.readyToDelete()) { return []; }
    if (this.memoizedCollisionBox) {
      return this.memoizedCollisionBox;
    }
    var self = this;
    var collisionLines = this.collisionBox;
    if (this.hasStatusEffect(FreezeStatusEffect)) {
      var t = -this.physicsHeight / 2;
      var b = this.physicsHeight / 2;
      var r = this.physicsWidth / 2;
      var l = -this.physicsWidth / 2;
      var offset = 0;
      collisionLines = [
        new UnitLine(l - offset, t, r + offset, t, this), // Top
        new UnitLine(r, t - offset, r, b + offset, this), // Right
        new UnitLine(r + offset, b, l - offset, b, this), // Bottom
        new UnitLine(l, b + offset, l, t - offset, this), // Left
      ];
    }

    this.memoizedCollisionBox = collisionLines.map((line) => {
      return line.clone().addX(this.x).addY(this.y);
    });

    return this.memoizedCollisionBox;
  }

  invalidateCollisionBox() {
    this.memoizedCollisionBox = null;
  }

  isFinishedDoingAction() {
    return this.moveTarget === null;
  }

  setMoveTarget(x, y) {
    this.memoizedCollisionBox = null;
    this.startMovementPos = {x: this.x, y: this.y};
    this.moveTarget = {'x': x, 'y': y};
  }

  canSelect() {
    return false;
  }

  setSelected(selected) {
    if (this.selectedSprite) {
      this.selectedSprite.visible = selected;
    }
  }

  serialize() {
    var serialized_status_effects = [];
    for (var key in this.statusEffects) {
      serialized_status_effects.push(this.statusEffects[key].serialize());
    }
    var serialized = {
      'x': this.x,
      'y': this.y,
      'health': this.health,
      'armour': this.armour,
      'shield': this.shield,
      'status_effects': serialized_status_effects,
      'moveTarget': null,
      'unitType': this.constructor.name,
      'owner': this.owner,
      'id': this.id,
      'data': this.serializeData()
    };
    if (this.moveTarget) {
      serialized.moveTarget = {
        'x': this.moveTarget.x,
        'y': this.moveTarget.y,
      };
    }

    return serialized;
  }

  serializeData() {
    return {};
  }

  loadSerializedData(data) {

  }

  createSprite() {
    var sprite = new PIXI.Sprite(
      PIXI.loader.resources['byte'].texture
    );
    sprite.anchor.set(0.5);

    sprite.width = Unit.UNIT_SIZE;
    sprite.height = Unit.UNIT_SIZE;

    return sprite;
  }

  getCurrentPosition() {
    var x = this.moveTarget ? this.moveTarget.x : this.x;
    var y = this.moveTarget ? this.moveTarget.y : this.y;
    return {x: x, y: y};
  }

  getTopLeft() {
    var x = this.moveTarget ? this.moveTarget.x : this.x;
    var y = this.moveTarget ? this.moveTarget.y : this.y;
    return {x: x - this.physicsWidth / 2, y: y - this.physicsWidth / 2};
  }

  getBottomRight() {
    var x = this.moveTarget ? this.moveTarget.x : this.x;
    var y = this.moveTarget ? this.moveTarget.y : this.y;
    return {x: x + this.physicsWidth / 2, y: y + this.physicsWidth / 2};
  }

  getTopLeftCoord() {
    return {x: 0, y: 0};
  }

  getBottomRightCoord() {
    return {x: 0, y: 0};
  }

  addToStage(stage) {
    this.gameSprite = this.createSprite();
    this.spriteScale = {x: this.gameSprite.scale.x, y: this.gameSprite.scale.y};
    for (var effect in this.statusEffects) {
      this.addEffectSprite(effect);
    }

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;

    if (this.addToBackOfStage()) {
      stage.addChildAt(this.gameSprite, 0);
    } else {
      stage.addChild(this.gameSprite);
    }

    if (DEBUG_MODE && this.addPhysicsLines) {
      this.addPhysicsLines(this.gameSprite);
    }
  }

  addToBackOfStage() {
    return false;
  }

  removeFromStage() {
    if (this.gameSprite && this.gameSprite.parent) {
      var stage = this.gameSprite.parent;
      stage.removeChild(this.gameSprite);
      return stage;
    }
    return null;
  }

  doMovement(boardState) {
  }

  startOfPhase(boardState, phase) {
    for (var key in this.statusEffects) {
      if (phase === TurnPhasesEnum.ENEMY_ACTION) {
        this.statusEffects[key].turnStart(boardState, this);
      }
      this.statusEffects[key].startOfPhase(boardState, phase, this);
      if (this.statusEffects[key].readyToDelete()) {
        this.removeStatusEffect(key);
      }
    }
  }

  addStatusEffect(effect) {
    if (
      effect instanceof FreezeStatusEffect &&
      this.getTraitValue(Unit.UNIT_TRAITS.FROST_IMMUNE) === true
    ) {
      return;
    }
    this.removeEffectSprite(effect.getEffectType());
    this.statusEffects[effect.getEffectType()] = effect;
    this.memoizedCollisionBox = null;
    this.addEffectSprite(effect.getEffectType());
  }

  removeEffectSprite(effect) {
    if (effect in this.effectSprites) {
      var sprite = this.effectSprites[effect];
      sprite.parent.removeChild(sprite);
      delete this.effectSprites[effect];
      this.memoizedCollisionBox = null;
    }
    if (this.gameSprite && effect == ShieldStatusEffect.getEffectType()) {
      this.gameSprite.filters = [];
    }
  }

  addEffectSprite(effect) {
  }

  removeStatusEffect(effect) {
    if (effect in this.statusEffects) {
      delete this.statusEffects[effect];
      this.removeEffectSprite(effect);
    }
  }

  endOfPhase(boardState, phase) {
    if (phase === TurnPhasesEnum.ENEMY_SPAWN) {
      for (var key in this.statusEffects) {
        this.statusEffects[key].turnEnd(boardState, this);
        if (this.statusEffects[key].readyToDelete()) {
          this.removeStatusEffect(key);
        }
      }
    }
  }

  triggerHit(boardState, unit, intersection, projectile) {}

  runTick(boardState) {
    if (this.moveTarget && this.spawnEffectStart) {
      this.spawnEffectTime.current += 1;
      var pct = this.spawnEffectTime.current / this.spawnEffectTime.max;
      if (pct > 1) {
        pct = 1;
      }
      let oldX = this.x;
      let oldY = this.y;
      this.playSpawnEffectAtPct(boardState, pct);
      if (oldX != this.x || oldY != this.y) {
        this.invalidateCollisionBox();
      }

      if (pct == 1) {
        this.moveTarget = null;
        this.spawnEffectStart = null;
        this.spawnEffectTime = null;
      }
    }

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }

  getSize() {
    return {
      left: 0, right: 0, top: 0, bottom: 0
    };
  }

  getSelectionRadius() { return 20; }

  preventsUnitEntry(unit) {
    return true;
  }

  onDelete(boardState) {
    for (var key in this.statusEffects) {
      this.statusEffects[key].onUnitDeleting(boardState, this);
    }
  }

  otherUnitEntering(boardState, unit) {
    return true;
  }

  isBoss() {
    return false;
  }

  getShatterSprite() {
    return this.createSprite();
  }

  playSpawnEffect(boardState, castPoint, time) {
    this.spawnEffectStart = {x: castPoint.x, y: castPoint.y};
    this.spawnEffectTime = {current: 0, max: time};
    this.moveTarget = {x: this.x, y: this.y};
    this.playSpawnEffectAtPct(boardState, 0);

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }

  playSpawnEffectAtPct(boardState, pct) {
    if (!this.spawnEffectStart) { return; }
    if (!this.creatorAbility || this.creatorAbility.ZONE_TYPE !== ZoneAbilityDef.ZoneTypes.BLOCKER_BARRIER) {
      this.gameSprite.scale.x = lerp(0, this.spriteScale.x, pct);
    }
    this.gameSprite.scale.y = lerp(0, this.spriteScale.y, pct);
    this.x = lerp(this.spawnEffectStart.x, this.moveTarget.x, pct);
    this.y = lerp(this.spawnEffectStart.y, this.moveTarget.y, pct);
    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }
}

Unit.loadFromServerData = function(serverData) {
  var x = 0;
  var y = 0;
  var owner = 0;
  var UnitClass = Unit;
  var id = null;
  if (serverData.x) { x = serverData.x; }
  if (serverData.y) { y = serverData.y; }
  if (serverData.owner) { owner = serverData.owner; }
  if (serverData.unitType) {
    if (!(serverData.unitType in Unit.UnitTypeMap)) {
      alert(serverData.unitType + " not in Unit.UnitTypeMap.");
    } else {
      UnitClass = Unit.UnitTypeMap[serverData.unitType];
    }
  }
  if (serverData.id) { id = serverData.id; }
  var unit = new UnitClass(x, y, owner, id);
  if (serverData.health !== undefined) { unit.health = serverData.health; }
  if (serverData.armour !== undefined) { unit.armour = serverData.armour; }
  if (serverData.shield !== undefined) { unit.shield = serverData.shield; }
  if (serverData.moveTarget) {
    unit.setMoveTarget(serverData.moveTarget.x, serverData.moveTarget.y);
  }
  if (serverData.status_effects) {
    for (var i = 0; i < serverData.status_effects.length; i++) {
      var status_effect = serverData.status_effects[i];
      unit.addStatusEffect(StatusEffect.fromServerData(status_effect));
    }
  }
  if (serverData.data) {
    unit.loadSerializedData(serverData.data);
  }
  return unit;
}

Unit.UNIT_SIZE = 40;
Unit.UnitTypeMap = {
};
Unit.AddToTypeMap = function() {
  Unit.UnitTypeMap[this.name] = this;
}

Unit.UNIT_TRAITS = {
  FROST_IMMUNE: 'frost_immune',
  RESILIANT: 'resiliant',
}
