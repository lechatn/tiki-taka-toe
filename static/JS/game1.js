import bundesliga from "../data/bundes.json" assert { type: "json" };
import premierLeague from "../data/premier.json" assert { type: "json" };
import ligue1 from "../data/ligue1.json" assert { type: "json" };
import serieA from "../data/seria.json" assert { type: "json" };
import laLiga from "../data/liga.json" assert { type: "json" };

const searchInput = document.querySelector(".searchInput");
const input = searchInput.querySelector("input");
const resultBox = searchInput.querySelector(".resultBox");

const allData = laLiga.concat(
  bundesliga,
  premierLeague,
  ligue1,
  serieA,
);

let playerArray = [];

for (let j = 0; j < allData.length; j++) {
  for (let i = 0; i < allData[j].players.length; i++) {
    if (playerArray.includes(allData[j].players[i])) {
      continue;
    } else if (isValide(allData[j].players[i], allData[j])) {
      playerArray.push(allData[j].players[i].player_name);
    }
  }
}

let result = randomPlayer();
let playerToGuess = result.player;
let playerTeamToGuess = result.team;
let turn = 0;

console.log(playerToGuess);

// if user press any key and release
input.onkeyup = (e) => {
  let userData = e.target.value; //user enetered data
  let emptyArray = [];
  if (userData) {
    emptyArray = playerArray.filter((data) => {
      //filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
      return data.toLocaleLowerCase().includes(userData.toLocaleLowerCase());
    });
    emptyArray = emptyArray.map((data) => {
      // passing return data inside li tag
      return data = "<li>" + data + "</li>";
    });
    searchInput.classList.add("active"); //show autocomplete box
    showSuggestions(emptyArray);
    let allList = resultBox.querySelectorAll("li");
    for (let i = 0; i < allList.length; i++) {
      //adding onclick attribute in all li tag
      allList[i].addEventListener("click", function () {
        input.value = this.innerText;
        searchInput.classList.remove("active");
        let playerTeam = allData.find((x) =>
          x.players.some((y) => y.player_name === input.value)
        );
        let player = playerTeam.players.find((x) =>
          x.player_name === input.value
        );
        console.log(player);
        console.log(playerTeam);
        turn = testplayer(
          player,
          playerTeam,
          playerToGuess,
          playerTeamToGuess,
          turn,
        );
      });
    }
  } else {
    searchInput.classList.remove("active"); //hide autocomplete box
  }
};

function showSuggestions(list) {
  let listData;
  if (!list.length) {
    userValue = inputBox.value;
    listData = "<li>" + userValue + "</li>";
  } else {
    listData = list.join("");
  }
  resultBox.innerHTML = listData;
}

function randomPlayer() {
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

  if (player.player_name === playerToGuess.player_name) {
    displayGuess(player, playerToGuess, playerTeam, playerTeamToGuess, turn);
    win(playerToGuess);
  } else {
    displayGuess(player, playerToGuess, playerTeam, playerTeamToGuess, turn);
  }
  turn++;
  if (turn === 7) {
    let new_data = "<p>Game Over, the good player was " +
      playerToGuess.player_name + "</p>";
    resultBox.innerHTML = new_data;
  } else if (turn === 4) {
    document.querySelector(".reveal").style.display = "flex";
  }
  console.log(turn);
  return turn;
}

function isValide(player, playerTeam) {
  if (
    player.player_number === "" || player.player_age === "" ||
    player.player_type === "" || playerTeam.team_country === "" ||
    playerTeam.team_name === "" || player.player_image === ""
  ) {
    return false;
  }
  return true;
}

function displayGuess(player, playerToGuess, playerTeam, playerTeamToGuess,indice) {
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
  
    if (player.player_number === playerToGuess.player_number) {
        playerNumber.innerHTML = "#" + player.player_number;
        playerNumber.style.backgroundColor = "rgb(34, 197, 94)";

      } else {
        if (parseInt(player.player_number) > parseInt(playerToGuess.player_number)) {
            playerNumber.innerHTML = "#" + player.player_number + "⬇️";
            playerNumber.style.backgroundColor = "rgba(58, 58, 58, 0.5)";
        } else {
            playerNumber.innerHTML = "#" + player.player_number + "⬆️";
            playerNumber.style.backgroundColor = "rgba(58, 58, 58, 0.5)";
        }
      }
    
      if (player.player_age === playerToGuess.player_age) {
        playerAge.innerHTML = player.player_age + "y";
        playerAge.style.backgroundColor = "rgb(34, 197, 94)";
      } else {
        if (parseInt(player.player_age) > parseInt(playerToGuess.player_age)) {
            playerAge.innerHTML = player.player_age + "y" + "⬇️";
            playerAge.style.backgroundColor = "rgba(58, 58, 58, 0.5)";
        } else {
            playerAge.innerHTML = player.player_age + "y" + "⬆️";
            playerAge.style.backgroundColor = "rgba(58, 58, 58, 0.5)";
        }
      }
    
      if (player.player_type === playerToGuess.player_type) {
        playerPos.innerHTML = player.player_type;
        playerPos.style.backgroundColor = "rgb(34, 197, 94)";
      } else {
        playerPos.innerHTML = player.player_type;
        playerPos.style.backgroundColor = "rgba(58, 58, 58, 0.5)";
      }
    
      if (playerTeam.team_country === playerTeamToGuess.team_country) {
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

    
      if (playerTeam.team_name === playerTeamToGuess.team_name) {
        playerClub.innerHTML = "<img src='" + playerTeamToGuess.team_badge + "' alt='Sorry, no image avaible!'>";
        playerClub.style.backgroundColor = "rgb(34, 197, 94)";
      } else {
        playerClub.innerHTML = "<img src='" + playerTeam.team_badge + "' alt='Sorry, no image avaible!'>";
        playerClub.style.backgroundColor = "rgba(58, 58, 58, 0.5)";
      }

    playerDiv.append(playerNumber, playerAge, playerPos, playerLeague, playerClub);

  
    guessIndice.prepend(playerDiv);
    playerDiv.className ="player-style";
    guessNamediv.style.backgroundColor = "rgb(214, 214, 214, 0.5)";

  }

function win(playerToGuess) {
  let new_data = "<p>Congratulations, you found the player " +
    playerToGuess.player_name + "</p>" +
    "<img src='" + playerToGuess.player_image +
    "' alt='Sorry, no image avaible!'>";

  let resultBox = document.querySelector(".map");
  resultBox.innerHTML = new_data;

  document.querySelector(".playagain").style.display = "block"; 

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
}
);
