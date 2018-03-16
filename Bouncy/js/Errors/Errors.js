class Errors {
  static show(errorMessage) {
    $('#errorBox').text(errorMessage).show().fadeOut(2000);
  }
}
