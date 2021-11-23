class UnitBomber extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.timeLeft = NumbersBalancer.getUnitAbilityNumber(this, NumbersBalancer.UNIT_ABILITIES.BOMBER_DURATION);
    this.countdownSprite = null;

    this.addAbility(20, new EnemyAbilityExplode(
      this,
      NumbersBalancer.getUnitAbilityNumber(this, NumbersBalancer.UNIT_ABILITIES.BOMBER_EXPLOSION_DAMAGE)
    ));
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
    return { 
      ...super.serializeData(),
      timeLeft: this.timeLeft
    };
  }

  loadSerializedData(data) {
    this.timeLeft = data.timeLeft;
    super.loadSerializedData(data);
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
      this.createHealthBarSprite(this.gameSprite);
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

  createSprite(hideHealthBar) {
    return this.createSpriteFromResource('enemy_bomber', hideHealthBar);
  }

  createHealthBarSprite(sprite) {
    super.createHealthBarSprite(sprite);

    if (this.countdownSprite) {
      this.gameSprite.removeChild(this.countdownSprite);
      this.countdownSprite = null;
    }

    var text = this.timeLeft - 1;
    let textColour = 'white';

    if (text < 1) {
      textColour = 'red';
    } else if (text == 1) {
      textColour = 'orange';
    }

    var timeLeftGraphic = new PIXI.Text(
      text,
      {
        fontWeight: 'bold',
        fontSize: '14px',
        fontFamily: 'sans-serif',
        fill : textColour,
        align : 'center',

        stroke: 0x000000,
        strokeThickness: 4
      }
    );

    timeLeftGraphic.anchor.set(0.5);
    timeLeftGraphic.position.set(1, -14);
    sprite.addChild(timeLeftGraphic);
    this.countdownSprite = timeLeftGraphic;
  }

  unitHitCallback(boardState, unit, intersection, projectile) {
    var hitEffect = new DamageHitEffect({
      'base_damage': this.health.max / 8
    }, null);
    hitEffect.doHitEffect(boardState, unit, intersection, projectile);
  }
}

UnitBomber.AddToTypeMap();
