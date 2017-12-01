const TurnPhasesEnum = {
  PLAYER_ACTION_1: 'player_action_1',
  PLAYER_ACTION_2: 'player_action_2',
  PLAYER_ACTION_3: 'player_action_3',
  PLAYER_ACTION_4: 'player_action_4',
  PLAYER_ACTION: 'player_action',
  PLAYER_MOVE: 'player_move',

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
    case TurnPhasesEnum.PLAYER_ACTION_1:
      if (DO_TURNS_SIMULTANEOUSLY) {
        return TurnPhasesEnum.PLAYER_MOVE;
      }
      return TurnPhasesEnum.PLAYER_ACTION_2;
    case TurnPhasesEnum.PLAYER_ACTION_2:
      return TurnPhasesEnum.PLAYER_ACTION_3;
    case TurnPhasesEnum.PLAYER_ACTION_3:
      return TurnPhasesEnum.PLAYER_ACTION_4;
    case TurnPhasesEnum.PLAYER_ACTION_4:
      return TurnPhasesEnum.PLAYER_MOVE;

    case TurnPhasesEnum.PLAYER_MOVE:
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
  return phase == TurnPhasesEnum.PLAYER_ACTION_1 ||
    phase == TurnPhasesEnum.PLAYER_ACTION_2 ||
    phase == TurnPhasesEnum.PLAYER_ACTION_3 ||
    phase == TurnPhasesEnum.PLAYER_ACTION_4 ||
    phase == TurnPhasesEnum.PLAYER_ACTION ||
    phase == TurnPhasesEnum.PLAYER_MOVE;
}
