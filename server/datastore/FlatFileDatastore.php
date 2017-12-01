<?php
require_once('server/datastore/Datastore.php');
require_once('server/exceptions/GameDoesntExistException.php');
class FlatFileDatastore extends Datastore {
  static function getNewGameID() {
    $path = self::getSavePath();
    $files = glob($path.'/*');
    if (count($files) > 10) {
      return null;
    }
    natsort($files);
    preg_match('!(\d+)!', end($files), $matches);
    $game_id = $matches[1] + 1;
    return $game_id;
  }

  static function getGameObjectMetadata($game_id) {
    $filename = self::getFileName($game_id, 'metadata', true, ".md");
    if (!file_exists($filename)) {
      throw new Exception("File doesn't exist: ''{$filename}'");
    }
    $json = file_get_contents($filename);
    return $json;
  }

  static function saveGameObjectMetadataJSON($game_object) {
    file_put_contents(
      self::getFileName($game_object->getID(), 'metadata', true, ".md"),
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
    $filename = self::getFileName($game_id, $turn_id, false);
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
      self::getFileName($game_object->getID(), $game_object->getCurrentTurn()),
      $game_object->getJSON()
    );
  }

  static function getGameList() {
    $path = self::getSavePath();
    $files = glob($path.'/*');
    natsort($files);
    return array_map(function($file) {
      preg_match('!(\d+)!', $file, $matches);
      return array(
        'game_json' => self::getGameObjectJSON($matches[1]),
        'metadata' => self::getGameObjectMetadata($matches[1])
      );
    }, $files);
  }

  private function getSavePath($game_id = -1, $create = true) {
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

  private function getFileName($game_id, $turn_id, $create = true, $extension = ".sav") {
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
}
