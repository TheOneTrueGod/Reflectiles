class AbilityDef {
  constructor(defJSON, subAbility) {
    this.rawDef = defJSON;
    this.isSubAbility = subAbility;

    let indexPrefix = "";
    if (subAbility) {
      this.index = "sub_" + AbilityDef.SUB_ABILITY_DEF_INDEX;
      AbilityDef.SUB_ABILITY_DEF_INDEX += 1;
    } else {
      this.index = AbilityDef.ABILITY_DEF_INDEX;
      AbilityDef.ABILITY_DEF_INDEX += 1;
    }
    AbilityDef.abilityDefList[this.index] = this;

    if (!defJSON.ability_type) {
      throw new Error("Ability Defs need an abilityType");
    }
    this.abilityType = defJSON['ability_type'];
    this.TIMING_OFFSET = idx(defJSON, 'timing_offset', 0);

    var chargeData = idx(defJSON, 'charge', {});
    this.chargeType = idx(defJSON['charge'], 'charge_type', AbilityDef.CHARGE_TYPES.TURNS);
    this.maxCharge = idx(defJSON['charge'], 'max_charge', 0);
    this.charge = idx(defJSON['charge'], 'initial_charge', 0);
    if (defJSON['style']) {
      this.abilityStyle = AbilityStyle.loadFromJSON(defJSON['style']);
    } else {
      this.abilityStyle = AbilityStyle.FALLBACK_STYLE;
    }
    if (this.charge == -1) {
      this.charge = this.maxCharge;
    }
    this.specialEffects = idx(defJSON, 'special_effects', {});
    this.rawJSON = defJSON;
  }

  createExplosionEffect(boardState, targetPos) {
    var style = this.getStyle();
    if (style) {
      style.createExplosion(boardState, targetPos, this);
    } else {
      var AOESprite = 'sprite_explosion';
      EffectFactory.createExplosionSpriteAtUnit(boardState, targetPos, AOESprite);
    }
  }

  getOptionalParam(param, defaultValue) {
    if (param in this.rawDef) {
      return this.rawDef[param];
    }
    return defaultValue;
  }

  getStyle() {
    return this.abilityStyle;
  }

  loadNestedAbilityDefs(nestedList) {
    for (let i = 0; i < nestedList.length; i++) {
      let newAbil = null;
      if (((
          nestedList[i].effect && (
            nestedList[i].effect == ZoneAbilityDef.UnitEffectTypes.ABILITY ||
            nestedList[i].effect == PositionBasedEffect.EFFECTS.USE_ABILITY ||
            nestedList[i].effect == ProjectileShape.HitEffects.INFECT
          )
        ) ||
        nestedList[i].abil_def) &&
        !nestedList[i].initializedDef
      ) {
        newAbil = AbilityDef.createFromJSON(nestedList[i].abil_def, true);
      }

      if (nestedList[i].ability_type) {
        newAbil = AbilityDef.createFromJSON(nestedList[i], true);
      }

      if (newAbil) {
        nestedList[i].initializedAbilDef = newAbil;
        newAbil.parentAbilIndex = this.index;
        if (newAbil.abilityStyle === AbilityStyle.FALLBACK_STYLE) {
          newAbil.abilityStyle = this.abilityStyle;
        }
      }
    }
  }

  endOfTurn() {
    if (this.chargeType == AbilityDef.CHARGE_TYPES.TURNS) {
      this.addCharge();
    }
  }

  reduceCooldown(amount) {
    if (this.chargeType == AbilityDef.CHARGE_TYPES.TURNS) {
      this.addCharge(amount);
    }
  }

  addCharge(amount) {
    if (!amount) { amount = 1; }
    this.charge = Math.min(this.maxCharge, this.charge + amount);
    this.chargeUpdated();
  }

  chargeUpdated() {
    if (this.canBeUsed()) {
      $('[ability-id=' + this.index + ']')
        .removeClass("disabled");
    } else {
      $('[ability-id=' + this.index + ']')
        .addClass("disabled")
        .find('.chargeNumber')
        .text(this.maxCharge - this.charge);
    }
  }

  canBeUsed() {
    return this.charge >= this.maxCharge;
  }

  getCooldownNumber() {
    return this.maxCharge - this.charge;
  }

  serializeData() {
    return {'charge': this.charge};
  }

  deserializeData(dataJSON) {
    this.charge = dataJSON.charge ? dataJSON.charge : 0;
    this.chargeUpdated();
  }

  hasFinishedDoingEffect(tickOn) {
    throw new Error("Ability Defs shouldn't be initialized");
  }

  getHTMLForCardNotUseableSection() {
    var chargeDisplay = $("<div>", {"class": "chargeDisplay"});
    switch(this.chargeType) {
      case AbilityDef.CHARGE_TYPES.TURNS:
        chargeDisplay.addClass("chargeTypeTurns");
      break;
    }

    var chargeNumber = $("<div>", {"class": "chargeNumber noselect"});
    chargeDisplay.append(chargeNumber);

    return chargeDisplay;
  }

  getName() {
    if (this.cardName === undefined) {
      this.cardName = this.getOptionalParam("name", null);
    }
    return this.cardName;
  }

  getDescription() {
    return this.replaceSmartTooltipText(
      this.getOptionalParam("description", null)
    );
  }

  createTooltip() {
    var name = this.getOptionalParam("name", null);
    var text = this.getDescription();
    var tooltip = $("<div>", {"class": "tooltip"});
    if (!name && !text) { return null; }
    if (name) {
      tooltip.append(
        $("<div class='cardTooltipName'>" + name + "</div>", {"class": "tooltipName"})
        .append(this.getHTMLForTopLeftOfCard())
        .append(this.getCooldownIcon())
      );
    }

    if (text) {
      tooltip.append(
        $("<div class='cardTooltipDescription'>" + text + "</div>", {"class": "tooltipText"})
      );
    }

    return tooltip;
  }

  replaceSmartTextParam(currParams, replaceArray) {
    if (!replaceArray || replaceArray.length == 0) {
      return null;
    }

    var paramName = replaceArray[0];
    var indexName = null;
    if (paramName[paramName.length - 1] == "]") {
      indexName = paramName[paramName.length - 2];
      paramName = paramName.substr(0, paramName.length - 3);
    }

    if (!currParams[paramName]) {
      return "ERROR";
    }

    var nextDef = currParams[paramName];
    if (indexName !== null && indexName in nextDef) { nextDef = nextDef[indexName]; }

    var toReturn = this.replaceSmartTextParam(nextDef, replaceArray.slice(1));
    if (toReturn) { return toReturn; }
    if (typeof nextDef == 'number' || typeof nextDef == 'string') {
      return nextDef;
    }

    return null;
  }

  replaceSmartTooltipText(text, addSpans = true) {
    if (!text) { return null; }
    var toReturn = "";
    var search = "\\[\\[.*?\\]\\]";
    var match = text.match(search);
    while (match) {
      var stringToReplace = text.slice(match.index + 2, match.index + match[0].length - 2);
      var replaceArray = stringToReplace.split(".");

      var replacement = this.replaceSmartTextParam(this.rawDef, replaceArray);

      if (addSpans) {
        replacement = "<span class='replacedText'>" + replacement + "</span>";
      }
      text = text.slice(0, match.index) + replacement +
        text.slice(match.index + match[0].length, text.length);


      match = text.match(search);
    }

    search = "\\<\\<.*?\\>\\>";
    match = text.match(search);
    while (match) {
      let replacement = text.slice(match.index + 2, match.index + match[0].length - 2);
      replacement = "<span class='replacedText'>" + replacement + "</span>";

      text = text.slice(0, match.index) + replacement +
        text.slice(match.index + match[0].length, text.length);
      match = text.match(search);
    }
    return text;
  }

  createTargettingGraphic(startPos, endPos, color) {
    return null;
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    var special_effects = this.getOptionalParam('special_effects', null);
    if (special_effects && tick == 0) {
      for (var i = 0; i < special_effects.length; i++) {
        switch (special_effects[i]) {
          case AbilityDef.SPECIAL_EFFECTS.TURRET_AIM:
            boardState.callOnAllUnits((unit) => {
              if (unit instanceof Turret && unit.owningPlayerID === playerID) {
                  unit.setAimTarget(targetPoint);
              }
            });
            break;
          case AbilityDef.SPECIAL_EFFECTS.TURRET_FIRE:
            boardState.callOnAllUnits((unit) => {
              if (unit instanceof Turret && unit.owningPlayerID === playerID) {
                unit.reduceCooldown();
                unit.doShootAction(boardState);
              }
            });
            break;
        }
      }
    }
  }

  getValidTarget(target) {
    return {x: target.x, y: target.y};
  }

  clone() {
    return AbilityDef.createFromJSON(this.rawJSON, this.isSubAbility);
  }

  getCooldownIcon() {
    let cooldownTime = 0;
    if (this.maxCharge) {
      cooldownTime = this.maxCharge;
    }

    if (cooldownTime) {
      let $cooldownIcon = $("<div>", {"class": "cooldownIcon"});
      let $cooldownText = $("<div>", {"class": "cooldownText noselect"});
      $cooldownText.text(cooldownTime);
      $cooldownIcon.append($cooldownText);
      return $cooldownIcon;
    }
  }

  onStatusEffectUnitDying(boardState, unit, effect) {
    if (this.parentAbilIndex) {
      var parentAbility = AbilityDef.abilityDefList[this.parentAbilIndex];
      parentAbility.onStatusEffectUnitDying(boardState, unit, effect);
    }
    if (this.specialEffects['status_effect_death_recharge']) {
      this.addCharge(this.specialEffects['status_effect_death_recharge'])
    }
  }

  getHTMLForTopLeftOfCard() {
    return null;
  }
}

