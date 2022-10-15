class UnitFireShard extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.FIRE_SHARD_SPRITES = 4;
    this.timeLeft = this.FIRE_SHARD_SPRITES;

    this.addAbility(
      20,
      new EnemyAbilityExplode(
        this,
        NumbersBalancer.getUnitAbilityNumber(
          this,
          NumbersBalancer.UNIT_ABILITIES.FIRE_SHARD_TOTAL_DAMAGE
        )
      )
    );
  }

  createCollisionBox() {
    let pct = 0.8;
    this.collisionBox = [
      new UnitLine(
        0,
        (-this.physicsHeight / 2) * pct,
        (this.physicsWidth / 2) * pct,
        0,
        this
      ), // Top Right
      new UnitLine(
        (this.physicsWidth / 2) * pct,
        0,
        0,
        (this.physicsHeight / 2) * pct,
        this
      ), // Bottom Right
      new UnitLine(
        0,
        (this.physicsHeight / 2) * pct,
        (-this.physicsWidth / 2) * pct,
        0,
        this
      ), // Bottom Left
      new UnitLine(
        (-this.physicsWidth / 2) * pct,
        0,
        0,
        (-this.physicsHeight / 2) * pct,
        this
      ), // Top Left
    ];
  }

  serializeData() {
    return {
      ...super.serializeData(),
      timeLeft: this.timeLeft,
    };
  }

  loadSerializedData(data) {
    this.timeLeft = data.timeLeft;
    super.loadSerializedData(data);
  }

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (!this.canUseAbilities()) {
      return;
    }
    if (phase == TurnPhasesEnum.ENEMY_ACTION) {
      this.timeLeft -= 1;
      this.chooseSpriteVisibility();
      if (this.timeLeft <= 0) {
        this.readyToDel = true;
        this.explode(boardState);
      }
    }
  }

  chooseSpriteVisibility() {
    if (this.timeLeft - 1 < this.FIRE_SHARD_SPRITES && this.timeLeft - 1 >= 0) {
      let spriteNum = this.FIRE_SHARD_SPRITES - 1 - (this.timeLeft - 1);
      this.setSpriteVisible("fire_shard_" + spriteNum);
    }
  }

  doAbilityForecasting(boardState) {
    if (this.timeLeft === 1) {
      super.doAbilityForecasting(boardState);
    }
  }

  explode(boardState) {
    this.useForecastAbilities(boardState);
  }

  doMovement(boardState) {}

  createSprite(hideHealthBar) {
    return this.createSpriteListFromResourceList(
      ["fire_shard_0", "fire_shard_1", "fire_shard_2", "fire_shard_3"],
      hideHealthBar
    );
  }
}

UnitFireShard.AddToTypeMap();
