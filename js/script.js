var cardGame = {};

// Store important elements in variables for later manipulation
cardGame.playerCards = document.getElementById('playerCards');
cardGame.dealerCards = document.getElementById('dealerCards');
cardGame.hitButton = document.getElementById('hit');
cardGame.stayButton = document.getElementById('stay');
cardGame.playButton = document.getElementById('play');
cardGame.textUpdates = document.getElementById('textUpdates');
cardGame.buttonBox = document.getElementById('buttonBox');
cardGame.playerHandText = document.getElementById('playerHand');
cardGame.dealerHandText = document.getElementById('dealerHand');
cardGame.tracker = document.getElementById('tracker');
cardGame.newGame = document.getElementById('newGame');
cardGame.choice = document.getElementById('choice');

// initialize variables to track hands/cards/etc.
cardGame.pHand = [];
cardGame.dHand = [];
cardGame.deck = [];
cardGame.suits = ['♧ ', '◇', '♡', '♤'];
cardGame.values = ["Т", "2", "3", "4", "5", "6", "7", "8", "9", "10", "В", "Д", "К"];
cardGame.gameStatus = 0; 
cardGame.wins = 0; 
cardGame.draws = 0; 
cardGame.losses = 0; 
cardGame.games = 0;

// Object Constructor for a card. !!! ALWAYS USE NEW WHEN MAKING A NEW CARD!!!
function card(suit, value, name) {
    this.suit = suit; 
    this.value = value;
    this.name = name;
};


var newGame = function () {
    cardGame.newGame.classList.add("hidden");
    
    cardGame.dealerCards.innerHTML = "";
    cardGame.dealerCards.innerHTML = "";
    cardGame.pHand = [];
    cardGame.dHand = [];
    cardGame.gameStatus = 0;

    cardGame.deck = createDeck();


    cardGame.pHand.push(cardGame.deck.pop());
    cardGame.pHand.push(cardGame.deck.pop());

    // check for player victory
    if (handTotal(cardGame.pHand) === 21)
    {
        cardGame.wins += 1;
        cardGame.games += 1;        
        cardGame.gameStatus = 1; 
        drawHands();
        cardGame.textUpdates.innerHTML = "Win! 21 С раздачи!";
        track();
        cardGame.gameStatus = 2;
        return;
    }

    cardGame.dHand.push(cardGame.deck.pop());
    cardGame.dHand.push(cardGame.deck.pop());
   
    if (handTotal(cardGame.dHand) === 21)
    {
        cardGame.games += 1;
        cardGame.losses += 1;
        cardGame.gameStatus = 1;
        drawHands();
        cardGame.textUpdates.innerHTML = "Lose! У соперника 21 с раздачи";
        track();
        cardGame.gameStatus = 2; 
        return;
    }

    drawHands();
    advise();
    cardGame.buttonBox.classList.remove("hidden");
    cardGame.textUpdates.innerHTML = "The end!";
    
};

var createDeck = function () {
    var deck = [];
    for (var a = 0; a < cardGame.suits.length; a++) {
        for (var b = 0; b < cardGame.values.length; b++) {
            var cardValue = b + 1;
            var cardTitle = "";            
            if (cardValue > 10){
                cardValue = 10;
            }
            if (cardValue != 1) {
                cardTitle += (cardGame.values[b] + cardGame.suits[a] + " (" + cardValue + ")");
            }
            else
            {
                cardTitle += (cardGame.values[b] + cardGame.suits[a] + " (" + cardValue + " или 11)");
            }
            var newCard = new card(cardGame.suits[a], cardValue, cardTitle);
            deck.push(newCard);
            

        }
    }
    deck = shuffle(deck);
    return deck;
};

var drawHands = function () {    
    var htmlswap = "";
    var ptotal = handTotal(cardGame.pHand);
    var dtotal = handTotal(cardGame.dHand);
    htmlswap += "<ul>";
    for (var i = 0; i < cardGame.pHand.length; i++)
    {
        htmlswap += "<li>" + cardGame.pHand[i].name + "</li>";
    }
    htmlswap += "</ul>"
    cardGame.playerCards.innerHTML = htmlswap;
    cardGame.playerHandText.innerHTML = "Your cards (" + ptotal + ")";
    if (cardGame.dHand.length == 0)
    {
        return;
    }

    htmlswap = "";
    if (cardGame.gameStatus === 0)
    {
        htmlswap += "<ul><li>[Hidden card]</li>";
        cardGame.dealerHandText.innerHTML = "Opponent cards " + cardGame.dHand[1].value + " + hidden)"; 
    }
    else
    {
        cardGame.dealerHandText.innerHTML = "Opponent cards (" + dtotal + ")"; 
    }
    
    for (var i = 0; i < cardGame.dHand.length; i++) {
        if (cardGame.gameStatus === 0)
        {
            i += 1;
        }
        htmlswap += "<li>" + cardGame.dHand[i].name + "</li>";
    }
    htmlswap += "</ul>"
    cardGame.dealerCards.innerHTML = htmlswap;
};

var handTotal = function (hand) {
    var total = 0;
    var aceFlag = 0;
    for (var i = 0; i < hand.length; i++) {
        total += hand[i].value;
        if (hand[i].value == 1)
        {
            aceFlag += 1;
        }
    }
    for (var j = 0; j < aceFlag; j++)
    {
        if (total + 10 <= 21)
        {
            total +=10;
        }
    }
    return total;
}

