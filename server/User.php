<?php
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
    return $this->userName == "TheOneTrueGod";
  }

  public function hasPermission($permission) {
    switch ($permission) {
      case 'CREATE_NEW_GAME':
        return $this->userName == "TheOneTrueGod";
      case 'DELETE_GAME':
        return $this->userName == "TheOneTrueGod";
    }
    return false;
  }

  public static function getFromToken($token) {
    for ($i = 0; $i < count(User::$all_users); $i++) {
      $user = User::$all_users[$i];
      if ($user[3] == $token) {
        return new static($user[0], $user[1], $user[2], $user[3]);
      }
    }
    return null;
  }

  public static function getFromUsernamePassword($username, $password) {
    for ($i = 0; $i < count(User::$all_users); $i++) {
      $user = User::$all_users[$i];
      if (
        ($user[0] == $username || $user[1] == $username) &&
        $user[2] == $password
      ) {
        return new static($user[0], $user[1], $user[2], $user[3]);
      }
    }
    return null;
  }

  public static function getFromID($id) {
    for ($i = 0; $i < count(User::$all_users); $i++) {
      $user = User::$all_users[$i];
      //print_r("---------[");
      //print_r($user[0], $id);
      //print_r("]---------");
      if ($user[0] == $id) {
        return new static($user[0], $user[1], $user[2], $user[3]);
      }
    }
    return null;
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
  array('test2', "test2", 'test', 'test2'),
  array('test3', "test3", 'test', 'test3'),
  array('test4', "test4", 'test', 'test4')
);

User::$all_users[999999999] = array('test_user', "test_user", "test_user", "test_user");
