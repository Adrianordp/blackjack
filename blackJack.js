function shuffle(array) { // Deck shuffling function
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random()*currentIndex);
    currentIndex -= 1;
    
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function submit_bankroll() {
    if(event.key === 'Enter') {
      document.getElementById('bankroll').innerHTML = "Bankroll: "+document.getElementById('bankroll-input').value; 
  }
}

function submit_bet() {
  if(event.key === 'Enter') {
      document.getElementById('current-bet').innerHTML = "Current bet: "+document.getElementById('current-bet-input').value;
  }
}

function start_game(){
  playerHand.numberOfCards = 0;
  Flag.running   = 1;
  Flag.surrender = 0;
  Flag.double    = 0;

  Bet.surrender = 0;
  Bet.blackJack = 0;
  Bet.double = 0;

  Sum.dealer = 0;
  Sum.player = 0;
  Sum.dealerSoft = 0;
  Sum.playerSoft = 0;
  Flag.dealerSoft = 0;
  Flag.playerSoft = 0;
  bankroll -= Bet.current;
  document.getElementById('bankroll').innerHTML = "Bankroll: "+bankroll;
  document.getElementById('current-bet').innerHTML = "Current bet: "+Bet.current;
  document.getElementById('player-cards').innerHTML = '';
  document.getElementById('dealer-cards').innerHTML = '';

  hit_card_dealer();
  hit_card();
  hit_hidden_card_dealer();
  hit_card();

  var secretDealerCount = Sum.dealerSoft+cardPile[Index.hidden].value;
  if (secretDealerCount == 11 && cardPile[Index.hidden].value) {
    secretDealerCount == 21;
  } 

  if (Sum.playerSoft == 21 && secretDealerCount == 21) {
    flip_hidden_card(Index.hidden);
    document.getElementById('player-sum').innerHTML = ' Black Jack!';
    document.getElementById('dealer-sum').innerHTML = ' Black Jack!';
    draw_game();
  }
  else if (Sum.playerSoft == 21) {
    flip_hidden_card(Index.hidden);
    document.getElementById('player-sum').innerHTML = ' Black Jack!';
    Bet.blackJack = Bet.current*.5;
    player_win();
  }
  else if (secretDealerCount == 21) {
    flip_hidden_card(Index.hidden);
    document.getElementById('dealer-sum').innerHTML = ' Black Jack!';
    player_lose();
  }

  if (cardPile[Index.top-1].value == cardPile[Index.top-3].value) {
    Flag.split = 1;
  }
  else {
    Flag.split = 0;
  }

  if (Flag.split) {
    document.getElementById('split-button').style.display = 'none';
  }
}

// Draw a card from the deck
function hit_card() {
  if (Flag.running) {
    document.getElementById('drawed-card').innerHTML += '<li><figure><img src="images/'+cardPile[Index.top].image+'.png"></figure></li>';
    document.getElementById('player-cards').innerHTML += '<li><figure><img src="images/'+cardPile[Index.top].image+'.png"></figure></li>';
    highLoCount += cardPile[Index.top].hl;
    Sum.player   += cardPile[Index.top].value;
  
    if (Sum.player <= 21) {
      document.getElementById('player-sum').innerHTML = Sum.player;
    }
    else {
      document.getElementById('player-sum').innerHTML = Sum.player + ' Bust!';
      player_bust();
    }
    document.getElementById('running-count').innerHTML = highLoCount;
  
    Flag.playerSoft = softCheck(Index.top,'player',Flag.playerSoft);
  
    ++playerHand.numberOfCards;
    if (playerHand.numberOfCards == 2) {
      Flag.surrender = 1;
      Flag.double    = 1;
    }
    else{
      Flag.surrender = 0;
      Flag.double    = 0;
    }
    ++Index.top;
  }
  else{
    console.log('Start a game first!');
  }
}
  
