class UnitTooltips {
  static createTooltip(unit) {
    let tooltipContainer =
     $('<div>', {
      class: 'unitTooltip',
      unit_id: unit.id,
    });

    let tooltipData = UnitTooltips.getTooltipData(unit);

    tooltipContainer.append(
      $('<div>' + tooltipData.name + '</div>').addClass('unitName noselect')
    );

    tooltipContainer.append(UnitTooltips.getHealthBars(unit));

    if (tooltipData.description !== null) {
      tooltipContainer.append(
        $('<div>' + tooltipData.description + '</div>').addClass('unitDescription')
      );
    }

    let statusEffectContainer = $('<div>').addClass('statusEffectContainer');
    if (unit.getShield().max > 0) {
      statusEffectContainer.append(
        UnitTooltips.getStatusEffectTooltip('Shield')
      );
    }

    if (unit.getArmour().max > 0) {
      statusEffectContainer.append(
        UnitTooltips.getStatusEffectTooltip('Armour')
      );
    }

    for (var key in unit.statusEffects) {
      let statusEffect = UnitTooltips.getStatusEffectTooltip(unit.statusEffects[key]);
      if (statusEffect) {
        statusEffectContainer.append(statusEffect);
      }
    }

    let traitContainer = $('<div>').addClass('traitContainer');
    for (var key in unit.traits) {
      let traitTooltip = UnitTooltips.getTraitTooltip(key, unit.traits[key]);
      if (traitTooltip) {
        traitContainer.append(traitTooltip);
      }
    }

    if (traitContainer.children().length > 0) {
      tooltipContainer.append(
        $('<hr/>').addClass('statusEffectLine')
      );
      tooltipContainer.append(traitContainer);
    }

    if (statusEffectContainer.children().length > 0) {
      tooltipContainer.append(
        $('<hr/>').addClass('statusEffectLine')
      );
      tooltipContainer.append(statusEffectContainer);
    }

    return tooltipContainer;
  }

  static createZoneTooltip(zone) {
    let tooltipContainer =
     $('<div>', {
      class: 'unitTooltip',
      unit_id: zone.id,
    });

    tooltipContainer.append(
      $('<div>' + UnitTooltips.getZoneName(zone) + '</div>').addClass('unitName noselect')
    );

    if (
      zone.creatorAbility.getOptionalParam('zone_type') !==
      ZoneAbilityDef.ZoneTypes.BLOCKER_BARRIER
    ) {
      tooltipContainer.append(UnitTooltips.getHealthBars(zone));
    }

    const tooltipDescription = UnitTooltips.getZoneDescription(zone);
    if (tooltipDescription !== null) {
      tooltipContainer.append(
        $('<div>' + tooltipDescription + '</div>').addClass('unitDescription')
      );
    }

    let statusEffectContainer = $('<div>').addClass('statusEffectContainer');
    if (zone.getShield().max > 0) {
      statusEffectContainer.append(
        UnitTooltips.getStatusEffectTooltip('Shield')
      );
    }

    if (zone.getArmour().max > 0) {
      statusEffectContainer.append(
        UnitTooltips.getStatusEffectTooltip('Armour')
      );
    }
    for (var key in zone.statusEffects) {
      let statusEffect = UnitTooltips.getStatusEffectTooltip(unit.statusEffects[key]);
      if (statusEffect) {
        statusEffectContainer.append(statusEffect);
      }
    }

    if (statusEffectContainer.children().length > 0) {
      tooltipContainer.append(
        $('<hr/>').addClass('statusEffectLine')
      );
      tooltipContainer.append(statusEffectContainer);
    }

    return tooltipContainer;
  }

  static getUnitAttack(unit) {
    return 2;
  }

