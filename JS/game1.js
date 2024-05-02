import championsLeague from "../data/championsLeague.json" assert {
  type: "json",
};
import bundesliga from "../data/bundes.json" assert { type: "json" };
import premierLeague from "../data/premier.json" assert { type: "json" };
import ligue1 from "../data/ligue1.json" assert { type: "json" };
import serieA from "../data/seria.json" assert { type: "json" };
import laLiga from "../data/liga.json" assert { type: "json" };

const searchInput = document.querySelector(".searchInput");
const input = searchInput.querySelector("input");
const resultBox = searchInput.querySelector(".resultBox");
const icon = searchInput.querySelector(".icon");
let linkTag = searchInput.querySelector("a");
let webLink;

const allData = championsLeague.concat(
  bundesliga,
  premierLeague,
  ligue1,
  serieA,
  laLiga,
);

let playerArray = [];

for (let j = 0; j < allData.length; j++) {
  for (let i = 0; i < allData[j].players.length; i++) {
    if (playerArray.includes(allData[j].players[i].player_name)) {
      continue;
    } else if (isValide(allData[j].players[i], allData[j])) {
      playerArray.push(allData[j].players[i].player_name);
    }
  }
}

let result = randomPlayer();
let playerToGuess = result.player;
let playerTeamToGuess = result.team;

let indiceBox = document.querySelector(".indice-box");
let firstIndice = playerToGuess.player_number;
indiceBox.innerHTML = "Player number : " + firstIndice;
let secondIndice = playerToGuess.player_age;
let thirdIndice = playerToGuess.player_type;
let fourthIndice = playerTeamToGuess.team_country;
let fifthIndice = playerTeamToGuess.team_name;
let arrayIndice = [
  "",
  secondIndice,
  "",
  thirdIndice,
  "",
  fourthIndice,
  "",
  fifthIndice,
];
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
          arrayIndice,
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
  arrayIndice,
  turn,
) {
  console.log(player.player_name);
  console.log(playerToGuess);
  let resultBox = document.querySelector(".map");
  let indiceBox = document.querySelector(".indice-box");

  if (player.player_name === playerToGuess.player_name) {
    let new_data = "<p>Correct</p>";
    resultBox.innerHTML = new_data;
    console.log("Correct");
  } else {
    let new_data = "<p>Incorrect</p>";
    resultBox.innerHTML = new_data;
    console.log("Incorrect, try again!");

    displayGuess(player, playerToGuess, playerTeam, playerTeamToGuess);

    switch (turn) {
      case 1:
        let newdiv = document.createElement("div");
        newdiv.innerHTML = "Player age : " + arrayIndice[1];
        indiceBox.appendChild(newdiv);
        break;
      case 3:
        let newdiv2 = document.createElement("div");
        newdiv2.innerHTML = "Player position : " + arrayIndice[3];
        indiceBox.appendChild(newdiv2);
        break;
      case 5:
        let newdiv3 = document.createElement("div");
        newdiv3.innerHTML = "Team country : " + arrayIndice[5];
        indiceBox.appendChild(newdiv3);
        break;
      case 7:
        let newdiv4 = document.createElement("div");
        newdiv4.innerHTML = "Team name : " + arrayIndice[7];
        indiceBox.appendChild(newdiv4);
        break;
      default:
        break;
    }
  }
  turn++;
  if (turn === 9) {
    let new_data = "<p>Game Over, the good player was " +
      playerToGuess.player_name + "</p>";
    resultBox.innerHTML = new_data;
  }
  console.log(turn);
  return turn;
}

function isValide(player, playerTeam) {
  if (
    player.player_number === "" || player.player_age === "" ||
    player.player_type === "" || playerTeam.team_country === "" ||
    playerTeam.team_name === ""
  ) {
    return false;
  }
  return true;
}

function displayGuess(player, playerToGuess, playerTeam, playerTeamToGuess) {
  let guessIndice = document.querySelector(".guess-indice");

  let guessName = document.createElement("div");
  guessName.innerHTML = player.player_name;
  guessName.style.marginTop = "10px";
  guessIndice.appendChild(guessName);

  if (player.player_number === playerToGuess.player_number) {
    let newdiv = document.createElement("div");
    newdiv.innerHTML = "#" + player.player_number;
    newdiv.style.color = "green";
    guessIndice.appendChild(newdiv);
  } else {
    if (parseInt(player.player_number) > parseInt(playerToGuess.player_number)) {
        let newdiv = document.createElement("div");
        newdiv.innerHTML = "#" + player.player_number + "⬇️";
        newdiv.style.color = "red";
        guessIndice.appendChild(newdiv);
    } else {
        let newdiv = document.createElement("div");
        newdiv.innerHTML = "#" + player.player_number + "⬆️";
        newdiv.style.color = "red";
        guessIndice.appendChild(newdiv);
    }
  }

  if (player.player_age === playerToGuess.player_age) {
    let newdiv = document.createElement("div");
    newdiv.innerHTML = player.player_age + "y";
    newdiv.style.color = "green";
    guessIndice.appendChild(newdiv);
  } else {
    if (parseInt(player.player_age) > parseInt(playerToGuess.player_age)) {
        let newdiv = document.createElement("div");
        newdiv.innerHTML = player.player_age + "y" + "⬇️";
        newdiv.style.color = "red";
        guessIndice.appendChild(newdiv);
    } else {
        let newdiv = document.createElement("div");
        newdiv.innerHTML = player.player_age + "y" + "⬆️";
        newdiv.style.color = "red";
        guessIndice.appendChild(newdiv);
    }
  }

  if (player.player_type === playerToGuess.player_type) {
    let newdiv = document.createElement("div");
    newdiv.innerHTML = player.player_type;
    newdiv.style.color = "green";
    guessIndice.appendChild(newdiv);
  } else {
    let newdiv = document.createElement("div");
    newdiv.innerHTML = player.player_type;
    newdiv.style.color = "red";
    guessIndice.appendChild(newdiv);
  }

  if (playerTeam.team_country === playerTeamToGuess.team_country) {
    let newdiv = document.createElement("div");
    newdiv.innerHTML = playerTeamToGuess.team_country;
    newdiv.style.color = "green";
    guessIndice.appendChild(newdiv);
  } else {
    let newdiv = document.createElement("div");
    newdiv.innerHTML = playerTeam.team_country;
    newdiv.style.color = "red";
    guessIndice.appendChild(newdiv);
  }

  if (playerTeam.team_name === playerTeamToGuess.team_name) {
    let newdiv = document.createElement("div");
    newdiv.innerHTML = playerTeamToGuess.team_name;
    newdiv.style.color = "green";
    guessIndice.appendChild(newdiv);
  } else {
    let newdiv = document.createElement("div");
    newdiv.innerHTML = playerTeam.team_name;
    newdiv.style.color = "red";
    guessIndice.appendChild(newdiv);
  }
}