function stand_hand() {
  if (Flag.running) {
    flip_hidden_card(Index.hidden);
    while (Sum.dealer <= 16) {
      hit_card_dealer()
    }
    if (Sum.dealer <= 21) {
      dealer_stand();
    }
    else {
      document.getElementById('dealer-sum').innerHTML += ' Bust!';
      player_win();
    }
  }
}
    
function double_bet() {
  if (Flag.running && Flag.double) {
    Bet.double = Bet.current;
    hit_card();
    stand_hand();
  }
}

function surrender_hand() {
  if (Flag.running && Flag.surrender) {
    flip_hidden_card(Index.hidden);
    Bet.surrender = Bet.current*.5;
    player_lose();
  }
}

function split_hand() {
  if (Flag.running && Flag.split) {
    document.getElementById('bankroll').innerHTML = "split";
  }
}

function hit_card_dealer(){
  document.getElementById('drawed-card').innerHTML += '<li><figure><img src="images/'+cardPile[Index.top].image+'.png"></figure></li>';
  document.getElementById('dealer-cards').innerHTML += '<li><figure><img src="images/'+cardPile[Index.top].image+'.png"></figure></li>';
  
  highLoCount += cardPile[Index.top].hl;
  document.getElementById('running-count').innerHTML = highLoCount;

  Sum.dealer   += cardPile[Index.top].value;
  document.getElementById('dealer-sum').innerHTML = Sum.dealer;

  Flag.dealerSoft = softCheck(Index.top,'dealer',Flag.dealerSoft);

  ++Index.top;
}

function softCheck(index,role,softFlag) {
  if (softFlag) {
    if (role === 'dealer') {
      Sum.dealerSoft = Sum.dealer+10;
      document.getElementById('dealer-sum').innerHTML = Sum.dealer+'/'+Sum.dealerSoft;
      return 1;
    }
    else if (role === 'player') {
      Sum.playerSoft = Sum.player+10;
      document.getElementById('player-sum').innerHTML = Sum.player+'/'+Sum.playerSoft;
      return 1;
    }
    else {
      alert("Invalid role parameter @ function softChech(index,'role',softFlag)")
    }
  }
  if (cardPile[index].value == 1) {
    if (role === 'dealer') {
      Flag.dealerSoft = 1;
      Sum.dealerSoft = Sum.dealer+10;
      document.getElementById('dealer-sum').innerHTML = Sum.dealer+'/'+Sum.dealerSoft;
      return Flag.dealerSoft;
    }
    else if (role === 'player') {
      Flag.playerSoft = 1;
      Sum.playerSoft = Sum.player+10;
      document.getElementById('player-sum').innerHTML = Sum.player+'/'+Sum.playerSoft;
      return Flag.playerSoft;
    }
    else {
      alert("Invalid role parameter @ function softChech(index,'role',softFlag)")
    }
  }
}

function dealer_play(){
  highLoCount += cardPile[Index.top].hl;
  document.getElementById('running-count').innerHTML = highLoCount;
  console.log(cardPile[Index.top].name+cardPile[Index.top].suit);
  if (Sum.dealer < 17) {
    hit_card_dealer();
  }
  else if (Sum.dealer < 21) {
    dealer_stand();
  }
  else if (Sum.dealer == 21){
    player_lose();
  }
  else {
    player_win();
    document.getElementById('dealer-sum').innerHTML += ' Bust!';
  }

  ++Index.top;
}

function hit_hidden_card_dealer(){
  Index.hidden = Index.top;
  document.getElementById('drawed-card').innerHTML += '<li><figure class="hidden"><img src="images/'+cardPile[Index.top].back+'.png"></figure></li>';
  document.getElementById('dealer-cards').innerHTML += '<li><figure class="hidden"><img src="images/'+cardPile[Index.top].back+'.png"></figure></li>';
  highLoCount += cardPile[Index.top].hl;
  document.getElementById('running-count').innerHTML = highLoCount;

  Index.top += 1;
}

function player_bust() {
  flip_hidden_card(Index.hidden);
  player_lose();
}

