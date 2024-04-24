import championsLeague from "../data/championsLeague.json" assert {
  type: "json",
};
import bundesliga from "../data/bundes.json" assert { type: "json" };
import premierLeague from "../data/premier.json" assert { type: "json" };
import ligue1 from "../data/ligue1.json" assert { type: "json" };
import serieA from "../data/seria.json" assert { type: "json" };
import laLiga from "../data/liga.json" assert { type: "json" };
import worldCup from "../data/worldCup.json" assert { type: "json" };

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
  worldCup,
);

let playerArray = [];

for (let j = 0; j < allData.length; j++) {
  for (let i = 0; i < allData[j].players.length; i++) {
    if (playerArray.includes(allData[j].players[i].player_name)) {
      continue;
    } else {
      playerArray.push(allData[j].players[i].player_name);
    }
  }
}

let result = randomPlayer();
let playerToGuess = result.player;
let playerTeamToGuess = result.team;
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
        let playerTeam = allData.find((x) => x.players.some((y) => y.player_name === input.value));
        let player = playerTeam.players.find((x) => x.player_name === input.value);
        console.log(player);
        console.log(playerTeam);
        testplayer(player, playerTeam, playerToGuess, playerTeamToGuess);
      });
    } 
}else {
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
    let randomPlayer = playerArray[Math.floor(Math.random() * playerArray.length)];
    let team = allData.find((x) => x.players.some((y) => y.player_name === randomPlayer));
    let player = team.players.find((x) => x.player_name === randomPlayer);
    return {player, team};
}

function testplayer(player, playerTeam, playerToGuess, playerTeamToGuess) {
    console.log(player.player_name);
    console.log(playerToGuess);    
    if (player.player_name === playerToGuess.player_name) {
        console.log("Correct!");
    } else {
        console.log("Incorrect!");
    }
}