  static getHealthBars(unit) {
    let healthContainer = $('<div class="healthBarContainer">');
    let numHealthBars = 0;

    let shieldPct = unit.getShield().current / unit.getShield().max * 100;
    let currShield = Math.ceil(unit.getShield().current);
    let maxShield = unit.getShield().max;
    if (maxShield > 0) {
      numHealthBars += 1;
      healthContainer.append(
        $(
          '<div>' +
            '<div class="healthBar shield" style="width: ' + shieldPct + '%;"/> ' +
            '<div class="healthNumber noselect">' + currShield + '</div>' +
          '</div>'
        ).addClass('unitHealth')
      );
    }

    let armourPct = unit.getArmour().current / unit.getArmour().max * 100;
    let currArmour = Math.ceil(unit.getArmour().current);
    let maxArmour = unit.getArmour().max;
    if (maxArmour > 0) {
      numHealthBars += 1;
      healthContainer.append(
        $(
          '<div>' +
            '<div class="healthBar armour" style="width: ' + armourPct + '%;"/> ' +
            '<div class="healthNumber noselect">' + currArmour + '</div>' +
          '</div>'
        ).addClass('unitHealth')
      );
    }

    let healthPct = unit.health.current / unit.health.max * 100;
    if (healthPct > 0 || numHealthBars == 0) {
      let healthDisplayPct = healthPct;
      let healthDisplayValue = Math.ceil(unit.health.current);
      if (numHealthBars == 0 && unit.health.max == 0 && unit instanceof ZoneEffect) {
        healthDisplayPct = unit.timeLeft.current / unit.timeLeft.max * 100;
        healthDisplayValue = unit.timeLeft.current;
      }
      numHealthBars += 1;
      healthContainer.append(
        $(
          '<div>' +
            '<div class="healthBar" style="width: ' + healthDisplayPct + '%;"/> ' +
            '<div class="healthNumber noselect">' + healthDisplayValue + '</div>' +
          '</div>'
        ).addClass('unitHealth')
      );
    }

    if (numHealthBars == 1) { healthContainer.addClass('oneBar'); }
    else if (numHealthBars == 2) { healthContainer.addClass('twoBar'); }
    else if (numHealthBars == 3) { healthContainer.addClass('threeBar'); }

    return healthContainer;
  }

  static getTooltipData(unit) {
    return {
      'name': UnitTooltips.getUnitName(unit),
      'description': UnitTooltips.getDescription(unit),
    }
  }

  static getZoneName(zone) {
    if (!zone.creatorAbility) {
      console.warn("Zone has no creator ability: " + zone);
      return '<ERROR>';
    }
    switch (zone.creatorAbility.getOptionalParam('zone_type')) {
      case ZoneAbilityDef.ZoneTypes.KNIGHT_SHIELD:
        return "Shield";
      case ZoneAbilityDef.ZoneTypes.BLOCKER_BARRIER:
        return "Barrier";
    }

    let name = zone.creatorAbility.getOptionalParam('zone_tooltip_name', null);
    if (name) {
      return name;
    }
    return '<Zone>';
  }

  static getZoneDescription(zone) {
    if (!zone.creatorAbility) {
      console.warn("Zone has no creator ability: " + zone);
      return '<ERROR>';
    }
    switch (zone.creatorAbility.getOptionalParam('zone_type')) {
      case ZoneAbilityDef.ZoneTypes.KNIGHT_SHIELD:
        return "Blocks bullets.  Dissapears at end of turn.";
      case ZoneAbilityDef.ZoneTypes.BLOCKER_BARRIER:
        return "Blocks all bullets that try to pass through.";
    }

    let description = zone.creatorAbility.replaceSmartTooltipText(
      zone.creatorAbility.getOptionalParam('zone_tooltip_description', null)
    );
    if (description) {
      return description;
    }
    return '<Description>';
  }

  static getUnitName(unit) {
    switch (unit.constructor.name) {
      case 'UnitBasicSquare':
      case 'UnitBasicDiamond':
        return 'Basic';
      case 'UnitFast':
        return 'Fast';
      case 'UnitShover':
      case 'UnitHeavy':
        return 'Strong';
      case 'UnitBomber':
        return 'Bomber';
      case 'UnitKnight':
        return 'Knight';
      case 'UnitDefensive':
        return 'Defender';
      case 'UnitProtector':
        return 'Protector';
      case 'UnitShooter':
        return 'Shooter';
      case 'UnitBlocker':
        return 'Blocker';
      case 'UnitBossHealer':
        return 'Healer';
      case 'UnitSlime':
        return 'Slime';
      case 'UnitBossSlime':
        return 'Giant Slime';
      case 'UnitSkeleton':
        return 'Skeleton';
      case 'UnitNecromancer':
        return 'Necromancer';
      case 'UnitBossWarlock':
        return 'Warlock';
      case 'UnitBossKing':
        return 'The King';
      case 'UnitCastleWall':
        return 'Castle Wall';
    }
    console.warn('no unit name for [' + unit.constructor.name + ']');
    return '<' + unit.constructor.name + '>';
  }

