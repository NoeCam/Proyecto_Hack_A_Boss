"use strict";

const totalCards = 16;
let newCards = [];
let newValues = [];
let flippedCards = [];
let movesCounter = 0;
let playsCounter = 0;
let pointsCounter = 0;
let secondsCounter = 0;
let minCounter = 0;
let timerOnOff = false;
let resetTimer = false;
const emojis = {
  1: "😍",
  2: "😎",
  3: "😜",
  4: "😇",
  5: "😈",
  6: "😡",
  7: "😭",
  8: "🐱",
};
const puntuationPlaysPoints = {
  8: 800,
  9: 650,
  10: 650,
  11: 650,
  12: 650,
  13: 500,
  14: 500,
  15: 500,
  16: 500,
  17: 350,
  18: 350,
  19: 350,
  20: 350,
  21: 200,
};
const puntuationPlaysEmojis = {
  8: "Perfecto! &#x1F418",
  9: "Increíble &#x1F42C",
  10: "Increíble &#x1F42C",
  11: "Increíble &#x1F42C",
  12: "Increíble &#x1F42C",
  13: "Bien jugado &#x1F98A",
  14: "Bien jugado &#x1F98A",
  15: "Bien jugado &#x1F98A",
  16: "Bien jugado &#x1F98A",
  17: "Regular &#x1F413",
  18: "Regular &#x1F413",
  19: "Regular &#x1F413",
  20: "Regular &#x1F413",
  21: "Poca memoria... &#x1F997",
};
const puntuationTimePoints = {
  20: "250",
  40: "200",
  60: "150",
  80: "100",
  100: "50",
};
const puntuationTimeEmojis = {
  20: "Muy rápido &#x1F40E",
  40: "Rápido &#x1F407",
  60: "No está mal &#x1F43A",
  80: "Lento &#x1F9A5",
  100: "Acelera... &#x1F422",
};

const game = document.querySelector(".game");
const totalPlays = document.querySelector(".totalPlays");
const totalPoints = document.querySelector(".totalPoints");
const totalTime = document.querySelector(".totalTime");
const playAgainButton = document.querySelector(".playAgain");
const resetGameButton = document.querySelector(".resetGame");
const winData = document.querySelector(".winData");
const newCardTemplate = `<div class="card"><div class="cardBack"><img src="imgs/imageGris.png" alt="dorso de cartas con emojis"></div><div class="cardFront"></div></div>`;
const gameContainer = document.querySelector('.gameContainer');
const title1 = document.querySelector('.title1');
const title2 = document.querySelector('.title2');
const title3 = document.querySelector('.title3');
const getStorage = document.querySelector('.localStorage');

function printCards() {
  winData.style.display = "none";
  resetGameButton.removeAttribute("disabled");

  generateCards();
  linkEmojis();
  addListeners();
  memorize1sec();
}

function generateCards() {
  for (let i = 0; i < totalCards; i++) {
    const div = document.createElement("div");
    div.innerHTML = newCardTemplate;
    newCards.push(div);
    game.append(newCards[i]);

    generateValues();
    newCards[i].querySelector(".cardFront").textContent = newValues[i];
  }
}

function generateValues() {
  const randomValue = Math.floor((Math.random() * totalCards) / 2) + 1;
  let values = newValues.filter((value) => value === randomValue);

  if (values.length < 2) {
    newValues.push(randomValue);
  } else {
    generateValues();
  }
}

function linkEmojis() {
  const allCardFronts = document.querySelectorAll(".cardFront");

  allCardFronts.forEach((divCardFront) => {
    const textValue = divCardFront.innerHTML;
    divCardFront.innerHTML = `${emojis[textValue]}`;
  });
}

function addListeners() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => card.addEventListener("click", flipCard));

  playAgainButton.addEventListener("click", playAgain);
  resetGameButton.addEventListener("click", resetGame);
}