function flip_hidden_card(hiddenIndex) {
  document.getElementsByClassName('hidden')[0].innerHTML = '<img src="images/'+cardPile[hiddenIndex].image+'.png">'
  document.getElementsByClassName('hidden')[1].innerHTML = '<img src="images/'+cardPile[hiddenIndex].image+'.png">'
  Sum.dealer   += cardPile[hiddenIndex].value;
  document.getElementById('dealer-sum').innerHTML = Sum.dealer;

  Flag.dealerSoft = softCheck(hiddenIndex,'dealer',Flag.dealerSoft);
}

function dealer_stand() {
  if (Sum.dealer < Sum.player) player_win();
  else if (Sum.dealer > Sum.player) player_lose()
  else draw_game();
}

function player_win() {
  Flag.running = 0;

  console.log('player win '+bankroll+' '+2*Bet.current+' '+Bet.double+' '+Bet.blackJack);
  console.log('dealer lose');
  bankroll += 2*Bet.current+Bet.double+Bet.blackJack;
  document.getElementById('bankroll').innerHTML = "Bankroll: "+bankroll;
}

function player_lose() {
  Flag.running = 0;

  console.log('player lose '+bankroll+' '+Bet.current+' '+Bet.double+' '+Bet.surrender);
  console.log('dealer win');
  bankroll += Bet.surrender - Bet.double;
  document.getElementById('bankroll').innerHTML = "Bankroll: "+bankroll; 
}

function draw_game() {
  console.log('draw!');
  bankroll += Bet.current;
  document.getElementById('bankroll').innerHTML = "Bankroll: "+bankroll;
}

var Flag = {
  dealerSoft: 0,
  playerSoft: 0,
  running:    0,
  split:      0,
  surrender:  0,
}

var Sum = {
  player: 0,
  playerSoft: 0,
  dealer: 0,
  dealerSoft: 0,
}

var Bet = {
  current: 100,
  surrender: 0,
  double: 0,
}

var playerHand = {
  numberOfCards: 0
}

class Card {
  constructor(name, value, suit, hl, image) {
    this.name = name;
    this.suit = suit;
    this.value = value;
    this.hl = hl;
    this.image = image;
  }
}

Card.prototype.back = 'back_blue';

