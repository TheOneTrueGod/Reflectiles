const TurnPhasesEnum = {
  START_TURN: 'start_turn',
  PLAYER_ACTION: 'player_action',
  PLAYER_MINOR: 'player_minor',

  ALLY_ACTION: 'ally_action',
  ALLY_MOVE: 'ally_move',

  ENEMY_ACTION: 'enemy_action',
  ENEMY_MOVE: 'enemy_move',
  ENEMY_SPAWN: 'enemy_spawn',
  END_OF_TURN: 'end_of_turn',
  NEXT_TURN: 'next_turn',
}

TurnPhasesEnum.getNextPhase = function(currentPhase) {
  switch (currentPhase) {
    case TurnPhasesEnum.START_TURN:
      return TurnPhasesEnum.PLAYER_ACTION;
    case TurnPhasesEnum.PLAYER_ACTION:
      return TurnPhasesEnum.PLAYER_MINOR;

    case TurnPhasesEnum.PLAYER_MINOR:
      return TurnPhasesEnum.ALLY_ACTION;

    case TurnPhasesEnum.ALLY_ACTION:
      return TurnPhasesEnum.ALLY_MOVE;
    case TurnPhasesEnum.ALLY_MOVE:
      return TurnPhasesEnum.ENEMY_ACTION;

    case TurnPhasesEnum.ENEMY_ACTION:
      return TurnPhasesEnum.ENEMY_MOVE;
    case TurnPhasesEnum.ENEMY_MOVE:
      return TurnPhasesEnum.ENEMY_SPAWN;
    case TurnPhasesEnum.ENEMY_SPAWN:
      return TurnPhasesEnum.END_OF_TURN;
    case TurnPhasesEnum.END_OF_TURN:
      return TurnPhasesEnum.NEXT_TURN;
  }
}

TurnPhasesEnum.isPlayerCommandPhase = function(phase) {
  return phase == TurnPhasesEnum.PLAYER_ACTION ||
    phase == TurnPhasesEnum.PLAYER_MINOR;
}
