class UnitDefensive extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.damageTakenOnTurn = 0;
    this.damageThreshold = NumbersBalancer.getUnitAbilityNumber(
      this,
      NumbersBalancer.UNIT_ABILITIES.DEFENSIVE_MAX_DAMAGE
    );
  }

  createCollisionBox() {
    var s = Unit.UNIT_SIZE / 2;
    // Octagonal
    this.collisionBox = [
      new UnitLine(-s, s / 2, -s, -s / 2, this), // Left
      new UnitLine(-s, -s / 2, -s / 2, -s, this), // TL

      new UnitLine(-s / 2, -s, s / 2, -s, this), // Top
      new UnitLine(s / 2, -s, s, -s / 2, this), // TR

      new UnitLine(s, -s / 2, s, s / 2, this), // Right
      new UnitLine(s, s / 2, s / 2, s, this), // BR

      new UnitLine(s / 2, s, -s / 2, s, this), // Bottom
      new UnitLine(-s / 2, s, -s, s / 2, this) // BL
    ];
  }

  createSprite(hideHealthBar) {
    return this.createSpriteListFromResourceList(['enemy_damage_limit', 'enemy_damage_limit_2'], hideHealthBar);
  }

  getDamageThreshold() {
    return this.damageThreshold;
  }

  getTraitValue(trait) {
    if (trait === Unit.UNIT_TRAITS.RESILIANT) {
      return Math.min(
        Math.max(
          this.getDamageThreshold() - this.damageTakenOnTurn, 0
        ),
        this.getDamageThreshold()
      );
    }
    return super.getTraitValue(trait);
  }

  dealDamage(boardState, amount, source, damageType) {
    if (!this.canUseAbilities()) {
      return super.dealDamage(boardState, amount, source, damageType);
    }
    if (this.damageTakenOnTurn >= this.getDamageThreshold()) {
      if (damageType == Unit.DAMAGE_TYPE.CORROSIVE) {
        return super.dealDamage(boardState, amount / 2, source, damageType) * 2;
      }
      return amount;
    }
    let startHP = this.getHealth().current + this.getShield().current + this.getArmour().current;
    let damageTaken = super.dealDamage(boardState, amount, source, damageType);
    let endHP = this.getHealth().current + this.getShield().current + this.getArmour().current;

    if (endHP < startHP) {
      this.damageTakenOnTurn += startHP - endHP;
      if (this.damageTakenOnTurn >= this.getDamageThreshold()) {
        this.sprites['enemy_damage_limit_2'].visible = true;
        this.sprites['enemy_damage_limit'].visible = false;
      }
    }
    return damageTaken;
  }

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (phase == TurnPhasesEnum.NEXT_TURN || phase == TurnPhasesEnum.START_TURN) {
      this.damageTakenOnTurn = 0;
      this.sprites['enemy_damage_limit_2'].visible = false;
      this.sprites['enemy_damage_limit'].visible = true;
    }
  }
}

UnitDefensive.AddToTypeMap();
