'use strict';

const totalCards = 16;
let newCards = [];
let newValues = [];
let flippedCards = [];
let movesCounter = 0;
let playsCounter = 0;
const emojis = {
    1: '😍',
    2: '😎',
    3: '😜',
    4: '😱',
    5: '😈',
    6: '😡',
    7: '😭',
    8: '🐱',
};


const game = document.querySelector('.game');
const totalPlays = document.querySelector('.totalPlays');
const playAgainButton = document.querySelector('.playAgain');
const newCardTemplate = `<div class="card"><div class="cardBack">?</div><div class="cardFront"></div></div>`;

//! TODO => función general para la creación de cartas con sus eventos
//! TODO => lógica para tener 2 cartas con el mismo valor
//! TODO => lógica para la comprobación de valores
//! TODO => lógica para tener 2 cartas levantadas
function printCards(){

    playAgainButton.style.display = 'none';
    generateCards();
    linkEmojis();
    addListeners();
};

function generateCards(){

    for (let i = 0; i < totalCards; i++){

        const div = document.createElement('div');
        div.innerHTML = newCardTemplate;
        newCards.push(div);
        game.append(newCards[i]);

        generateValues();
        newCards[i].querySelector('.cardFront').textContent = newValues[i];
    };
};

function generateValues(){

    const randomValue = Math.floor(Math.random() * totalCards / 2) + 1;
    let values = newValues.filter(value => value === randomValue);

    if (values.length < 2){
        newValues.push(randomValue);
    } else {
        generateValues();
    };
};

// TODO => lógica para linkear los emojis a los valores
function linkEmojis(){

    const allCardFronts = document.querySelectorAll('.cardFront');

    allCardFronts.forEach(divCardFront => {
        const textValue = divCardFront.innerHTML;
        divCardFront.innerHTML = `${emojis[textValue]}`;

    });
};

function addListeners(){

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.addEventListener('click', flipCard));

    playAgainButton.addEventListener('click', playAgain);
};

function flipCard(e){

    const currentCard = e.currentTarget;

    if (movesCounter == 0){

        currentCard.classList.add('flipped');
        flippedCards.push(currentCard);
        movesCounter++;
    };

    if (movesCounter == 1 && !currentCard.classList.contains('flipped')){

        currentCard.classList.add('flipped');
        flippedCards.push(currentCard);
        movesCounter++;
    };

    if (movesCounter == 2){
                
        //! TODO => Intentos +1
        playsCounter++;
        totalPlays.innerHTML = `Total de jugadas: ${playsCounter}`;

        if (flippedCards[0].querySelector('.cardFront').innerHTML == flippedCards[1].querySelector('.cardFront').innerHTML){

            flippedCards = [];
            movesCounter = 0;
                    
        } else {

            setTimeout(() => {
                flippedCards.forEach(card => card.classList.remove('flipped'));
                flippedCards = [];
                movesCounter = 0;
            }, 1000);
        };
    };

    //! TODO => lógica para mostrar el botón ???? length flippedCards ????
    const flippedCardList = document.querySelectorAll('.flipped');
    if (flippedCardList.length == 16){
        playAgainButton.style.display = 'block';
    };
};

//! TODO => lógica para volver a jugar
function playAgain(){

    newCards = [];
    newValues = [];
    flippedCards = [];
    movesCounter = 0;
    playsCounter = 0;

    const cardsToDelete = document.querySelectorAll('.game > div');
    cardsToDelete.forEach(card => card.remove());

    playAgainButton.style.display = 'none';
    totalPlays.innerHTML = 'Total de jugadas: 0'

    printCards();
};

printCards();
