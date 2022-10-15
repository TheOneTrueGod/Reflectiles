class UnitBasicDiamond extends UnitBasicAttacker {
  constructor(x, y, owner, id) {
    super(x, y, owner, id, 'enemy_diamond', 'enemy_diamond_attacking');
  }

  createCollisionBox() {
    this.collisionBox = [
      new UnitLine(0, -this.physicsHeight / 2, this.physicsWidth / 2, 0, this), // Top Right
      new UnitLine(this.physicsWidth / 2, 0, 0, this.physicsHeight / 2, this), // Bottom Right
      new UnitLine(0, this.physicsHeight / 2, -this.physicsWidth / 2, 0, this), // Bottom Left
      new UnitLine(-this.physicsWidth / 2, 0, 0, -this.physicsHeight / 2, this), // Top Left
    ];
  }
}

UnitBasicDiamond.AddToTypeMap();
