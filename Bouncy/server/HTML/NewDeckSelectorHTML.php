<link rel="stylesheet" type="text/css" href="/Bouncy/style/deckbuilderstyle.css">
<div class="cardControlSection hidden">
  <div>
    <div class="headerSection">
      <div class="deckManagerButton button">Back</div>
      <h3 class="cardName">Card Name</h3>
      <div class="saveButton button green disabled">Save</div>
    </div>
    <div class="cardTree"></div>
    <div class="cardExperienceSection">
      <div class="cardExperienceBarBorder">
        <div class="cardExperienceBar"></div>
        <div class="cardExperienceNumber noselect">34452</div>
      </div>
      <div class="cardPerkPointsAvailable">
        <div class="cardPerkPoints noselect"></div>
      </div>
    </div>
    <div class="cardDescription">The card description will go here</div>
  </div>
  <div class="demoContainer">
    <div id="gameContainer"
      class="cardDemo"
      host="false"
      playerID="totg"
    >
      <div
        id="gameBoard"
        class="screen"
        style="display: none;"
      >
        <div id="missionActionDisplay"></div>
      </div>
      <div class="damageDealt noselect">
      </div>
      <div class="damageTaken noselect">
      </div>
    </div>
  </div>
</div>
<div class="deckControlSection hidden">
  <div class="deckToolbar">
    <div class="section active deckFilterSection clearfix">
      <?php foreach ($bouncy_user->decks as $deck) {?>
      <div
        class="button deckFilter"
        data-deck-id=<?php print_r($deck->id); ?>
      >
        <?php
        print_r($deck->name);
        ?>
      </div>
      <? } ?>
      <div class="button saveButton green disabled">Save</div>
    </div>
  </div>
  <div>
    <div class="cardsTitleSection">Your Cards</div>
    <div class="deckContentsTitleSection">Deck</div>
  </div>
  <div class="clearfix">
    <div class="cardsSection"> </div>
    <div class="deckContentsSection"> </div>
  </div>
  <div class="controls">
    Left Click to select card perks.<br>
    Shift + Left Click to add or remove a card from your deck
  </div>
</div>

<?php require_once('Bouncy/js_includes.php'); ?>
<?php
  $serialized_decks = addslashes(json_encode(array_map(
    function ($deck) use ($bouncy_user) {
      return $deck->serialize($bouncy_user);
    },
    PlayerDeck::getAllDecksForPlayer($bouncy_user)
  )));

  $serialized_cards = addslashes(json_encode(array_map(
    function ($card) {
      return $card->serialize();
    },
    $bouncy_user->getOwnedCards()
  )));
?>
<script src="/Bouncy/js/NEWdeckManager.js"></script>
<!--script src="/Bouncy/js/cardDemo.js"></script-->
<script>
let deckManager = new DeckManager(
  "<?php echo $serialized_decks; ?>",
  "<?php echo $serialized_cards; ?>"
);
</script>
