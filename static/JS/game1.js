import bundesliga from "../data/bundes.json" assert { type: "json" };
import premierLeague from "../data/premier.json" assert { type: "json" };
import ligue1 from "../data/ligue1.json" assert { type: "json" };
import serieA from "../data/seria.json" assert { type: "json" };
import laLiga from "../data/liga.json" assert { type: "json" };

const searchInput = document.querySelector(".searchInput");
const input = searchInput.querySelector("input");
const resultBox = searchInput.querySelector(".resultBox");

const allData = laLiga.concat( // Concatenate all the data in one array
  bundesliga,
  premierLeague,
  ligue1,
  serieA,
);


let playerArray = [];

for (let j = 0; j < allData.length; j++) { // Load all the players in the playerArray
  for (let i = 0; i < allData[j].players.length; i++) {
    if (playerArray.includes(allData[j].players[i])) {
      continue;
    } else if (isValide(allData[j].players[i], allData[j])) {
      playerArray.push(allData[j].players[i].player_name);
    }
  }
}

let result = randomPlayer(); // Choose a random player
let playerToGuess = result.player;
let playerTeamToGuess = result.team;
let turn = 0;

input.onkeyup = (e) => {
  let userData = e.target.value; 
  let emptyArray = [];
  if (userData) { // Check if the user has entered something
    emptyArray = playerArray.filter((data) => {
      return data.toLocaleLowerCase().includes(userData.toLocaleLowerCase());
    });
    emptyArray = emptyArray.map((data) => {
      return data = "<li>" + data + "</li>";
    });
    searchInput.classList.add("active");
    showSuggestions(emptyArray); // Display the results of the search
    let allList = resultBox.querySelectorAll("li");
    for (let i = 0; i < allList.length; i++) {
      allList[i].addEventListener("click", function () { // Add an event listener on each result
        input.value = this.innerText; // Add the result in the input
        searchInput.classList.remove("active");
        let playerTeam = allData.find((x) =>
          x.players.some((y) => y.player_name === input.value)
        );
        let player = playerTeam.players.find((x) =>
          x.player_name === input.value
        );
        turn = testplayer( // Test the player
          player,
          playerTeam,
          playerToGuess,
          playerTeamToGuess,
          turn,
        );
      });
    }
  } else {
    searchInput.classList.remove("active");
  }
};

function showSuggestions(list) { // Display the results of the search
  let listData;
  if (!list.length) {
    userValue = inputBox.value;
    listData = "<li>" + userValue + "</li>";
  } else {
    listData = list.join("");
  }
  resultBox.innerHTML = listData; 
}

function randomPlayer() { // Choose a random player
  let randomPlayer =
    playerArray[Math.floor(Math.random() * playerArray.length)];
  let team = allData.find((x) =>
    x.players.some((y) => y.player_name === randomPlayer)
  );
  let player = team.players.find((x) => x.player_name === randomPlayer);
  return { player, team };
}

function testplayer(
  player,
  playerTeam,
  playerToGuess,
  playerTeamToGuess,
  turn,
) {
  console.log(player.player_name);
  console.log(playerToGuess);
  let resultBox = document.querySelector(".map");

  if (player.player_name === playerToGuess.player_name) { // If the player is the good one
    displayGuess(player, playerToGuess, playerTeam, playerTeamToGuess, turn);
    win(playerToGuess); // Start the win function
  } else {
    displayGuess(player, playerToGuess, playerTeam, playerTeamToGuess, turn); // Display the player
  }
  turn++;
  if (turn === 7) { // If the user has made 7 turns, the game is over
    let new_data = "<p>Game Over, the good player was " +
      playerToGuess.player_name + "</p>" + "<img src='" + playerToGuess.player_image + 
      "' alt='Sorry, no image avaible!'>";;
    resultBox.innerHTML = new_data;
    document.querySelector(".playagain").style.display = "block";

    let image = resultBox.querySelector("img");
    image.style.borderRadius = "50%";
    image.style.width = "100px";
    image.style.height = "100px";
    image.style.marginTop = "10px";
  } else if (turn === 4) { // If the user has made 4 turns, we display the button to reveal the player if he wants to have a clue
    document.querySelector(".reveal").style.display = "flex";
  }
  return turn;
}

function isValide(player, playerTeam) { // Check if the player is valid
  if ( // We take only the players with a number, an age, a type, a team country, a team name and an image
    player.player_number === "" || player.player_age === "" ||
    player.player_type === "" || playerTeam.team_country === "" ||
    playerTeam.team_name === "" || player.player_image === ""
  ) {
    return false;
  }
  return true;
}