async function flipCard(e) {
  const currentCard = e.currentTarget;
  if (movesCounter == 0) {
    currentCard.classList.add("flipped");
    flippedCards.push(currentCard);
    movesCounter++;

    if (timerOnOff === false) {
      controlTimer();
    }
  }

  if (movesCounter == 1 && !currentCard.classList.contains("flipped")) {
    currentCard.classList.add("flipped");
    flippedCards.push(currentCard);
    movesCounter++;
  }

  if (movesCounter == 2) {
    playsCounter++;
    totalPlays.innerHTML = `${playsCounter}`;

    if (
      flippedCards[0].querySelector(".cardFront").innerHTML ==
      flippedCards[1].querySelector(".cardFront").innerHTML
    ) {
      flippedCards = [];
      movesCounter = 0;

      pointsInRealTime("success");

    } else {
      const allCards = document.querySelectorAll(".card");
      allCards.forEach(card => card.style.pointerEvents = "none"); 

      await setTimeout(() => {
        flippedCards.forEach(card => card.classList.remove("flipped"));
        flippedCards = [];
        movesCounter = 0;
        allCards.forEach(card => card.style.pointerEvents = "");
      }, 1000);

      await setTimeout(() => {
        pointsInRealTime();
      }, 100)
    }
  }

  const flippedCardList = document.querySelectorAll(".flipped");
  if (flippedCardList.length == totalCards) {
    recolectData();
  }
}

function playAgain() {
  newCards = [];
  newValues = [];
  flippedCards = [];
  movesCounter = 0;
  playsCounter = 0;
  secondsCounter = 0;
  minCounter = 0;
  pointsCounter = 0;

  const cardsToDelete = document.querySelectorAll(".game > div");
  cardsToDelete.forEach((card) => card.remove());

  totalPlays.innerHTML = "0";
  totalPoints.innerHTML = "0";
  totalTime.innerHTML = "00:00";

  printCards();
}

function resetGame() {
  newCards = [];
  newValues = [];
  flippedCards = [];
  movesCounter = 0;
  playsCounter = 0;
  secondsCounter = 0;
  minCounter = 0;
  pointsCounter = 0;
  resetTimer = true;

  const cardsToDelete = document.querySelectorAll(".game > div");
  cardsToDelete.forEach((card) => card.remove());

  totalPlays.innerHTML = "0";
  totalPoints.innerHTML = "0";
  totalTime.innerHTML = "00:00";

  printCards();
}

function controlTimer() {
  timerOnOff = true;

  const startTimer = setInterval(() => {
    if (secondsCounter === 59.5) {
      secondsCounter = 0;
      minCounter++;
    }

    secondsCounter += 0.5;

    if (secondsCounter <= 9.5) {
      totalTime.innerHTML = `0${minCounter}:0${Math.floor(secondsCounter)}`;
    } else {
      totalTime.innerHTML = `0${minCounter}:${Math.floor(secondsCounter)}`;
    }

    if (resetTimer === true || minCounter === 10) {
      clearInterval(startTimer);
      resetTimer = false;
      timerOnOff = false;
    }
  }, 500);
}

function memorize1sec() {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((card) => card.classList.add("flipped"));
  allCards.forEach(card => card.style.pointerEvents = "none");


  setTimeout(() => {
    allCards.forEach(card => card.classList.remove("flipped"));
  }, 1000);

  setTimeout(() => {
    allCards.forEach(card => card.style.pointerEvents = "");
  }, 1100);
}

function givePoints() {
  if (playsCounter >= 21) {
    return puntuationPlaysPoints[21];
  } else {
    return puntuationPlaysPoints[playsCounter];
  }
}

function setPlaysEmojis(){

  if (playsCounter >= 21) {
    return 21;
  } else {
    return playsCounter;
  }
}

function setTimePointsEmojis() {
  if (minCounter > 0) {
    return 100;
  } else if (secondsCounter <= 20) {
    return 20;
  } else if (secondsCounter <= 40) {
    return 40;
  } else if (secondsCounter <= 60) {
    return 60;
  } else if (secondsCounter <= 80) {
    return 80;
  }
}

