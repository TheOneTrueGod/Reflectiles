<?php
require_once('./server/datastore/DatastoreFactory.php');
class User {
  public static $all_users;
  public function __construct($id, $username, $password, $token) {
    $this->id = $id;
    $this->token = $token;
    $this->userName = $username;
    $this->password = $password;
  }

  public function getID() {
    return $this->id;
  }

  public function getUserName() { return $this->userName; }
  public function getPassword() { return $this->password; }

  public function isHost() {
    return $this->userName == "TheOneTrueGod";
  }

  public function getToken() {
    return $this->token;
  }

  public function isAdmin() {
    return $this->userName == "TheOneTrueGod" || $this->userName == "ILoveTheLag";
  }

  public function hasPermission($permission) {
    switch ($permission) {
      case 'CREATE_NEW_GAME':
        return true;
      case 'DELETE_GAME':
        return $this->userName == "TheOneTrueGod";
    }
    return false;
  }

  public static function getFromUsernamePassword($username, $password) {
    if (!DatastoreFactory::getDatastore()->doesUserIDPasswordMatch($username, $password)) {
      return null;
    }

    return self::getFromID($username);
  }

  public static function getFromID($id) {
    $user_json = DatastoreFactory::getDatastore()->loadUserMetaJSON($id);
    if (!$user_json) { return null; }
    return new static($user_json->user_id, $user_json->user_name, $user_json->password_hash, $user_json->user_token);
  }
}

User::$all_users = array(
  array('totg', "TheOneTrueGod", 'peanut', 'rttqwervczxdrfasdf'),
  array('tab', "Tabitha", 'purple_rain', 'vdasfwqercvzxcfqwer'),
  array('chip', "ILoveTheLag", 'lag_is_life', 'bbuieqrpzcvoin'),
  array('tj', "Jabberwookie", 'greenhouse', 'bhcjdfjkewrigrnasdf'),
  array('sean', "Zahken", 'cromat', 'bbcbxziuqerwperiut'),
  array('mitch', "QQCanasian", 'qqcanasian', 'tupqwepribjfjeiwerb'),
  array('clarence', "Vauss", 'lilly', 'gbcbzxcvdsfqwerqwer'),
  array('taison', "Toyboat", 'lobut', 'bbzxchvufdhqowerasdf'),
  array('test2', "test2", 'test2', 'test2'),
  array('test3', "test3", 'test3', 'test3'),
  array('test4', "test4", 'test4', 'test4')
);

User::$all_users[999999999] = array('test_user', "test_user", "test_user", "test_user");
