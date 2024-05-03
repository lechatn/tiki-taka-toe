import bundesliga from "../data/bundes.json" assert { type: "json" };
import premierLeague from "../data/premier.json" assert { type: "json" };
import ligue1 from "../data/ligue1.json" assert { type: "json" };
import serieA from "../data/seria.json" assert { type: "json" };
import laLiga from "../data/liga.json" assert { type: "json" };

/*const searchInput = document.querySelector(".searchInput");
const input = searchInput.querySelector("input");
const resultBox = searchInput.querySelector(".resultBox");
*/

const allData = laLiga.concat(
  bundesliga,
  premierLeague,
  ligue1,
  serieA,
);

let playerArray = [];
let playerPhoto = [];

for (let j = 0; j < allData.length; j++) {
  for (let i = 0; i < allData[j].players.length; i++) {
    if (playerArray.includes(allData[j].players[i])) {
      continue;
    } else if (allData[j].players[i].player_name[1] != ".") {
      continue;
    } else if (
      allData[j].players[i].player_name.split(
        0,
        allData[j].players[i].player_name.length - 1,
      ).includes(" ")
    ) {
      continue;
    } else if (isValide(allData[j].players[i], allData[j])) {
        playerArray.push(allData[j].players[i].player_name.slice(3));
        playerPhoto.push(allData[j].players[i].player_image);
    }
  }
}


let [result, photo] = randomPlayer();
console.log(result);
launchGame(result);

function randomPlayer() {
    let randomIndex = Math.floor(Math.random() * playerArray.length);
    let randomPlayer = playerArray[randomIndex];
    return [randomPlayer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(), playerPhoto[randomIndex]];
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

function launchGame(result) {
  let playerToGuess = result;
  let box1 = document.querySelector(".box1");
  let userInput = "";
  let turn = 0;
  for (let i = 0; i < playerToGuess.length; i++) {
    if (i === 0) {
        let new_data = `<input type="text" class="circle" maxlength="1" value="${playerToGuess[i]}"></input>`;
        box1.innerHTML += new_data;
        document.querySelector(".circle").focus();
    } else {
        let new_data = '<input type="text" class="circle" maxlength="1"></input>';
        box1.innerHTML += new_data;
        document.querySelector(".circle").focus();
    }
  }

  playGame(playerToGuess, userInput, turn);
}

function tryPlayer(playerToGuess, userInput, turn, circles) {
  turn++;
  if (playerToGuess === userInput) {
    for (let circle of circles) {
      circle.style.backgroundColor = "green";
    }
    console.log("You won!");
    return;
  }
  for (let i = 0; i < playerToGuess.length; i++) {
    if (playerToGuess[i] === userInput[i]) {
      circles[i].style.backgroundColor = "green";
    } else if (playerToGuess.includes(userInput[i])) {
      circles[i].style.backgroundColor = "orange";
    } else {
      circles[i].style.backgroundColor = "red";
    }
    circles[i].disabled = true;
  }
  if (turn === 6) {
    prompt("You lost! The player was " + playerToGuess);
  }
  switch (turn) {
    case 1:
      let box2 = document.querySelector(".box2");
      for (let i = 0; i < playerToGuess.length; i++) {
        let new_data =
          '<input type="text" class="circle2" maxlength="1"></input>';
        box2.innerHTML += new_data;
        document.querySelector(".circle2").focus();
      }
      break;

    case 2:
      let box3 = document.querySelector(".box3");
      for (let i = 0; i < playerToGuess.length; i++) {
        let new_data =
          '<input type="text" class="circle3" maxlength="1"></input>';
        box3.innerHTML += new_data;
        document.querySelector(".circle3").focus();
      }
      break;

    case 3:
      let box4 = document.querySelector(".box4");
      for (let i = 0; i < playerToGuess.length; i++) {
        let new_data =
          '<input type="text" class="circle4" maxlength="1"></input>';
        box4.innerHTML += new_data;
        document.querySelector(".circle4").focus();
      }
      break;

    case 4:
      let box5 = document.querySelector(".box5");
      for (let i = 0; i < playerToGuess.length; i++) {
        let new_data =
          '<input type="text" class="circle5" maxlength="1"></input>';
        box5.innerHTML += new_data;
        document.querySelector(".circle5").focus();
      }
      break;

    case 5:
      let box6 = document.querySelector(".box6");
      for (let i = 0; i < playerToGuess.length; i++) {
        let new_data =
          '<input type="text" class="circle6" maxlength="1"></input>';
        box6.innerHTML += new_data;
        document.querySelector(".circle6").focus();
      }
      break;

    default:
      break;
  }
  playGame(playerToGuess, userInput, turn);
}

function playGame(playerToGuess, userInput, turn) {
  userInput = "";
  let circles;
  switch (turn) {
    case 0:
      circles = document.querySelectorAll(".circle");
      break;
    case 1:
      circles = document.querySelectorAll(".circle2");
      break;
    case 2:
      circles = document.querySelectorAll(".circle3");
      break;
    case 3:
      circles = document.querySelectorAll(".circle4");
      break;
    case 4:
      circles = document.querySelectorAll(".circle5");
      break;
    case 5:
      circles = document.querySelectorAll(".circle6");
      break;
    default:
      break;
  }
  circles.forEach((circle, index) => {
    circle.addEventListener("input", () => {
      userInput = "";
      userInput = Array.from(circles).map((input) => input.value).join("");
      if (index < circles.length - 1 && circles[index].value !== "") {
        circles[index + 1].focus();
      }
    });

    circle.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        if (Array.from(circles).every((input) => input.value !== "")) {
          tryPlayer(playerToGuess, userInput, turn, circles);
        }
        event.preventDefault(); // Empêche le comportement par défaut de la touche Entrée
      } else if (event.key === "Backspace") {
        userInput = Array.from(circles).map((input) => input.value).join("");
        if (userInput.length > 0) {
          userInput = userInput.slice(0, -1);
          console.log(userInput);
        } else if (userInput.length === 1) {
          userInput = "";
        }
        if (circle.value === "") {
          circles[index - 1].value = "";
          circles[index - 1].focus();
        } else {
          circle.value = "";
        }
      }
    });
  });
}


let button = document.querySelector(".revealPhoto");
button.addEventListener("click", () => {    
    button.style.display = "none";
    let photoBox = document.querySelector(".player");
    photoBox.src = photo;
    photoBox.style.display = "block";
}
);
