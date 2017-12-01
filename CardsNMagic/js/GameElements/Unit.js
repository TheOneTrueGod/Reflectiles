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
  }

  setMoveTarget(x, y) {
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
    var serialized = {
      'x': this.x,
      'y': this.y,
      'moveTarget': null,
      'unitType': this.constructor.name,
      'owner': this.owner,
      'id': this.id,
    };
    if (this.moveTarget) {
      serialized.moveTarget = {
        'x': this.moveTarget.x,
        'y': this.moveTarget.y,
      };
    }

    return serialized;
  }

  createSprite() {
    var sprite = new PIXI.Sprite(
      PIXI.loader.resources['byte'].texture
    );
    sprite.anchor.set(0.5);
    return sprite;
  }

  addToStage(stage) {
    this.gameSprite = this.createSprite();

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;

    stage.addChild(this.gameSprite);
  }

  runTick() {
    this.y += 1;

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }

  getSelectionRadius() { return 20; }
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
  if (serverData.moveTarget) {
    unit.setMoveTarget(serverData.moveTarget.x, serverData.moveTarget.y);
  }
  return unit;
}

Unit.UnitTypeMap = {
};
Unit.AddToTypeMap = function() {
  Unit.UnitTypeMap[this.name] = this;
}
