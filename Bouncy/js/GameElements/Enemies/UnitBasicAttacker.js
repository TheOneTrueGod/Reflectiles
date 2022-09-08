class UnitBasicAttacker extends UnitBasic {
  constructor(x, y, owner, id, basicSprite, attackingSprite) {
    super(x, y, owner, id);
    this.basicSprite = basicSprite;
    this.attackingSprite = attackingSprite;
    this.addAbility(20, new EnemyAbilityBasicEnemyAttack(
      this,
      NumbersBalancer.getUnitAbilityNumber(this, NumbersBalancer.UNIT_ABILITIES.BASIC_ENEMY_DAMAGE)
    ));
  }

  canBasicAttack() {
    return true;
  }

  forecastBasicAttackAbility(boardState) {
    this.forecastAbility(boardState, 0);
    this.setSpriteVisible(this.attackingSprite);
  }

  useForecastAbilities(boardState, index = -1) {
    super.useForecastAbilities(boardState, index);
    this.setSpriteVisible(this.basicSprite);
  }

  getNumAbilitiesToUse() {
    return 0;
  }

  startOfEnemyActionPhase(boardState) {
    if (!this.canUseAbilities()) { return; }
    this.useForecastAbilities(boardState);
  }

  createSprite(hideHealthBar) {
    const spriteList = this.createSpriteListFromResourceList([this.basicSprite, this.attackingSprite], hideHealthBar);
    if (this.abilityForecasts.length > 0) {
      this.setSpriteVisible(this.attackingSprite);
    }
    return spriteList;
  }
}
