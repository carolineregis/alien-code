// cards array holds all cards
let card = document.getElementsByClassName("card");
let cards = [...card]

// deck of all cards in game
const deck = document.getElementById("card-deck");

// declaring move variable
let moves = 0;
let counter = document.querySelector(".moves");

// declare variables for star icons
const stars = document.querySelectorAll(".fa-star");

// declaring variable of matchedCards
let matchedCard = document.getElementsByClassName("match");

 // stars list
 let starsList = document.querySelectorAll(".stars li");

 // close icon in modal
 let closeicon = document.querySelector(".close");

 // declare modal
 let modal = document.getElementById("popup1")
 let modali = document.getElementById("popupi")


 // array for opened cards
var openedCards = [];
var first = true;

function hashCookie() {
  if (!(document.cookie.indexOf("id=") >= 0)) {
  var expires = "";
  var date = new Date();
  var name = prompt("Digite seu nome","");
  date.setTime(date.getTime() + (120 * 24 * 60 * 60 * 1000));
  expires = "; expires=" + date.toUTCString();
  document.cookie = "id=" + (Math.random().toString(36) || "") + expires + "; path=/";
  }
}

// @param {array}
// @returns shuffledarray
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

function my_shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};


// @description shuffles cards when page is refreshed / loads
document.body.onload = startGame();

// @description function to start a new play
function startGame(){
    hashCookie();

    $.getJSON("json/lpi.json", function(json) {
        let c = json.comandos;
        c = shuffle(c);
        for (var i = 1; i < 9; i++) {
            $('#command'+i).html(c[i-1]);
            $('#fun'+i).attr("data-popup",json.funcoes[c[i-1]]);
        }
    });

    // shuffle deck
    cards = shuffle(cards);
    // remove all exisiting classes from each card
    for (var i = 0; i < cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove("show", "open", "match", "disabled");
        // REMOVER ESSA LINHA
        //cards[i].classList.toggle("show");
    }
    // reset moves
    moves = 0;
    counter.innerHTML = moves;
    // reset rating
    for (var i= 0; i < stars.length; i++){
        stars[i].style.color = "#FFD700";
        stars[i].style.visibility = "visible";
    }
    //reset timer
    second = 0;
    minute = 0;
    hour = 0;
    var timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    clearInterval(interval);

    for (var i = 0; i < cards.length; i++){
        cards[i].classList.toggle("open");
        cards[i].classList.toggle("show");
        cards[i].classList.toggle("disabled");
    }

    setTimeout(function(){
        for (var i = 0; i < cards.length; i++){
            $(cards[i]).hideBalloon();
            cards[i].classList.remove("show", "open", "disabled");
        }
    },5000);

    $('html, body').animate({
        scrollTop: $("#main-panel").offset().top
    }, 500);

}


// @description toggles open and show class to display cards
var displayCard = function (){
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
    $(this).showBalloon({
    offsetY: -40,
    offsetX: -20,
    tipSize: 15,
    contents: $(this).data('popup'),
    css: {
        border: 'solid 4px #fff',
        padding: '10px',
        fontSize: '100%',
        fontWeight: 'bold',
        lineHeight: '1',
        backgroundColor: '#fff',
        color: '#000'
    }
    });
};

// @description add opened cards to OpenedCards list and check if cards are match or not
function cardOpen() {
    openedCards.push(this);
    var len = openedCards.length;
    if(len ===  2){
        moveCounter();
        if(openedCards[0].type === openedCards[1].type){
            matched();
        } else {
            unmatched();
        }
    }
};


// @description when cards match
function matched(){
    disable();
    openedCards.forEach(function apply(item) {
        item.classList.add("match", "disabled");
        item.classList.remove("show", "open", "no-event");
    });
    setTimeout(function(){
        openedCards.forEach(function apply(item) {
            $(item).hideBalloon();
        });
        openedCards = [];
        enable();
    },1300);
}


// description when cards don't match
function unmatched(){

    disable();
    openedCards.forEach(function apply(item) {
        item.classList.add("unmatched");
    });
    setTimeout(function(){
        openedCards.forEach(function apply(item) {
            item.classList.remove("show", "open", "no-event","unmatched");
            $(item).hideBalloon();
        });
        openedCards = [];
        enable();
    },1300);
}


// @description disable cards temporarily
function disable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.add('disabled');
    });
}


// @description enable cards and disable matched cards
function enable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.remove('disabled');
        for(var i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
}


// @description count player's moves
function moveCounter(){
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if(moves == 1){
        second = 0;
        minute = 0;
        hour = 0;
        startTimer();
    }
    // setting rates based on moves
    if (moves > 8 && moves < 12){
        for( i= 0; i < 3; i++){
            if(i > 1){
                stars[i].style.visibility = "collapse";
            }
        }
    }
    else if (moves > 13){
        for( i= 0; i < 3; i++){
            if(i > 0){
                stars[i].style.visibility = "collapse";
            }
        }
    }
}


// @description game timer
var second = 0, minute = 0; hour = 0;
var timer = document.querySelector(".timer");
var interval;
function startTimer(){
    interval = setInterval(function(){
        timer.innerHTML = minute+"mins "+second+"secs";
        second++;
        if(second == 60){
            minute++;
            second=0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}


// @description congratulations when all cards match, show modal and moves, time and rating
function congratulations(){
    if (matchedCard.length == 8){
        clearInterval(interval);
        finalTime = timer.innerHTML;

        // show congratulations modal
        modal.classList.add("show");

        // declare star rating variable
        var starRating = document.querySelector(".stars").innerHTML;

        //showing move, rating, time on modal
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("starRating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = finalTime;

        var datetime = new Date();
        $.ajax({
            type: 'POST',
            cache: false,
            url: './ajax/save_scores.php',
            data: 'datetime='+datetime.toString()+'&moves='+moves+'&time='+timer.innerHTML,
            success: function(msg) {

            }
        });
        //closeicon on modal
        closeModal();
    };
}

function startModali(){
    modali.classList.add("show");
    closeicon.addEventListener("click", function(e){
        modali.classList.remove("show");
        startGame();
    });
}

// @description close icon on modal
function closeModal(){
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
        startGame();
    });
}


// @desciption for user to play Again
function playAgain(){
    location.reload();
}

// loop to add event listeners to each card
for (var i = 0; i < cards.length; i++){
    card = cards[i];
    card.addEventListener("click", displayCard);
    card.addEventListener("click", cardOpen);
    card.addEventListener("click", congratulations);
};
