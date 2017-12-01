class TurnControls {
  contructor() {
    this.playState = false;
  }

  togglePlay() {
    this.setPlayState(!this.playState);
    if (this.playState) {
      this.playTick();
    }
  }

  playTick() {
    if (!this.playState) { return; }
    if (MainGame.boardState.atEndOfTurn()) {
      this.setPlayState(false);
      return;
    }
    var self = this;
    MainGame.doTick(
      function() {
        window.setTimeout(self.playTick.bind(self), 200);
      },
      function() {
        self.setPlayState(false);
      }
    );
  }

  setPlayState(state) {
    $('.playButton').removeClass('play').removeClass('pause');
    this.playState = state;
    if (this.playState) {
      $('.playButton').addClass('pause');
    } else {
      $('.playButton').addClass('play');
    }
  }
}

TurnControls = new TurnControls();