// Card declaration
  var aceSpades   = new Card("ace",   1,"spades",-1,'AS');
  var twoSpades   = new Card("two",   2,"spades", 1,'2S');
  var threeSpades = new Card("three", 3,"spades", 1,'3S');
  var fourSpades  = new Card("four",  4,"spades", 1,'4S');
  var fiveSpades  = new Card("five",  5,"spades", 1,'5S');
  var sixSpades   = new Card("six",   6,"spades", 1,'6S');
  var sevenSpades = new Card("seven", 7,"spades", 0,'7S');
  var eightSpades = new Card("eight", 8,"spades", 0,'8S');
  var nineSpades  = new Card("nine",  9,"spades", 0,'9S');
  var tenSpades   = new Card("ten",  10,"spades",-1,'10S');
  var jackSpades  = new Card("jack", 10,"spades",-1,'JS');
  var queenSpades = new Card("queen",10,"spades",-1,'QS');
  var kingSpades  = new Card("king", 10,"spades",-1,'KS');

  var aceClubs   = new Card("ace",   1,"clubs",-1,'AC');
  var twoClubs   = new Card("two",   2,"clubs", 1,'2C');
  var threeClubs = new Card("three", 3,"clubs", 1,'3C');
  var fourClubs  = new Card("four",  4,"clubs", 1,'4C');
  var fiveClubs  = new Card("five",  5,"clubs", 1,'5C');
  var sixClubs   = new Card("six",   6,"clubs", 1,'6C');
  var sevenClubs = new Card("seven", 7,"clubs", 0,'7C');
  var eightClubs = new Card("eight", 8,"clubs", 0,'8C');
  var nineClubs  = new Card("nine",  9,"clubs", 0,'9C');
  var tenClubs   = new Card("ten",  10,"clubs",-1,'10C');
  var jackClubs  = new Card("jack", 10,"clubs",-1,'JC');
  var queenClubs = new Card("queen",10,"clubs",-1,'QC');
  var kingClubs  = new Card("king", 10,"clubs",-1,'KC');

  var aceHearts   = new Card("ace",   1,"hearts",-1,'AH');
  var twoHearts   = new Card("two",   2,"hearts", 1,'2H');
  var threeHearts = new Card("three", 3,"hearts", 1,'3H');
  var fourHearts  = new Card("four",  4,"hearts", 1,'4H');
  var fiveHearts  = new Card("five",  5,"hearts", 1,'5H');
  var sixHearts   = new Card("six",   6,"hearts", 1,'6H');
  var sevenHearts = new Card("seven", 7,"hearts", 0,'7H');
  var eightHearts = new Card("eight", 8,"hearts", 0,'8H');
  var nineHearts  = new Card("nine",  9,"hearts", 0,'9H');
  var tenHearts   = new Card("ten",  10,"hearts",-1,'10H');
  var jackHearts  = new Card("jack", 10,"hearts",-1,'JH');
  var queenHearts = new Card("queen",10,"hearts",-1,'QH');
  var kingHearts  = new Card("king", 10,"hearts",-1,'KH');

  var aceDiamonds   = new Card("ace",   1,"diamonds",-1,'AD');
  var twoDiamonds   = new Card("two",   2,"diamonds", 1,'2D');
  var threeDiamonds = new Card("three", 3,"diamonds", 1,'3D');
  var fourDiamonds  = new Card("four",  4,"diamonds", 1,'4D');
  var fiveDiamonds  = new Card("five",  5,"diamonds", 1,'5D');
  var sixDiamonds   = new Card("six",   6,"diamonds", 1,'6D');
  var sevenDiamonds = new Card("seven", 7,"diamonds", 0,'7D');
  var eightDiamonds = new Card("eight", 8,"diamonds", 0,'8D');
  var nineDiamonds  = new Card("nine",  9,"diamonds", 0,'9D');
  var tenDiamonds   = new Card("ten",  10,"diamonds",-1,'10D');
  var jackDiamonds  = new Card("jack", 10,"diamonds",-1,'JD');
  var queenDiamonds = new Card("queen",10,"diamonds",-1,'QD');
  var kingDiamonds  = new Card("king", 10,"diamonds",-1,'KD');


var deck = [ // First deck declaration
  aceSpades, twoSpades, threeSpades, fourSpades,fiveSpades,
  sixSpades, sevenSpades,eightSpades,nineSpades,tenSpades,
  jackSpades, queenSpades, kingSpades,
  aceClubs, twoClubs, threeClubs, fourClubs,fiveClubs,
  sixClubs, sevenClubs,eightClubs,nineClubs,tenClubs,
  jackClubs, queenClubs, kingClubs,
  aceHearts, twoHearts, threeHearts, fourHearts,fiveHearts,
  sixHearts, sevenHearts,eightHearts,nineHearts,tenHearts,
  jackHearts, queenHearts, kingHearts,
  aceDiamonds, twoDiamonds, threeDiamonds, fourDiamonds,fiveDiamonds,
  sixDiamonds, sevenDiamonds,eightDiamonds,nineDiamonds,tenDiamonds,
  jackDiamonds, queenDiamonds, kingDiamonds
]

var cardPile = deck;
var numberOfDecks = 2;
if (numberOfDecks <= 0) {
  alert("Number of decks must be greater than zero!")
}
for (let i = 2; i <= numberOfDecks; i++) {
  cardPile = cardPile.concat(deck);
};

var cardPile = shuffle(cardPile);


var bankroll       = 50000;
var highLoCount  = 0;
var Index = {
  hidden: 0,
  top   : 0,
}

// cardPile[1] = aceClubs;
// cardPile[3] = kingClubs;
// cardPile[0] = aceHearts;
// cardPile[2] = kingSpades;