AbilityDef.CHARGE_TYPES = {
  TURNS: 'TURNS'
};

AbilityDef.abilityDefList = {};
AbilityDef.ABILITY_DEF_INDEX = 0;
AbilityDef.SUB_ABILITY_DEF_INDEX = 0;

AbilityDef.AbilityTypes = {
  PROJECTILE: 'PROJECTILE',
  ZONE: 'ZONE',
  CREATE_UNIT: 'CREATE_UNIT',
  POSITION: 'POSITION',
  MULTIPART: 'MULTIPART',
  LASER: 'LASER',
  SPECIAL: 'SPECIAL'
};

AbilityDef.SPECIAL_EFFECTS = {
  TURRET_AIM: 'TURRET_AIM',
  TURRET_FIRE: 'TURRET_FIRE',
}

AbilityDef.findAbsoluteParent = function(abilityIndex) {
  let ability = AbilityDef.abilityDefList[abilityIndex];
  if (ability.parentAbilIndex) {
    return AbilityDef.findAbsoluteParent(ability.parentAbilIndex);
  }
  return abilityIndex;
}

AbilityDef.createFromJSON = function(defJSON, subAbility) {
  if (!defJSON['ability_type']) {
    throw new Error("defJSON needs an ability_type")
  }
  switch (defJSON['ability_type']) {
    case AbilityDef.AbilityTypes.PROJECTILE:
      return new ProjectileAbilityDef(defJSON, subAbility);
    case AbilityDef.AbilityTypes.ZONE:
      return new ZoneAbilityDef(defJSON, subAbility);
    case AbilityDef.AbilityTypes.CREATE_UNIT:
      return new SummonUnitAbilityDef(defJSON, subAbility);
    case AbilityDef.AbilityTypes.POSITION:
      return new PositionBasedAbilityDef(defJSON, subAbility);
    case AbilityDef.AbilityTypes.MULTIPART:
      return new MultipartAbilityDef(defJSON, subAbility);
    default:
      throw new Error("[" + defJSON['abilityType'] + "] not handled");
  }
  abilityType = defJSON['ability_type'];
}

/* Abilities for;
 * Chip
  * Request -- Support-based role
  * 1 - Some kind of damage ability
  * [Done] 2 - Single shot Penetrate ability.  Lots of damage that penetrates
  * 3 - Counter-based ability. Block a single enemy from damaging the team.
    * If this succeeds, shoot a projectile in each column around him.
  * 4 - Freeze single target for 3 turns.
  * 5 - % health reduction to an area
  *
  * OTHER - reduce all enemies in an area's health by 50%
 * Mitch
  * Probably tricky and unique things
  * Deal minor damage to an enemy.  If it dies, release a bunch of bullets.
 * Jeremy
 * Tabitha
*/
