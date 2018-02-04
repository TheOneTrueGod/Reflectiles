<?php

?>
<link rel="stylesheet" type="text/css" href="/Bouncy/style/style.css">
<link rel="stylesheet" type="text/css" href="/Bouncy/style/deckbuilderstyle.css">

<div class="pageBorder">
  <div class="titleArea">
    <div class="backLink"><a href="/">&lt; Back</a></div>
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
<script>
let deckManager = new DeckManager(
  "<?php echo $serialized_decks; ?>",
  "<?php echo $serialized_cards; ?>",
);
</script>
