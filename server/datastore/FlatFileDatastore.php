<?php
require_once('server/datastore/Datastore.php');
require_once('server/exceptions/GameDoesntExistException.php');
class FlatFileDatastore extends Datastore {
  private static $FILE_ID_REGEX = '(bouncy_|fmj_|cardsnmagic_)(\d+)';
  static function getNewGameID($gameType) {
    $path = self::getSavePath();
    $files = glob($path.'/*');
    if (count($files) > 20) {
      return null;
    }
    natsort($files);
    $files = array_filter($files, function($file) {
      echo $file;
      if (!preg_match('!' . self::$FILE_ID_REGEX . '!', $file, $matches)) {
        return false;
      }
      return true;
    });
    preg_match('!' . self::$FILE_ID_REGEX . '!', end($files), $matches);
    $game_id = $matches[2] + 1;
    return $gameType . "_" . $game_id;
  }

  static function getGameObjectMetadata($game_id) {
    $filename = self::getGameFileName($game_id, 'metadata', true, ".md");
    if (!file_exists($filename)) {
      throw new Exception("File doesn't exist: ''{$filename}'");
    }
    $json = file_get_contents($filename);
    return $json;
  }

  static function saveGameObjectMetadataJSON($game_object) {
    file_put_contents(
      self::getGameFileName($game_object->getID(), 'metadata', true, ".md"),
      json_encode($game_object->getMetadata()->serialize(null))
    );
  }

  static function getGameObjectJSON($game_id, $turn_id = -1) {
    if ($turn_id == -1) {
      $path = self::getSavePath($game_id, false);
      $files = glob($path.'/*.sav');
      natsort($files);
      preg_match('!' . $game_id . '/(\d+)!', end($files), $matches);
      $turn_id = $matches[1];
    }
    $filename = self::getGameFileName($game_id, $turn_id, false);
    if (!file_exists($filename)) {
      throw new Exception("File doesn't exist: ''{$filename}'");
    }
    $json = file_get_contents($filename);
    return $json;
  }

  static function deleteGame($game_id) {
    $path = self::getSavePath($game_id, false);
    foreach(glob($path . '/*') as $file) {
      if(is_dir($file)) rrmdir($file); else unlink($file);
    } rmdir($path);
  }

  static function saveGameObjectJSON($game_object) {
    file_put_contents(
      self::getGameFileName($game_object->getID(), $game_object->getCurrentTurn()),
      $game_object->getJSON()
    );
  }

  static function getGameList() {
    $path = self::getSavePath();
    $files = glob($path.'/*');
    natsort($files);
    $file_list = array_map(function($file) {
      preg_match('!' . self::$FILE_ID_REGEX . '!', $file, $matches);
      if (!$matches) {
        return null;
      }
      return array(
        'game_json' => self::getGameObjectJSON($matches[0]),
        'metadata' => self::getGameObjectMetadata($matches[0])
      );
    }, $files);

    $file_list = array_filter($file_list, function($game_data) {
      return $game_data !== null;
    });
    return $file_list;
  }

  private static function getSavePath($game_id = -1, $create = true) {
    if ($game_id === null) {
      throw new Exception("Can't create a null game ID");
    }
    if (!$create && !self::doesGameExist($game_id)) {
      throw new GameDoesntExistException("Game doesn't exist");
    }
    $path = "saves";

    if (!file_exists($path)) { mkdir($path); }
    if ($game_id != -1) {
      $path .= "/" . $game_id;
      if (!file_exists($path)) { mkdir($path); }
    }
    return $path;
  }

  private static function getGameFileName($game_id, $turn_id, $create = true, $extension = ".sav") {
    $filename = $turn_id . $extension;
    $path = self::getSavePath($game_id, $create);
    return $path . "/" . $filename;
  }

  public static function doesGameExist($game_id = -1) {
    $path = "saves";

    if (!file_exists($path)) { return false; }
    if ($game_id != -1) {
      $path .= "/" . $game_id;
      if (!file_exists($path)) { return false; }
    }
    return true;
  }

  /* Users */

  static function doesUserExist($user_id) {
    $path = "saves";
    if (!file_exists($path)) { return false; }
    $path .= "/users";

    if (!file_exists($path)) { return false; }
    $path .= "/" . $user_id;

    return file_exists($path);
  }

  private static function createNewUserPath($user_id) {
    if (self::doesUserExist($user_id)) {
      throw new Exception("User already exists");
    }
    if (!$user_id) {
      throw new Exception("Can't create user with empty user id");
    }

    $path = "saves";
    if (!file_exists($path)) { mkdir($path); }
    $path .= "/users";

    if (!file_exists($path)) { mkdir($path); }
    $path .= "/" . $user_id;

    if (!file_exists($path)) { mkdir($path); }
    return $path;
  }

  private static function getUserSavePath($user_id) {
    $path = "saves";
    if (!file_exists($path)) { mkdir($path); }
    $path .= "/users";

    if (!file_exists($path)) { mkdir($path); }
    $path .= "/" . $user_id;

    if (!file_exists($path)) { mkdir($path); }
    return $path;
  }

  static function getUserDataFileName($user_id) {
    $path = self::getUserSavePath($user_id);
    $path .= "/userData.sav";

    return $path;
  }

  static function saveUserData($user, $serialized_user_data) {
    file_put_contents(
      self::getUserDataFileName($user->id),
      json_encode($serialized_user_data)
    );
  }

  static function loadUserData($user) {
    $path = self::getUserDataFileName($user->id);
    if (!file_exists($path)) { return null; }
    $json = file_get_contents($path);
    return $json;
  }

  private static function throwIfNotAllowedToCreateUser($user_id) {
    if (self::doesUserExist($user_id)) {
      throw new Exception("User already exists");
    }
    if (!$user_id) {
      throw new Exception("Can't create user with empty user id");
    }

    $path = "saves";
    if (!file_exists($path)) { mkdir($path); }
    $path .= "/users";

    $total_users = count( glob($path . "/*", GLOB_ONLYDIR) );

    if ($total_users >= 1000) {
      throw new Exception("Too Many Users");
    }
  }

  static function createUser($user_id, $password_raw) {
    self::throwIfNotAllowedToCreateUser($user_id);

    self::createNewUserPath($user_id);
    $path = self::getUserSavePath($user_id);
    $path .= "/userMeta.json";

    $token_length = 15;
    $user_token = substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($token_length/strlen($x)) )),1,$token_length);

    file_put_contents(
      $path,
      json_encode([
        "user_id" => $user_id,
        "user_name" => $user_id,
        "password_hash" => password_hash($password_raw, PASSWORD_DEFAULT),
        "user_token" => $user_token,
      ])
    );
  }

  static function loadUserMetaJSON($user_id) {
    if (!self::doesUserExist($user_id)) {
      return null;
    }

    $path = self::getUserSavePath($user_id);
    $path .= "/userMeta.json";

    if (!file_exists($path)) { return null; }
    $json = file_get_contents($path);

    return json_decode($json);
  }

  static function getUserToken($user_id) {
    $user_data = self::loadUserMetaJSON($user_id);
    if (!$user_data) {
      return null;
    }

    return $user_data['user_token'];
  }

  static function doesUserIDPasswordMatch($user_id, $password_raw) {
    $user_data = self::loadUserMetaJSON($user_id);

    if (!$user_data) {
      return false;
    }

    if ($user_data->user_id === $user_id && password_verify($password_raw, $user_data->password_hash)) {
      return true;
    }
    return false;
  }
}
