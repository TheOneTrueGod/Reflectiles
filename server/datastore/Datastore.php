<?php
abstract class Datastore {
  abstract static function getGameObjectJSON($game_id, $turn_id = -1);
  abstract static function saveGameObjectJSON($game_object);
  abstract static function getNewGameID();
  abstract static function getGameList();
  abstract static function deleteGame($game_id);

  abstract static function loadUserMetaJSON($user_id);
  abstract static function doesUserExist($user_id);
  abstract static function createUser($user_id, $password_hash);
  abstract static function doesUserIDPasswordMatch($user_id, $password_raw);
  abstract static function getUserToken($user_id);
}
