class AbilityDef {
  constructor(defJSON) {
    this.rawDef = defJSON;

    this.index = AbilityDef.ABILITY_DEF_INDEX;
    AbilityDef.abilityDefList[this.index] = this;
    AbilityDef.ABILITY_DEF_INDEX += 1;

    if (!defJSON['ability_type']) {
      throw new Error("Ability Defs need an abilityType");
    }
    this.abilityType = defJSON['ability_type'];
    this.ACTIVATE_ON_TICK = 1;

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
    this.rawJSON = defJSON;
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
    for (var i = 0; i < nestedList.length; i++) {
      if ((
          nestedList[i].effect && (
            nestedList[i].effect == ZoneAbilityDef.UnitEffectTypes.ABILITY ||
            nestedList[i].effect == PositionBasedEffect.EFFECTS.USE_ABILITY ||
            nestedList[i].effect == ProjectileShape.HitEffects.INFECT
          )
        )
        || nestedList[i].abil_def
      ) {
        var newAbil = AbilityDef.createFromJSON(nestedList[i].abil_def);
        nestedList[i].initializedAbilDef = newAbil;
        if (newAbil.abilityStyle === AbilityStyle.FALLBACK_STYLE) {
          newAbil.abilityStyle = this.abilityStyle;
        }
      }
    }
  }

  endOfTurn() {
    if (this.chargeType == AbilityDef.CHARGE_TYPES.TURNS) {
      this.charge = Math.min(this.maxCharge, this.charge + 1);
      this.chargeUpdated();
    }
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

  getAbilityHTML() {
    var card = this.createAbilityCard();
    var chargeDisplay = $("<div>", {"class": "chargeDisplay"});
    switch(this.chargeType) {
      case AbilityDef.CHARGE_TYPES.TURNS:
        chargeDisplay.addClass("chargeTypeTurns");
      break;
    }
    card.append(chargeDisplay);

    var tooltip = this.createTooltip();
    if (tooltip) {
      card.attr("data-toggle", "tooltip");
      card.attr("title", tooltip.html());
      card.tooltip({
        constraints: [{'to':'scrollParent','pin':true}],
        html: true
      });
    }

    var chargeNumber = $("<div>", {"class": "chargeNumber noselect"});
    chargeDisplay.append(chargeNumber);

    return card;
  }

  createTooltip() {
    var name = this.getOptionalParam("name", null);
    var text = this.replaceSmartTooltipText(
      this.getOptionalParam("description", null)
    );
    var tooltip = $("<div>", {"class": "tooltip"});
    if (!name && !text) { return null; }
    if (name) {
      tooltip.append(
        $("<div class='cardTooltipName'>" + name + "</div>", {"class": "tooltipName"})
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
    return text;
  }

  createAbilityCard() {
    throw new Error("Ability Defs shouldn't be initialized");
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
    return AbilityDef.createFromJSON(this.rawJSON);
  }
  
  createAbilityCard() {
    var cardClass = "tempFirstAbil";

    var $card = $("<div>", {
      "class": "abilityCard " + cardClass + "",
      "ability-id": this.index,
    });

    var $icon = $("<div>", {"class": "abilityCardIcon"});
    $card.append($icon);
    var iconURL = idx(this.rawDef, 'icon', null);
    if (iconURL) {
      var $image = $("<img src='" + iconURL + "'/>");
      $icon.append($image);
    } else {
      this.addDefaultIcon($icon);
    }

    $card.append(this.getTextDescription());
    
    $card.append(this.getCooldownIcon());

    return $card;
  }
  
  addDefaultIcon($icon) {
    
  }
  
  getCooldownIcon() {
    let cooldownTime = 0;
    if (this.maxCharge) {
      cooldownTime = this.maxCharge;
    }
    
    if (cooldownTime) {
      let $cooldownIcon = $("<div>", {"class": "cooldownIcon"});
      let $cooldownText = $("<div>", {"class": "cooldownText"});
      $cooldownText.text(cooldownTime);
      $cooldownIcon.append($cooldownText);
      return $cooldownIcon;
    }
  }
  
  getTextDescription() {
    var $textDesc = $("<div>", {"class": "abilityCardTextDesc"});

    var abilDefCardDescription = this.getOptionalParam('card_text_description');
    if (abilDefCardDescription) {
      abilDefCardDescription = this.replaceSmartTooltipText(abilDefCardDescription, false);
      var className = "textDescText noselect";

      /*if (abilDefCardDescription.length >= 10) {
        className += " longDesc";
      }*/
      var $textContainer =
        $("<div>", {
          "class": className,
        });
      $textContainer.html(abilDefCardDescription);

      $textDesc.append($textContainer);
    } else {
      this.shape.appendTextDescHTML($textDesc);
    }

    return $textDesc;
  }
}
AbilityDef.CHARGE_TYPES = {
  TURNS: 'TURNS'
};

AbilityDef.abilityDefList = {};
AbilityDef.ABILITY_DEF_INDEX = 0;

AbilityDef.AbilityTypes = {
  PROJECTILE: 'PROJECTILE',
  ZONE: 'ZONE',
  CREATE_UNIT: 'CREATE_UNIT',
  POSITION: 'POSITION',
  LASER: 'LASER',
  SPECIAL: 'SPECIAL'
};

AbilityDef.SPECIAL_EFFECTS = {
  TURRET_AIM: 'TURRET_AIM',
  TURRET_FIRE: 'TURRET_FIRE',
}

AbilityDef.createFromJSON = function(defJSON) {
  if (!defJSON['ability_type']) {
    throw new Error("defJSON needs an ability_type")
  }
  switch (defJSON['ability_type']) {
    case AbilityDef.AbilityTypes.PROJECTILE:
      return new ProjectileAbilityDef(defJSON);
    case AbilityDef.AbilityTypes.ZONE:
      return new ZoneAbilityDef(defJSON);
    case AbilityDef.AbilityTypes.CREATE_UNIT:
      return new SummonUnitAbilityDef(defJSON);
    case AbilityDef.AbilityTypes.POSITION:
      return new PositionBasedAbilityDef(defJSON);
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
