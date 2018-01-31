class AbilityCardBuilder {
  // Small ability card with icon, name, and tooltip
  static createDeckListAbilityCard(ability) {
    return $("<div>", {
      class: "abilityCard deckList",
    }).append(
      $("<img>", {
        class: "abilityCardIcon",
        src: AbilityCardBuilder.getIconURL(ability),
      })
    ).append(
      $("<span>", {
        class: "abilityCardName",
        text: ability.getName(),
      })
    );
  }

  static createStandardAbilityCard(ability) {
    var $card = $("<div>", {
      "class": "abilityCard",
      "ability-id": ability.index,
    });

    var $icon = $("<div>", {"class": "abilityCardIcon"});
    $card.append($icon);
    var iconURL = AbilityCardBuilder.getIconURL(ability);
    var $image = $("<img src='" + iconURL + "'/>");
    $icon.append($image);

    $card.append(AbilityCardBuilder.getTextDescription(ability));

    $card.append(ability.getCooldownIcon());
    $card.append(ability.getHTMLForTopLeftOfCard());

    var tooltip = ability.createTooltip();
    if (tooltip) {
      $card.attr("data-toggle", "tooltip");
      $card.attr("title", tooltip.html());
      $card.tooltip({
        constraints: [{'to':'scrollParent','pin':true}],
        html: true
      });
    }

    var topRight = ability.getHTMLForCardNotUseableSection();
    if (topRight) { $card.append(topRight); }

    return $card;
  }

  /* card pieces */

  static getTextDescription(ability) {
    var $textDesc = $("<div>", {"class": "abilityCardTextDesc"});

    var abilDefCardDescription = ability.getOptionalParam('card_text_description');
    if (abilDefCardDescription) {
      abilDefCardDescription = ability.replaceSmartTooltipText(abilDefCardDescription, false);
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
      ability.shape.appendTextDescHTML($textDesc);
    }

    return $textDesc;
  }

  static getIconURL(ability) {
    var iconURL = idx(ability.rawDef, 'icon',
      "../Bouncy/assets/icons/icon_plain_shield.png");
    return iconURL;
  }
};
