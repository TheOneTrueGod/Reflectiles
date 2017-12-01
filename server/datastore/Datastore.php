<?php
abstract class Datastore {
  abstract static function getGameObjectJSON($game_id, $turn_id = -1);
  abstract static function saveGameObjectJSON($game_object);
  abstract static function getNewGameID();
  abstract static function getGameList();
  abstract static function deleteGame($game_id);
}
