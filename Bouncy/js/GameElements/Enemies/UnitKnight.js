class UnitKnight extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.addAbility(20, new EnemyAbilityShieldWall(this));
  }

  createCollisionBox() {
    var t = -this.physicsHeight / 2;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;

    var s = Unit.UNIT_SIZE / 2;

    var offset = 0;
    this.collisionBox = [
      new UnitLine(-s, -s / 2, -s / 2, -s, this), // TL
      new UnitLine(-s / 2, -s, s / 2, -s, this), // Top
      new UnitLine(s / 2, -s, s, -s / 2, this), // TR

      new UnitLine(s, -s / 2, r, b + offset, this), // Right
      new UnitLine(r + offset, b, l - offset, b, this), // Bottom
      new UnitLine(l, b + offset, -s, -s / 2, this), // Left
    ];
  }

  createSprite(hideHealthBar) {
    return this.createSpriteFromResource('enemy_knight', hideHealthBar);
  }

  unitHitCallback(boardState, unit, intersection, projectile) {
    var hitEffect = new DamageHitEffect({
      'base_damage': this.health.max / 8
    }, null);
    hitEffect.doHitEffect(boardState, unit, intersection, projectile);
  }

  doSpawnEffect(boardState) {
    this.useAbility(boardState);
  }

  useAbility(boardState) {
    this.useRandomAbility(boardState);
  }

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (!this.canUseAbilities()) { return; }
    if (phase == TurnPhasesEnum.END_OF_TURN) {
      this.useAbility(boardState);
    }
  }
}

UnitKnight.AddToTypeMap();
