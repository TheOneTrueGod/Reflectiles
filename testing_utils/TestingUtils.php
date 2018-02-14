<?php
function slog($text) {
  file_put_contents("slog.txt", $text, FILE_APPEND);
  file_put_contents("slog.txt", "\n", FILE_APPEND);
}

function logLine($text) {
  print_r($text);
  echo "\n";
}

function logGreenLine($text) {
  echo "\e[32m";
  logLine($text);
  echo "\e[0m"; // Reset text to normal
}

function logRedLine($text) {
  echo "\e[31m";
  logLine($text);
  echo "\e[0m"; // Reset text to normal
}

function logYellowLine($text) {
  echo "\e[33m";
  logLine($text);
  echo "\e[0m"; // Reset text to normal
}

function logBlueLine($text) {
  echo "\e[34m";
  logLine($text);
  echo "\e[0m"; // Reset text to normal
}

function runTest($test_name, $test_callback) {
  logBlueLine("Testing " . $test_name);
    try {
      $test_callback();
      logGreenLine($test_name . " Success");
    } catch (Exception $e) {
      logRedLine($test_name . " Failure");
      logRedLine($e->getMessage());
    }
}
