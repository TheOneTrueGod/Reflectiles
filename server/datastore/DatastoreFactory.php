<?php
require_once('server/datastore/FlatFileDatastore.php');

abstract class DatastoreFactory {
  public static function getDatastore() {
    return new FlatFileDatastore();
  }
}
