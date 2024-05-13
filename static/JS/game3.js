import bundesliga from "../data/bundes.json" assert { type: "json" };
import premierLeague from "../data/premier.json" assert { type: "json" };
import ligue1 from "../data/ligue1.json" assert { type: "json" };
import serieA from "../data/seria.json" assert { type: "json" };
import laLiga from "../data/liga.json" assert { type: "json" };
import { incrementWin, getUserEmail, incrementLoss} from "./incrementWin.js";

const allData = laLiga.concat(bundesliga, premierLeague, ligue1, serieA);

let playerSet = new Set();

for (let j = 0; j < allData.length; j++) {
  for (let i = 0; i < allData[j].players.length; i++) {
    if (playerSet.has(allData[j].players[i])) {
      continue;
    } else if (isValide(allData[j].players[i]) ) {
      playerSet.add(allData[j].players[i]);
    }
  }
}

let playerArray = Array.from(playerSet);


async function isValide(player) {
  if (
    player.player_number === "" ||
    player.player_age === "" ||
    player.player_type === "" ||
    player.player_image === "" ||
    player.player_goals === "" ||
    player.player_assists === ""
  ) {
    return false;
  } 
  return true;
}

function randomPlayer() { // Function to get a random player
  let randomPlayer =
    playerArray[Math.floor(Math.random() * playerArray.length)];
  return randomPlayer;
}

function randomStat(player) { // Function to get a random stat of the player i choose randomly
  let stats = [
    "player_age",
    "player_number",
    "player_type",
    "player_goals",
    "player_assists",
    
  ];
  let randomStat = stats[Math.floor(Math.random() * stats.length)];
  return { stat: randomStat, value: player[randomStat]};
}

function getOtherPlayers(player, stat) { // Function to get 4 other players who doesnt have the random stat choose before
  let others = [];
  while (others.length < 4) {
    let otherPlayer = randomPlayer();
    if (
      otherPlayer.player_name !== player.player_name &&
      otherPlayer[stat] !== player[stat]
    ) {
      others.push(otherPlayer);
    }
  }
  return others;
}

function displayStat(result) { // Function to display the stat of the player
  let statDiv = document.querySelector(".stat");
  statDiv.innerHTML = `${result.value}`;
  document.querySelector(".stat").style.fontSize = "1.5em";

  if (result.stat === "player_age") {
    statDiv.innerHTML += "yo";
  } else if (result.stat === "player_number") {
    statDiv.innerHTML = "#" + statDiv.innerHTML;
  } else if (result.stat === "player_type") {
    statDiv.innerHTML = statDiv.innerHTML.charAt(0).toUpperCase() + statDiv.innerHTML.slice(1);
  } else if (result.stat === "player_goals") {
    statDiv.innerHTML += " goals";
  } else if (result.stat === "player_assists") {
    statDiv.innerHTML += " assists";
  }
}

function shuffleArray(array) { // Function to shuffle the array of players because the player i choose randomly is always the first one
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let attempts = 3;

function displayPlayers(selectedPlayer, others) { // Function to display the players names and their images
    let players = [selectedPlayer, ...others];
    shuffleArray(players);
    let playersDiv = document.querySelector(".players");
    let html = '';

    players.forEach((player, index) => {
        html += `<div class="player${index}">${player.player_name} <br> <br> <img src="${player.player_image}" alt="${player.player_name}" style="border-radius: 50%; width: 100px; height: 100px;"></div>`;
    });

    playersDiv.innerHTML = html;

    players.forEach((player, index) => {
      let img = document.querySelector(`.player${index} img`);
      img.onerror = function() {
          img.src = 'https://apiv3.apifootball.com/badges/players/92588_aitor-paredes.jpg';
      }
    });

    players.forEach((player, index) => {
        document.querySelector(`.player${index}`).addEventListener('click', function() {
            if (selectedPlayer === player) {
                win(player);
            } else {
                attempts --;
                document.querySelector(`.heart${attempts + 1}`);
                if (attempts === 2) {
                    document.querySelector('.heart3').innerText = '';
                } else if (attempts === 1) {
                    document.querySelector('.heart2').innerText = '';
                } else if (attempts === 0) {
                    document.querySelector('.heart1').innerText = '';
                    lose(selectedPlayer);
                }
            }
        });
    });
}

function Game() {

  let player = randomPlayer();
  let result = randomStat(player);
  let others = getOtherPlayers(player, result.stat);
  displayStat(result);
  displayPlayers(player, others, result);
}

function win(player) { // Function win when the user has found the player
    let new_data = "<p>Congratulations, you found the player " +
      player.player_name + "</p>" +
      "<img src='" + player.player_image + 
      "' alt='Sorry, no image avaible!'>"; // Display the player image
  
    let resultBox = document.querySelector(".map");
    resultBox.innerHTML = new_data;
    
    document.querySelector(".playagain").style.display = "block"; 
  
    let image = resultBox.querySelector("img");
    image.style.borderRadius = "50%";
    image.style.width = "100px";
    image.style.height = "100px";
    image.style.marginTop = "10px";

    // Increment win count
    getUserEmail().then((userEmail) => {
      incrementWin("bingoStatsWin", userEmail);
    });
  }
function lose(player) { // Function lose when the user has no more attempts
  let new_data = "<p>Sorry, you loose, the player was " +
    player.player_name + "</p>" +
    "<img src='" + player.player_image +
    "' alt='Sorry, no image avaible!'>"; // Display the player image

  let resultBox = document.querySelector(".map");
  resultBox.innerHTML = new_data;

  document.querySelector(".playagain").style.display = "block";

  let image = resultBox.querySelector("img");
  image.onerror = function () {
    image.src =
      "https://apiv3.apifootball.com/badges/players/92588_aitor-paredes.jpg";
  };
  image.style.borderRadius = "50%";
  image.style.width = "100px";
  image.style.height = "100px";
  image.style.marginTop = "10px";

    // Increment loss count
    getUserEmail().then((userEmail) => {
        incrementLoss(userEmail);
    });
}



  let button2 = document.querySelector(".playagain");
button2.addEventListener("click", () => {
  window.location.reload();
});


Game();