var shuffle = function (deck) {
    var shuffledDeck = [];
    var deckL = deck.length;
    for (var a = 0; a < deckL; a++)
    {
        var randomCard = getRandomInt(0, (deck.length));        
        shuffledDeck.push(deck[randomCard]);
        deck.splice(randomCard, 1);        
    }
    return shuffledDeck;
}

var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


var deckPrinter = function (deck) {
    for (var i = 0; i < deck.length; i++)
    {
        console.log(deck[i].name);
    }
    return
}

cardGame.playButton.addEventListener("click", newGame);

cardGame.hitButton.addEventListener("click", function () {
    if (cardGame.gameStatus === 2)
    {
        console.log("Нажатo \"беру\"когда игра была окончена или уже нажата.");
        return;
    }

    cardGame.pHand.push(cardGame.deck.pop());
    drawHands();
   

    var handVal = handTotal(cardGame.pHand);
    if (handVal > 21)
    {
        bust();
        advise();
        return;
    }
    else if (handVal === 21)
    {
        victory();
        advise();
        return;
    }
    advise();
    cardGame.textUpdates.innerHTML = "New card?</p>";
    return;      
});

cardGame.stayButton.addEventListener("click", function stayLoop() {
    if (cardGame.gameStatus === 2)
    {
        console.log("Нажатo \"хорош\"когда игра была окончена или уже нажата.");
        return;
    }
    else if (cardGame.gameStatus === 0) 
    {
        
        cardGame.buttonBox.classList.add("hidden");
        var handVal = handTotal(cardGame.dHand);
        cardGame.gameStatus = 1;
        advise(); 
        cardGame.textUpdates.innerHTML = "All opponent cards";
        drawHands();
        setTimeout(stayLoop, 750);
    }
    else if (cardGame.gameStatus === 1) {    

    var handVal = handTotal(cardGame.dHand);
    if (handVal > 16 && handVal <= 21) 
    {
        drawHands();
        var playerVal = handTotal(cardGame.pHand);
        if (playerVal > handVal)
        {            
            victory();
            return;
        }
        else if (playerVal < handVal)
        {            
            bust();
            return;
        }
        else
        {            
            tie();
            return;
        }
    }
    if (handVal > 21)
    {
        victory();
        return;
    }
    else // hit
    {
        cardGame.textUpdates.innerHTML = "+ card to your opponent";
        cardGame.dHand.push(cardGame.deck.pop());
        drawHands();
        setTimeout(stayLoop, 750);
        return;
    }   
    }
});

var victory = function () {
    cardGame.wins += 1;
    cardGame.games += 1;
    var explanation = "";
    cardGame.gameStatus = 2; // flag that the game is over
    var playerTotal = handTotal(cardGame.pHand);
    var dealerTotal = handTotal(cardGame.dHand);
    if (playerTotal === 21)
    {
        explanation = "У тебя 21 с раздачи!";
    }
    else if (dealerTotal > 21)
    {
        explanation = "Opponent lose whis score: " + dealerTotal + "!";
    }
    else
    {
        explanation = "You: " + playerTotal + " and Opponent: " + dealerTotal + ".";
    }
    cardGame.textUpdates.innerHTML = "You win!<br>" + explanation;
    track();
}

var bust = function () {
    cardGame.games += 1;
    cardGame.losses += 1;
    var explanation = "";
    cardGame.gameStatus = 2;
    var playerTotal = handTotal(cardGame.pHand);
    var dealerTotal = handTotal(cardGame.dHand);
    if (playerTotal > 21)
    {
        explanation = "You lose your score: " + playerTotal + ".";
    }
    cardGame.textUpdates.innerHTML = "You lose:(.<br>" + explanation;
    track();
}

var tie = function () {    
    cardGame.games += 1;
    cardGame.draws += 1;
    var explanation = "";
    cardGame.gameStatus = 2;
    var playerTotal = handTotal(cardGame.pHand);
    cardGame.textUpdates.innerHTML = "Draw, you all have: " + playerTotal;
    track();
}

var track = function () {
    cardGame.tracker.innerHTML = "<p>|Win: " + cardGame.wins + "| Draw: " + cardGame.draws + "| Defeat: " + cardGame.losses + "|"+"</p>";
    cardGame.newGame.classList.remove("hidden");
    cardGame.buttonBox.classList.add("hidden");
}

var softCheck = function (hand) {    
    var total = 0;
    var aceFlag = 0;
    for (var i = 0; i < hand.length; i++) {
        total += hand[i].value;
        if (hand[i].value == 1) {
            aceFlag += 1;
        }
    }

    for (var j = 0; j < aceFlag; j++) {
        if (total + 10 <= 21) {
            return true;
        }
    }    
    return false;
}

var advise = function () {
    if (cardGame.gameStatus > 0)
    {
        cardGame.choice.innerHTML = "";
        return;
    } 
    var playerTotal = handTotal(cardGame.pHand);
    var soft = softCheck(cardGame.pHand);
    console.log("Soft: " + soft);
    var dealerUp = cardGame.dHand[1].value;

    if (dealerUp === 1)
    {
        dealerUp = 11;
    }

    return;
}