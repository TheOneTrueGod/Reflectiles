class UIListeners {
  contructor() {

  }

  setupUIListeners() {
    $('#missionEndTurnButton').on('click', function() {
      TurnControls.setPlayState(false);
      MainGame.finalizeTurn();
    });

    var self = this;

    $('#missionProgramDisplay .abilityCard').on(
      'click',
      function() {
        // Deselect currently selected abilities
        PlayerInput.setSelectedAbility($(this).attr("ability-id"));
        self.updateSelectedAbility();
      }
    );

    $('#missionActionDisplay').on('click', function(event) {
      PlayerInput.handleClick(this, event);
    });

    $('#missionActionDisplay').on('contextmenu', function(event) {
      PlayerInput.handleClick(this, event);
      event.preventDefault();
      return false;
    });

    $('.playButton').on('click', function(event) {
      TurnControls.togglePlay();
    });

    $('.resetTurnIcon').on('click', function(event) {
      MainGame.boardState.loadState();
      TurnControls.setPlayState(false);
      TurnControls.updateTimeline(
        MainGame.boardState.tick,
        MainGame.ticksPerTurn
      );
    });
  }

  updateSelectedAbility() {
    $('.abilityCard.selected').removeClass('selected');
    if (PlayerInput.getSelectedAbility()) {
      $('.abilityCard[ability-id=' + PlayerInput.getSelectedAbility() + ']')
        .addClass("selected");
    }
  }
}

UIListeners = new UIListeners();
