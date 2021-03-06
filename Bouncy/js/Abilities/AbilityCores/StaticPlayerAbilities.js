const StaticPlayerAbilities = {abilities: {}, initialize: function() {
    StaticPlayerAbilities.abilities = {
      PLAYER_MOVE: AbilityDef.createFromJSON({
        name: 'Move',
        description: 'Walk towards a target point.',
        card_text_description: 'Move',
        max_dist: Unit.UNIT_SIZE * 2,
        move_speed: 4,
        collides_with_enemies: true,
        ability_type: AbilityDef.AbilityTypes.PLAYER_MOVE,
        icon: "/Bouncy/assets/icons/icon_plain_explosion.png",
        action_phase: TurnPhasesEnum.PLAYER_MINOR,
      })
    }
  }
};

StaticPlayerAbilities.initialize();