  static getDescription(unit) {
    let maxDamage;
    let range;
    let maxSkeletons; let numTurns;
    switch (unit.constructor.name) {
      case 'UnitBasicSquare':
      case 'UnitBasicDiamond':
        return null;
      case 'UnitFast':
        return 'Moves 2 spaces every turn';
      case 'UnitShover':
      case 'UnitHeavy':
        return null;
      case 'UnitBomber':
        return 'A unit carrying a bomb.  It will explode in ' + unit.timeLeft + ' turn' + (unit.timeLeft > 1 ? 's' : '') + ', dealing ' +
          NumbersBalancer.getUnitAbilityNumber(unit, NumbersBalancer.UNIT_ABILITIES.BOMBER_EXPLOSION_DAMAGE) + ' damage.';
      case 'UnitKnight':
        return 'Every turn, the knight creates three shields in front of itself.' +
          '  Each shield has ' + NumbersBalancer.getUnitAbilityNumber(unit, NumbersBalancer.UNIT_ABILITIES.KNIGHT_SHIELD) + ' health.';
      case 'UnitDefensive':
        maxDamage = NumbersBalancer.getUnitAbilityNumber(unit, NumbersBalancer.UNIT_ABILITIES.DEFENSIVE_MAX_DAMAGE);
        return 'If it takes more than ' + maxDamage + ' damage in a single turn, it puts up its shields and blocks all further damage in that turn.';
      case 'UnitProtector':
        let numTargets = NumbersBalancer.getUnitAbilityNumber(unit, NumbersBalancer.UNIT_ABILITIES.PROTECTOR_SHIELD_NUM_TARGETS);
        let shieldVal = NumbersBalancer.getUnitAbilityNumber(unit, NumbersBalancer.UNIT_ABILITIES.PROTECTOR_SHIELD);
        return 'Every turn, the protector shields ' + numTargets + ' nearby units.' +
          '  Each shield has ' + shieldVal + ' health.';
      case 'UnitShooter':
        let damage = NumbersBalancer.getUnitAbilityNumber(unit, NumbersBalancer.UNIT_ABILITIES.SHOOTER_DAMAGE);
        return 'Shoots every turn dealing ' + damage + ' damage.';
      case 'UnitBossHealer':
        let healAmount = NumbersBalancer.getUnitAbilityNumber(unit,
          NumbersBalancer.UNIT_ABILITIES.UNIT_BOSS_HEALER_AMOUNT);
        let healTargets = NumbersBalancer.getUnitAbilityNumber(unit,
          NumbersBalancer.UNIT_ABILITIES.UNIT_BOSS_HEALER_NUM_TARGETS);
        return 'Every turn, this unit heals up to ' + healTargets + ' units for ' + healAmount + ' health.';
      case 'UnitBlocker':
        return 'If there are two blockers in the same row, they create an indestructable barrier between them.';
      case 'UnitSlime':
        return null;
      case 'UnitBossSlime':
        let splitThreshold = NumbersBalancer.getUnitAbilityNumber(unit,
          NumbersBalancer.UNIT_ABILITIES.BOSS_SLIME_SPLIT_THRESHOLD);
        return 'Whenever this slime takes ' + splitThreshold + ' damage, it releases a smaller slime nearby.';
      case 'UnitSkeleton':
        return '';
      case 'UnitNecromancer':
        range = NumbersBalancer.getUnitAbilityNumber(unit, NumbersBalancer.UNIT_ABILITIES.NECROMANCER_RANGE);
        maxSkeletons = NumbersBalancer.getUnitAbilityNumber(unit, NumbersBalancer.UNIT_ABILITIES.NECROMANCER_MAX_SKELETONS_PER_TURN);
        return 'If a unit dies within ' + range + ' squares, the necromancer reanimates it as a skeleton.  It can only reanimate up to ' + maxSkeletons + ' skeletons per turn.';
      case 'UnitBossWarlock':
        range = NumbersBalancer.getUnitAbilityNumber(unit, NumbersBalancer.UNIT_ABILITIES.WARLOCK_RANGE);
        maxSkeletons = NumbersBalancer.getUnitAbilityNumber(unit, NumbersBalancer.UNIT_ABILITIES.WARLOCK_MAX_SKELETONS_PER_TURN);
        let boneWallHealth = NumbersBalancer.getUnitAbilityNumber(unit, NumbersBalancer.UNIT_ABILITIES.WARLOCK_SHIELD);
        return 'If a unit dies within ' + range + ' squares, the warlock reanimates it as a skeleton.  It can only reanimate up to ' + maxSkeletons + ' skeletons per turn.<br>' +
          'Also creates a bone wall with ' + boneWallHealth + ' health around itself.';
      case 'UnitBossKing':
        numTurns = NumbersBalancer.getUnitAbilityNumber(unit, NumbersBalancer.UNIT_ABILITIES.KING_REVIVE_TURNS);
        return 'All enemy units are unable to move as long as The King is around.  If an enemy unit dies, it is reinforced after ' + numTurns + ' turns.';
      case 'UnitCastleWall':
        numTurns = NumbersBalancer.getUnitAbilityNumber(unit, NumbersBalancer.UNIT_ABILITIES.CASTLE_WALL_REVIVE_TURNS);
        return 'If the wall is destroyed, it is rebuilt after ' + numTurns + ' turns.';
    }
    console.warn('no description for [' + unit.constructor.name + ']');
    return '<no description>';
  }

