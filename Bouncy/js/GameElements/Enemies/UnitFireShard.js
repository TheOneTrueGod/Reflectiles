class UnitFireShard extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.FIRE_SHARD_SPRITES = 4;
    this.timeLeft = this.FIRE_SHARD_SPRITES;
  }

  createCollisionBox() {
    var t = -this.physicsHeight / 2;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;

    var offset = 0;
    this.collisionBox = [
      new UnitLine(l, 0, 0, t, this), // Top Left
      new UnitLine(0, t, r, 0, this), // Top Right
      new UnitLine(r, 0, r, b + offset, this), // Right
      new UnitLine(r + offset, b, l - offset, b, this), // Bottom
      new UnitLine(l, b + offset, l, 0, this), // Left
    ];
  }

  serializeData() {
    return {timeLeft: this.timeLeft};
  }

  loadSerializedData(data) {
    this.timeLeft = data.timeLeft;
  }

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (!this.canUseAbilities()) { return; }
    if (phase == TurnPhasesEnum.ENEMY_ACTION) {
      this.timeLeft -= 1;
      if (this.timeLeft <= 0) {
        this.readyToDel = true;
        this.explode(boardState);
      }

      if (this.timeLeft - 1 < this.FIRE_SHARD_SPRITES && this.timeLeft - 1 >= 0) {
        let spriteNum = (this.FIRE_SHARD_SPRITES - 1) - (this.timeLeft - 1);
        this.setSpriteVisible('fire_shard_' + spriteNum);
      }
    }
  }

  explode(boardState) {
    var num_projectiles = NumbersBalancer.getUnitAbilityNumber(this,
      NumbersBalancer.UNIT_ABILITIES.FIRE_SHARD_NUM_SHOTS
    );
    for (var i = -Math.floor(num_projectiles / 2); i <= Math.floor(num_projectiles / 2); i++) {
      let angle = Math.PI / 2.0 + i / Math.floor(num_projectiles / 2) * Math.PI / 4.0;
      boardState.addProjectile(
        new EnemyProjectile(
          {x: this.x, y: this.y},
          {x: this.x + Math.cos(angle) * 10, y: this.y + Math.sin(angle) * 10},
          angle,
          {
            //'friendly_fire': true,
            'damage_to_players': Math.floor(NumbersBalancer.getUnitAbilityNumber(this,
              NumbersBalancer.UNIT_ABILITIES.FIRE_SHARD_TOTAL_DAMAGE
            ) / num_projectiles),
          }
        )
      );
    }
  }

  doMovement(boardState) {}

  createSprite(hideHealthBar) {
    return this.createSpriteListFromResourceList([
      'fire_shard_0',
      'fire_shard_1',
      'fire_shard_2',
      'fire_shard_3',
    ], hideHealthBar);
  }
}

UnitFireShard.AddToTypeMap();
