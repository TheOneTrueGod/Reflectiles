class UnitBomber extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.timeLeft = NumbersBalancer.getUnitAbilityNumber(NumbersBalancer.UNIT_ABILITIES.BOMBER_DURATION);
    this.countdownSprite = null;
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
      this.createHealthBarSprite(this.gameSprite);
    }
  }

  explode(boardState) {
    var num_projectiles = 5;
    for (var i = -Math.floor(num_projectiles / 2); i <= Math.floor(num_projectiles / 2); i++) {
      let angle = Math.PI / 2.0 + i / Math.floor(num_projectiles / 2) * Math.PI / 4.0;
      boardState.addProjectile(
        new EnemyProjectile(
          {x: this.x, y: this.y},
          {x: this.x + Math.cos(angle) * 10, y: this.y + Math.sin(angle) * 10},
          angle,
          {
            //'friendly_fire': true,
            'damage_to_players': NumbersBalancer.getUnitAbilityNumber(
              NumbersBalancer.UNIT_ABILITIES.BOMBER_EXPLOSION_DAMAGE
            ) / num_projectiles,
          }
        ).addUnitHitCallback(this.unitHitCallback.bind(this))
      );
    }
  }

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['enemy_bomber'].texture
    );

    //this.addPhysicsLines(sprite);
    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);
    
    sprite.width = Unit.UNIT_SIZE;
    sprite.height = Unit.UNIT_SIZE;
    return sprite;
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

UnitBomber.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}

UnitBomber.AddToTypeMap();