  static getStatusEffectTooltip(statusEffect) {
    if (statusEffect instanceof ShieldStatusEffect) { return null; }
    var name = UnitTooltips.getStatusEffectName(statusEffect);
    var effect = UnitTooltips.getStatusEffectDescription(statusEffect);
    if (!name && !effect) {
      console.warn('no status effect for [' + statusEffect.constructor.name + ']');
      return null;
    }
    let colour = UnitTooltips.getEffectColour(statusEffect);
    return $('<div>' +'<span style="color:' + colour + '">' + name + '</span> - ' + effect + '</div>');
  }

  static getEffectColour(statusEffect) {
    if (statusEffect == "Armour") {
      return "darkgray";
    } else if (statusEffect == "Shield") {
      return "#c119b9";
    }
    switch (statusEffect.constructor.name) {
      case 'PoisonStatusEffect':
        return '#47e549';
      case 'FreezeStatusEffect':
        return '#6666ff';
      case 'WeaknessStatusEffect':
        return '#8F4F58';
      case 'InfectStatusEffect':
        return '#db4dff';
    }
    return 'white';
  }

  static getStatusEffectName(statusEffect) {
    if (statusEffect == "Armour") {
      return "Armour";
    } else if (statusEffect == "Shield") {
      return "Shield";
    }
    switch (statusEffect.constructor.name) {
      case 'PoisonStatusEffect':
        return 'Poison';
      case 'FreezeStatusEffect':
        return 'Freeze';
      case 'WeaknessStatusEffect':
        return 'Weakness';
      case 'InfectStatusEffect':
        return 'Infect';
    }
    console.warn('no status effect name for [' + statusEffect.constructor.name + ']');
    return null;
  }

  static getStatusEffectDescription(statusEffect) {
    if (statusEffect == "Armour") {
      return "Unit is armoured.  Armour acts as extra health.";
    } else if (statusEffect == "Shield") {
      return "Unit is shielded.  Shields act as extra health.";
    }
    switch (statusEffect.constructor.name) {
      case 'PoisonStatusEffect':
        return 'Deals ' + statusEffect.damage + ' damage per turn for ' + statusEffect.duration + ' turns';
      case 'FreezeStatusEffect':
        return 'The unit is stunned for ' + statusEffect.duration + ' turns';
      case 'WeaknessStatusEffect':
        return 'The unit takes 50% more damage';
      case 'InfectStatusEffect':
        return 'If the unit dies within ' + statusEffect.duration + ' turns, it explodes';
    }
    console.warn('no status effect description for [' + statusEffect.constructor.name + ']');
  }

  static getTraitTooltip(trait, value) {
    var name = UnitTooltips.getTraitName(trait, value);
    var effect = UnitTooltips.getTraitDescription(trait, value);
    if (!name && !effect) {
      console.warn('no status effect for [' + trait + ']');
      return null;
    }
    let colour = UnitTooltips.getTraitColour(trait);
    return $('<div>' +'<span style="color:' + colour + '">' + name + '</span> - ' + effect + '</div>');
  }

  static getTraitColour(trait) {
    switch (trait) {
      case Unit.UNIT_TRAITS.FROST_IMMUNE:
        return '#6666ff';
      case Unit.UNIT_TRAITS.POISON_IMMUNE:
        return '#47e549';
      case Unit.UNIT_TRAITS.RESILIANT:
        return '#BBBBBB';
      default:
        return '#FFFFFF';
    }
  }

  static getTraitName(trait, value) {
    switch (trait) {
      case Unit.UNIT_TRAITS.FROST_IMMUNE:
        return 'Frost Immune';
      case Unit.UNIT_TRAITS.POISON_IMMUNE:
        return 'Poison Immune';
      case Unit.UNIT_TRAITS.RESILIANT:
        return 'Resiliant';
      default:
        return '[[NAME]]';
    }
  }

  static getTraitDescription(trait, value) {
    switch (trait) {
      case Unit.UNIT_TRAITS.FROST_IMMUNE:
        return 'This unit is immune to being frozen';
      case Unit.UNIT_TRAITS.POISON_IMMUNE:
        return 'This unit is immune to being poisoned';
      case Unit.UNIT_TRAITS.RESILIANT:
        return 'Can\'t take more than ' + value + ' damage per attack';
      default:
        return '[[DESCRIPTION GOES HERE]]';
    }
  }
}