function displayGuess(
  player,
  playerToGuess,
  playerTeam,
  playerTeamToGuess,
  indice,
) {
  indice = indice + 1;

  let guessNamediv = document.querySelector(".name" + indice.toString());
  let guessIndice = document.querySelector(".guess-indice" + indice.toString());
  let playerDiv = document.createElement("div");

  let guessName = document.createElement("div");
  guessName.innerHTML = player.player_name;
  guessNamediv.prepend(guessName);

  let playerNumber = document.createElement("div");
  let playerAge = document.createElement("div");
  let playerPos = document.createElement("div");
  let playerLeague = document.createElement("div");
  let playerClub = document.createElement("div");

  playerNumber.className = "player-number";
  playerAge.className = "player-age";
  playerPos.className = "player-pos";
  playerLeague.className = "player-league";
  playerClub.className = "player-club";

  if (player.player_number === playerToGuess.player_number) { // Check if the player number is the good one
    playerNumber.innerHTML = "#" + player.player_number;
    playerNumber.style.backgroundColor = "rgb(34, 197, 94)"; // Change the color of the div to green
  } else {
    if (
      parseInt(player.player_number) > parseInt(playerToGuess.player_number)
    ) {
      playerNumber.innerHTML = "#" + player.player_number + "⬇️"; // Add an arrow to indicate if the number is higher or lower
      playerNumber.style.backgroundColor = "rgba(58, 58, 58, 0.5)";
    } else {
      playerNumber.innerHTML = "#" + player.player_number + "⬆️"; // Add an arrow to indicate if the number is higher or lower
      playerNumber.style.backgroundColor = "rgba(58, 58, 58, 0.5)";
    }
  }

  if (player.player_age === playerToGuess.player_age) { // Check if the player age is the good one
    playerAge.innerHTML = player.player_age + "y";
    playerAge.style.backgroundColor = "rgb(34, 197, 94)";
  } else {
    if (parseInt(player.player_age) > parseInt(playerToGuess.player_age)) {
      playerAge.innerHTML = player.player_age + "y" + "⬇️"; // Add an arrow to indicate if the age is higher or lower
      playerAge.style.backgroundColor = "rgba(58, 58, 58, 0.5)";
    } else {
      playerAge.innerHTML = player.player_age + "y" + "⬆️"; // Add an arrow to indicate if the age is higher or lower
      playerAge.style.backgroundColor = "rgba(58, 58, 58, 0.5)";
    }
  }

  if (player.player_type === playerToGuess.player_type) { // Check if the player type is the good one
    playerPos.innerHTML = player.player_type;
    playerPos.style.backgroundColor = "rgb(34, 197, 94)";
  } else {
    playerPos.innerHTML = player.player_type;
    playerPos.style.backgroundColor = "rgba(58, 58, 58, 0.5)";
  }

  if (playerTeam.team_country === playerTeamToGuess.team_country) { // Check if the team country is the good one
    if (playerTeam.team_country === "England") {
      playerLeague.innerHTML = "<img src= /IMG/PL-logo.png>"; // Display the league logo
    } else if (playerTeam.team_country === "Germany") {
      playerLeague.innerHTML = "<img src= /IMG/bundes-logo.png>";
    } else if (playerTeam.team_country === "France") {
      playerLeague.innerHTML = "<img src= /IMG/ligue1-logo.png>";
    } else if (playerTeam.team_country === "Italy") {
      playerLeague.innerHTML = "<img src= /IMG/serieA-logo.png>";
    } else if (playerTeam.team_country === "Spain") {
      playerLeague.innerHTML = "<img src= /IMG/liga-logo.jpg>";
    }
    playerLeague.style.backgroundColor = "rgb(34, 197, 94)";
  } else {
    if (playerTeam.team_country === "England") {
      playerLeague.innerHTML = "<img src= /IMG/PL-logo.png>";
    } else if (playerTeam.team_country === "Germany") {
      playerLeague.innerHTML = "<img src= /IMG/bundes-logo.png>";
    } else if (playerTeam.team_country === "France") {
      playerLeague.innerHTML = "<img src= /IMG/ligue1-logo.png>";
    } else if (playerTeam.team_country === "Italy") {
      playerLeague.innerHTML = "<img src= /IMG/serieA-logo.png>";
    } else if (playerTeam.team_country === "Spain") {
      playerLeague.innerHTML = "<img src= /IMG/liga-logo.jpg>";
    }
    playerLeague.style.backgroundColor = "rgba(58, 58, 58, 0.5)";
  }

  if (playerTeam.team_name === playerTeamToGuess.team_name) { // Check if the team name is the good one
    playerClub.innerHTML = "<img src='" + playerTeamToGuess.team_badge +
      "' alt='Sorry, no image avaible!'>";
    playerClub.style.backgroundColor = "rgb(34, 197, 94)"; 
  } else {
    playerClub.innerHTML = "<img src='" + playerTeam.team_badge +
      "' alt='Sorry, no image avaible!'>";
    playerClub.style.backgroundColor = "rgba(58, 58, 58, 0.5)";
  }

  playerDiv.append(
    playerNumber,
    playerAge,
    playerPos,
    playerLeague,
    playerClub,
  );
  document.querySelector(".name" + indice.toString()).style.display = "block";

  guessIndice.prepend(playerDiv);
  playerDiv.className = "player-style";
  guessNamediv.style.backgroundColor = "rgb(214, 214, 214, 0.5)";
}

function win(playerToGuess) { // Function win when the user has found the player
  let new_data = "<p>Congratulations, you found the player " +
    playerToGuess.player_name + "</p>" +
    "<img src='" + playerToGuess.player_image + 
    "' alt='Sorry, no image avaible!'>"; // Display the player image

  let resultBox = document.querySelector(".map");
  resultBox.innerHTML = new_data;
  
  document.querySelector(".playagain").style.display = "block"; 

  let image = resultBox.querySelector("img");
  image.style.borderRadius = "50%";
  image.style.width = "100px";
  image.style.height = "100px";
  image.style.marginTop = "10px";
}

let button = document.querySelector(".reveal");
button.addEventListener("click", () => {
  let image = document.querySelector(".team");
  image.src = playerTeamToGuess.team_badge;
  image.style.display = "flex";
  button.style.display = "none";
});

let button2 = document.querySelector(".playagain");
button2.addEventListener("click", () => {
  window.location.reload();
});
