class UnitBossSlime extends UnitBasic {
  getUnitSize() {
    return {x: Unit.UNIT_SIZE * 3, y: Unit.UNIT_SIZE * 3};
  }

  getSize() {
    return {
      left: 1, right: 1, top: 1, bottom: 1
    };
  }

  dealDamage(boardState, amount) {
    let spawnThreshold = NumbersBalancer.getUnitAbilityNumber(
      NumbersBalancer.UNIT_ABILITIES.BOSS_SLIME_SPLIT_THRESHOLD
    );
    let startHealth = this.health.current;
    super.dealDamage(boardState, amount);
    let endHealth = this.health.current;
    let unitsToSpawn = Math.floor(startHealth / spawnThreshold) - Math.floor(endHealth / spawnThreshold);
    for (var i = 0; i < unitsToSpawn; i++) {
      let newUnit = new UnitSlime(0, 0);
      let spawnPoint = this.findSpawnPointForUnit(boardState, newUnit);
      if (spawnPoint) {
        newUnit.x = spawnPoint.x;
        newUnit.y = spawnPoint.y;
        boardState.addUnit(newUnit);
        newUnit.playSpawnEffect(boardState, {x: this.x, y: this.y}, 20);
      }
    }
  }

  findSpawnPointForUnit(boardState, newUnit) {
    let spawnPos;
    for (let dist = 2; dist < 15; dist++) {
      for (let delta = 0; delta < dist; delta > 0 ? delta *= -1 : delta ++) {
        // down
        spawnPos = this.canSpawnAt(boardState, newUnit, delta, dist);
        if (spawnPos !== false) { return spawnPos; }
        // right
        spawnPos = this.canSpawnAt(boardState, newUnit, dist, delta);
        if (spawnPos !== false) { return spawnPos; }
        // left
        spawnPos = this.canSpawnAt(boardState, newUnit, -dist, delta);
        if (spawnPos !== false) { return spawnPos; }
        // top
        spawnPos = this.canSpawnAt(boardState, newUnit, delta, -dist);
        if (spawnPos !== false) { return spawnPos; }
      }
    }
    return null;
  }

  canSpawnAt(boardState, newUnit, dx, dy) {
    let target = {x: this.x + dx * Unit.UNIT_SIZE, y: this.y + dy * Unit.UNIT_SIZE};
    if (boardState.sectors.canUnitEnter(
      boardState,
      newUnit,
      target,
    )) {
      return target;
    }
    return false;
  }

  createCollisionBox() {
    var t = -this.physicsHeight / 2 + this.physicsHeight * 13 / 100;
    var b = this.physicsHeight / 2 - this.physicsHeight * 13 / 100;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;

    this.collisionBox = [
      new UnitLine(r * 0.5, b, l * 0.5, b, this), // Bottom
      new UnitLine(l * 0.5, b, l, b * 0.8, this), // Bottom-left
      new UnitLine(l, b * 0.8, l, t * 0.25, this), // Left
      new UnitLine(l, t * 0.25, l * 0.7, t * 0.75, this), // left-Top-left
      new UnitLine(l * 0.7, t * 0.75, 0, t, this), // Top-left
      new UnitLine(0, t, r * 0.7, t * 0.75, this), // Top-right
      new UnitLine(r * 0.7, t * 0.75, r, t * 0.25, this), // right-Top-right
      new UnitLine(r, t * 0.25, r, b * 0.8, this), // Right
      new UnitLine(r, b * 0.8, r * 0.5, b, this), // Bottom-right
    ];

    //new UnitLine(l, t * 0.25, 0, t, this), // Top-left
    //new UnitLine(0, t, r, t * 0.25, this), // Top-right
  }

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['enemy_boss_slime'].texture
    );

    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);

    sprite.width = this.physicsWidth;
    sprite.height = this.physicsHeight;

    this.addPhysicsLines(sprite);
    return sprite;
  }

  doMovement(boardState) {
    if (this.hasStatusEffect(FreezeStatusEffect)) {
      return;
    }
    this.movementCredits += this.movementSpeed;
    if (this.movementCredits < 1) {
      this.doHorizontalMovement(boardState);
    } else {
      this.moveForward(boardState);
    }
  }

  getTopLeftOffset() {
    return {x: -1, y: -1};
  }

  getBottomRightOffset() {
    return {x: 1, y: 1};
  }

  isBoss() {
    return true;
  }
}

UnitBossSlime.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}

UnitBossSlime.AddToTypeMap();
