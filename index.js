/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for(let i = 0; i < games.length; i++) {
        // create a new div element, which will become the game card
        let gameCard = document.createElement('div');

        // add the class game-card to the list
        gameCard.classList.add('game-card');

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        gameCard.innerHTML = `<img src="${games[i].img}" class="game-img"/> <h3>${games[i].name}</h3> <p>${games[i].description}</p>`;

        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games

addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const contributions = GAMES_JSON.reduce ((acc, totalContributions) => {
    return acc + totalContributions.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = contributions.toLocaleString('en-US');

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const raised = GAMES_JSON.reduce ((acc, totalRaised) => {
    return acc + totalRaised.pledged;
}, 0)

// set inner HTML using template literal
raisedCard.innerHTML = "$" + raised.toLocaleString('en-US');

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const gameNum = GAMES_JSON.reduce ((acc, totalGames) => {
    return acc + 1;
}, 0)

gamesCard.innerHTML = gameNum.toLocaleString('en-US');

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unfundedGamesList = GAMES_JSON.filter ((game) => {
        return game.pledged < game.goal;
    });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGamesList);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fundedGamesList = GAMES_JSON.filter ((game) => {
        return game.pledged >= game.goal;
    });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGamesList);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let unfundedGamesList = GAMES_JSON.filter ((game) => {
    return game.pledged < game.goal;
});

let unfundedGamesRemainingTotal = unfundedGamesList.reduce ((acc, totalRaised) => {
    return acc + totalRaised.pledged;
}, 0);

let unfundedRemaining = GAMES_JSON.length - unfundedGamesList.length;
let totalFundGoal = GAMES_JSON.reduce ((acc, totalGoal) => {
    return acc + totalGoal.goal;
}, 0);

// create a string that explains the number of unfunded games using the ternary operator
let isUnfunded = unfundedRemaining == 1 
    ? `A total of $${raised.toLocaleString('en-US')} has been raised for ${gameNum.toLocaleString('en-US')} games. While the total goal of $${totalFundGoal.toLocaleString('en-US')} is surpassed, there is currently ${unfundedRemaining} game unfunded and it needs $${unfundedGamesRemainingTotal.toLocaleString('en-US')} to reach it's goal.` 
    : `A total of $${raised.toLocaleString('en-US')} has been raised for ${gameNum.toLocaleString('en-US')} games. While the total goal of $${totalFundGoal.toLocaleString('en-US')} is surpassed, there are currently ${unfundedRemaining} games unfunded and they need $${unfundedGamesRemainingTotal.toLocaleString('en-US')} to reach their goals.`;

// create a new DOM element containing the template string and append it to the description container
let companyDescription = document.createElement('p');
companyDescription.innerHTML = isUnfunded;
descriptionContainer.appendChild(companyDescription);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...restOfGames] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
let topFunded = document.createElement('p');
topFunded.innerHTML = `${firstGame.name}`;
firstGameContainer.appendChild(topFunded);

// do the same for the runner up item
let secondFunded = document.createElement('p');
secondFunded.innerHTML = `${secondGame.name}`;
secondGameContainer.appendChild(secondFunded);

/************************************************************************************
 * Expand card information on click
 */

const targetGames = document.querySelectorAll(".game-card");

const originalContent = [];
targetGames.forEach((game) => {
    originalContent.push(game.innerHTML);
});

gamesContainer.addEventListener("click", function (event) {
    targetGames.forEach((targetGame, i) => {
        const targetGameActive = targetGame.contains(event.target);

        if (targetGameActive) {
            let activeCard = `<div class="moreInfo"> <h3>Pledged:</h3> <p>$${GAMES_JSON[i].pledged}</p> </div> 
                            <div class="moreInfo"> <h3>Goal:</h3> <p>$${GAMES_JSON[i].goal}</p> </div>
                            <div class="moreInfo"> <h3>Contributions:</h3> <p>${GAMES_JSON[i].backers}</p> </div>`;
        
            let cardMoreInfo = document.createElement('div');
            cardMoreInfo.classList.add("active-info");
            cardMoreInfo.innerHTML = activeCard;

            if (!targetGame.querySelector(".active-info")) {
                targetGame.appendChild(cardMoreInfo);
            };

            targetGame.classList.add("active");
        } else {
            const activeInfo = targetGame.querySelector(".active-info");
            if (activeInfo) {
                activeInfo.remove();
            }
            targetGame.classList.remove("active");
        };
    });
});