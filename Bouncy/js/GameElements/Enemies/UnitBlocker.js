class UnitBlocker extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.sprites = {
      idleSprite: null,
      activeSprite: null,
    }
    
    this.linkedWith = null;
    this.facing = 1;
    this.createCollisionBox();
  }

  createCollisionBox() {
    var t = -this.physicsHeight / 2;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;
    
    this.collisionBox = [];
    
    if (!this.linkedWith) {
      l *= 3 / 4;
      r *= 3 / 4;
      this.collisionBox.push(new UnitLine(l, t, r, t, this)); // Top
      this.collisionBox.push(new UnitLine(r, t, r, b, this)); // Right
      this.collisionBox.push(new UnitLine(r, b, l, b, this)); // Bottom
      this.collisionBox.push(new UnitLine(l, b, l, t, this)); // Left
    } else if (this.facing == 1) { // Facing Right
      let mr = r / 4;
      this.collisionBox.push(new UnitLine(l, t, mr, t, this)); // Top
      this.collisionBox.push(new UnitCriticalLine(mr, t, r, t, this, 0)); // Top-right
      this.collisionBox.push(new UnitCriticalLine(r, t, r, b, this, 0)); // Right
      this.collisionBox.push(new UnitCriticalLine(r, b, mr, b, this, 0)); // Bottom-right
      this.collisionBox.push(new UnitLine(mr, b, l, b, this)); // Bottom
      this.collisionBox.push(new UnitLine(l, b, l, t, this)); // Left
    } else { // Facing Left
      let ml = l / 4;
      this.collisionBox.push(new UnitCriticalLine(l, t, ml, t, this, 0)); // Top-left
      this.collisionBox.push(new UnitLine(ml, t, r, t, this)); // Top
      this.collisionBox.push(new UnitLine(r, t, r, b, this)); // Right
      this.collisionBox.push(new UnitLine(r, b, ml, b, this)); // Bottom
      this.collisionBox.push(new UnitCriticalLine(ml, b, l, b, this, 0)); // Bottom-left
      this.collisionBox.push(new UnitCriticalLine(l, b, l, t, this, 0)); // Left
    }
  }

  createSprite() {
    let container = new PIXI.Container();
    this.sprites.idleSprite = new PIXI.Sprite(
      PIXI.loader.resources['enemy_blocker'].texture
    );
    
    this.sprites.activeSprite = new PIXI.Sprite(
      PIXI.loader.resources['enemy_blocker_active'].texture
    );
    container.addChild(this.sprites.activeSprite);
    container.addChild(this.sprites.idleSprite);

    //this.addPhysicsLines(container);
    this.createHealthBarSprite(container);

    this.sprites.activeSprite.anchor.set(0.5);
    this.sprites.idleSprite.anchor.set(0.5);
    if (this.linkedWith) {
      this.sprites.idleSprite.visible = false;
      this.updateSpriteFacing();
    } else {
      this.sprites.activeSprite.visible = false;
    }

    container.width = Unit.UNIT_SIZE;
    container.height = Unit.UNIT_SIZE;
    return container;
  }

  unitHitCallback(boardState, unit, intersection, projectile) {
    var hitEffect = new DamageHitEffect({
      'base_damage': this.health.max / 8
    }, null);
    hitEffect.doHitEffect(boardState, unit, intersection, projectile);
  }
  
  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (!this.canUseAbilities()) { return; }
    if (phase == TurnPhasesEnum.ENEMY_MOVE) {
      this.breakLink(boardState);
    }
    if (phase == TurnPhasesEnum.END_OF_TURN) {
      this.formLinks(boardState);
      if (this.linkedWith) {
        let linkedWith = boardState.findUnit(this.linkedWith);
        let thisCoord = boardState.sectors.getGridCoord(this);
        let linkCoord = boardState.sectors.getGridCoord(linkedWith);
        for (var x = thisCoord.x + 1; x < linkCoord.x; x++) {
          let targetPoint = {x: x, y: thisCoord.y};
          /*let unitsAtPosition = boardState.sectors.getUnitsAtGridSquare(targetPoint.x, targetPoint.y);
          let blockSpawn = false;
          for (let intersectUnitId of unitsAtPosition) {
            if (boardState.findUnit(intersectUnitId).preventsUnitEntry(null)) {
              blockSpawn = true;
            }
          }
          if (blockSpawn) {
            continue;
          }*/
          
          let playerUnits = boardState.getPlayerUnitsAtPosition(targetPoint);
          for (var j = 0; j < playerUnits.length; j++) {
            playerUnits[j].knockback();
          }
          UnitBlocker.abilityDef.doActionOnTick(
            'enemy', 
            0, 
            boardState, 
            boardState.sectors.getPositionFromGrid(targetPoint),
            //{x: this.x, y: this.y}, 
            boardState.sectors.getPositionFromGrid(targetPoint)
          );
        }
      }
    }
  }
  
  formLinks(boardState) {
    if (this.linkedWith) {
      return;
    }
    let allBlockers = boardState.getAllUnitsByCondition((unit) => { 
      return unit instanceof UnitBlocker && unit.canUseAbilities && unit !== this && unit.linkedWith == null; 
    });
    let closestBlocker = null;
    for (var blocker of allBlockers) {
      if (blocker.y == this.y && (
        !closestBlocker || 
        Math.abs(closestBlocker.x - this.x) > Math.abs(blocker.x - this.x)
      )) {
        closestBlocker = blocker;
      }
    }
    
    if (closestBlocker) {
      this.linkWith(closestBlocker);
      closestBlocker.linkWith(this);
    } else {
      this.breakLink(boardState);
    }
  }
  
  updateSpriteFacing() {
    if (this.facing == 1) {
      this.sprites.activeSprite.scale.x = Math.abs(this.sprites.activeSprite.scale.x);
    } else {
      this.sprites.activeSprite.scale.x = -Math.abs(this.sprites.activeSprite.scale.x);
    }
  }
  
  linkWith(blocker) {
    this.setSpriteVisible(this.sprites.activeSprite);
    this.linkedWith = blocker.id;
    this.facing = blocker.x > this.x ? 1 : -1;
    this.updateSpriteFacing();
    this.createCollisionBox();
  }
  
  breakLink(boardState) {
    this.setSpriteVisible(this.sprites.idleSprite);
    if (this.linkedWith) {
      let linked = boardState.findUnit(this.linkedWith);
      if (linked) { linked.linkedWith = null; }
      this.linkedWith = null;
      this.createCollisionBox();
    }
  }
  
  setSpriteVisible(sprite) {
    for (var key in this.sprites) {
      this.sprites[key].visible = false;
    }
    sprite.visible = true;
  }
  
  serializeData() {
    let serialized = super.serializeData();
    serialized.linked_with = this.linkedWith;
    serialized.facing = this.facing;
    
    return serialized;
  }

  loadSerializedData(data) {
    super.loadSerializedData(data);
    this.linkedWith = data.linked_with;
    this.facing = data.facing;
    this.createCollisionBox();
  }
  
  getShatterSprite() {
    return this.sprites.idleSprite.visible ? 
      this.sprites.idleSprite : 
      this.sprites.activeSprite;
  }
}

UnitBlocker.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}

UnitBlocker.createAbilityDef = function() {
  UnitBlocker.abilityDef = AbilityDef.createFromJSON({
    'ability_type': AbilityDef.AbilityTypes.ZONE,
    'duration': 1,
    "zone_type": ZoneAbilityDef.ZoneTypes.BLOCKER_BARRIER,
    "zone_size":{"left":0,"right":0,"top":0,"bottom":0},
    "zone_health": {
      'health': 0,
      'shield': 0,
      'armour': 0,
    },
    "sprite": "zone_blocker_barrier",
    "deletion_phase": TurnPhasesEnum.ENEMY_ACTION,
    "unit_interaction": {
      'prevent_unit_entry': true,
    },
    "projectile_interaction": {
      'hits_player_projectiles': true
    }
  });
};

UnitBlocker.AddToTypeMap();