function pointsInRealTime(playResult) {
  if (playResult === "success") {
    if (playsCounter <= 8) {
      pointsCounter += 50;
    }

    if (playsCounter > 8 && playsCounter <= 16) {
      pointsCounter += 25;
    }

    if (minCounter < 1) {
      if (secondsCounter <= 30) {
        pointsCounter += 20;
      } else {
        pointsCounter += 10;
      }
    }
  } else {
    if (playsCounter <= 8) {
      pointsCounter -= 5;
    }

    if (playsCounter > 8 && playsCounter <= 16) {
      pointsCounter -= 10;
    }

    if (minCounter < 1) {
      if (secondsCounter <= 30) {
        pointsCounter -= 5;
      } else {
        pointsCounter -= 10;
      }
    }
  }

  if (pointsCounter <= 0){
    pointsCounter = 0;
}
  totalPoints.innerHTML = `${pointsCounter}`;
}

function animatedTitle(){
  const titleArray = Array.from(title1.innerHTML + title2.innerHTML + title3.innerHTML);
  const newTitle = [];
  title1.innerHTML= '';
  title2.innerHTML= '';
  title3.innerHTML= '';
  titleArray.forEach((letter, index) => {
      const titleTemplate = `<div class="letter l${index}">${letter}</div>`;
      const titleSpan = document.createElement('div');
      titleSpan.innerHTML = titleTemplate;
      newTitle.push(titleSpan);
      if (index <= 6){
          title1.append(newTitle[index]);
      } else if (index > 6 && index <= 8){
          title2.append(newTitle[index]);
      } else {
          title3.append(newTitle[index]);
      };
  });
};

function recolectData() {
  resetTimer = true;
  resetGameButton.setAttribute("disabled", true);
  winData.style.display = "grid";

  const winTotalPlays = document.querySelector(".winTotalPlays");
  const totalPlaysEmoji = document.querySelector(".totalPlaysEmoji");
  const winTotalTime = document.querySelector(".winTotalTime");
  const totalTimeEmoji = document.querySelector(".totalTimeEmoji");
  const winTotalPoints = document.querySelector(".winTotalPoints");

  winTotalPlays.innerHTML = `Jugadas totales: ${playsCounter}`;
  totalPlaysEmoji.innerHTML = `${puntuationPlaysEmojis[setPlaysEmojis()]}`;
  if (secondsCounter <= 9.5){
    winTotalTime.innerHTML = `Tiempo total: 0${minCounter}:0${Math.floor(
      secondsCounter
    )}`;
  } else {
    winTotalTime.innerHTML = `Tiempo total: 0${minCounter}:${Math.floor(
      secondsCounter
    )}`;
  }
  totalTimeEmoji.innerHTML = `${puntuationTimeEmojis[setTimePointsEmojis()]}`;
  winTotalPoints.innerHTML = `Puntos obtenidos: ${
    Number(pointsCounter) +
    Number(givePoints()) +
    Number(puntuationTimePoints[setTimePointsEmojis()])
  }`;

  const totalScore = Number(pointsCounter) +
  Number(givePoints()) +
  Number(puntuationTimePoints[setTimePointsEmojis()]);
  const currentMaxScore = localStorage.getItem('maxScore');
  if (!currentMaxScore || totalScore > currentMaxScore) {
  localStorage.setItem('maxScore', totalScore);
  };

  getStorage.innerHTML = `Mejor puntuación: ${localStorage.getItem('maxScore')}`;
}

function startGame(){

  animatedTitle();

  gameContainer.style.opacity = 0;
  winData.style.opacity = 0;
  getStorage.style.opacity = 0;

  if (localStorage.getItem('maxScore')){
    getStorage.innerHTML = `Mejor puntuación: ${JSON.parse(localStorage.getItem('maxScore'))}`;
  } else {
    getStorage.innerHTML = 'Mejor puntuación: 0';
  }

  setTimeout(() => {
    gameContainer.style.opacity = 1;
    printCards()
    winData.style.opacity = 1;
    getStorage.style.opacity = 1;
  }, 2100);
};

startGame();













