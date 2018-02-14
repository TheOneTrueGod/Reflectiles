<?php

?>
<link rel="stylesheet" type="text/css" href="/Bouncy/style/style.css">
<link rel="stylesheet" type="text/css" href="/Bouncy/style/deckbuilderstyle.css">
<link rel="stylesheet" type="text/css" href="/Bouncy/style/cardmanagerstyle.css">
<div class="pageBorder">
  <div class="titleArea">
    <div class="backLink"><a href="/">&lt; Game Selector</a></div>
    <h2> Reflectiles Deck Manager </h2>
    <a href="<?php echo BouncyUserController::getURLPath()?>" class="username">
      <?php echo $user->getUserName(); ?>
    </a>
    <div
      id="loadingContainer"
      class="screen"
    >
      <div class="loadingScreen">
        Loading
      </div>
    </div>
    <div class="cardControlSection hidden">
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
          <div class="cardPerkPoints"></div>
        </div>
      </div>
      <div class="cardDescription">The card description will go here</div>
    </div>
    <div class="deckControlSection hidden">
      <div>
        <div class="cardsTitleSection">Your Cards</div>
        <div class="deckContentsTitleSection">Deck</div>
      </div>
      <div class="clearfix">
        <div class="cardsSection"> </div>
        <div class="deckContentsSection"> </div>
      </div>
      <div class="deckToolbar">
        <div class="section tools clearfix active">
          <div class="button chooseDeckButton">Choose Deck</div>
          <span class="deckName"></span>
          <div class="button saveButton green disabled">Save</div>
        </div>
        <div class="section deckFilterSection clearfix">
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
        </div>
      </div>
    </div>
  </div>
</div>

<?php require('Bouncy/js_includes.html'); ?>
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
<script src="/Bouncy/js/deckManager.js"></script>
<script src="/Bouncy/js/cardManager.js"></script>
<script>
let deckManager = new DeckManager(
  "<?php echo $serialized_decks; ?>",
  "<?php echo $serialized_cards; ?>",
  new CardManager()
);

// TODO: DELETE ME
//$(".deckControlSection .cardsSection .abilityCard").first().click();
</script>
