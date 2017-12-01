<?php
class DatabaseDatastore extends Datastore {
  $servername = "localhost";
  $username = "username";
  $password = "password";
  function loadGameObjectJSON($game_id) {
    // Create connection
    $conn = mysqli_connect($servername, $username, $password);

    // Check connection
    if (!$conn) {
      die("Connection failed: " . mysqli_connect_error());
    }
    echo "Connected successfully";
  }

  function saveGameObjectJSON($game_object) {

  }
}
