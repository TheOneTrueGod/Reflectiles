class UnitShooter extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.addAbility(
      20,
      new EnemyAbilityShootProjectile(
        this,
        NumbersBalancer.getUnitAbilityNumber(
          this,
          NumbersBalancer.UNIT_ABILITIES.SHOOTER_DAMAGE
        ),
        EnemyProjectileStyles.SmallShot
      )
    );
  }

  createCollisionBox() {
    var t = 0;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;

    var offset = 0;
    // Octagonal

    this.collisionBox = [
      new UnitLine(0, -this.physicsHeight / 2, this.physicsWidth / 2, 0, this), // Top Right
      new UnitLine(r, t - offset, r, b + offset, this), // Right
      new UnitLine(r + offset, b, l - offset, b, this), // Bottom
      new UnitLine(l, b + offset, l, t - offset, this), // Left
      new UnitLine(-this.physicsWidth / 2, 0, 0, -this.physicsHeight / 2, this), // Top Left
    ];
  }

  startOfEnemyActionPhase(boardState) {
    if (!this.canUseAbilities()) {
      return;
    }
    this.useForecastAbilities(boardState);
  }

  createSprite(hideHealthBar) {
    return this.createSpriteFromResource("enemy_shoot", hideHealthBar);
  }
}

UnitShooter.AddToTypeMap();
