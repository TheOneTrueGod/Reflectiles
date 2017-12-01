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
      if ($user->getToken() == $token) {
        return $user;
      }
    }
    return null;
  }

  public static function getFromUsernamePassword($username, $password) {
    for ($i = 0; $i < count(User::$all_users); $i++) {
      $user = User::$all_users[$i];
      if (
        ($user->getID() == $username || $user->getUserName() == $username) &&
        $user->getPassword() == $password
      ) {
        return $user;
      }
    }
    return null;
  }

  public static function getFromID($id) {
    for ($i = 0; $i < count(User::$all_users); $i++) {
      $user = User::$all_users[$i];
      if ($user->getID() == $id) {
        return $user;
      }
    }
    return null;
  }
}

User::$all_users = array(
  new User('totg', "TheOneTrueGod", 'peanut', 'rttqwervczxdrfasdf'),
  new User('tab', "Tabitha", 'purple_rain', 'vdasfwqercvzxcfqwer'),
  new User('chip', "ILoveTheLag", 'lag_is_life', 'bbuieqrpzcvoin'),
  new User('tj', "Jabberwookie", 'greenhouse', 'bhcjdfjkewrigrnasdf'),
  new User('sean', "Zahken", 'cromat', 'bbcbxziuqerwperiut'),
  new User('mitch', "QQCanasian", 'qqcanasian', 'tupqwepribjfjeiwerb'),
  new User('clarence', "Vauss", 'lilly', 'gbcbzxcvdsfqwerqwer'),
  new User('test2', "test2", 'test', 'test2'),
  new User('test3', "test3", 'test', 'test3'),
  new User('test4', "test4", 'test', 'test4')
);
