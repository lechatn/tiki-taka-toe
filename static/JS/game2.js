import bundesliga from "../data/bundes.json" assert { type: "json" };
import premierLeague from "../data/premier.json" assert { type: "json" };
import ligue1 from "../data/ligue1.json" assert { type: "json" };
import serieA from "../data/seria.json" assert { type: "json" };
import laLiga from "../data/liga.json" assert { type: "json" };

/*
const searchInput = document.querySelector(".searchInput");
const input = searchInput.querySelector("input");
const resultBox = searchInput.querySelector(".resultBox");
*/


const allData = laLiga.concat(
  bundesliga,
  premierLeague,
  ligue1,
  serieA,
);

let [playerArray, playerPhoto] = loadData(allData);
let [result, photo] = randomPlayer();
startListener(photo);
launchGame(result);

function randomPlayer() {
    let randomIndex = Math.floor(Math.random() * playerArray.length);
    let randomPlayer = playerArray[randomIndex];
    return [randomPlayer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(), playerPhoto[randomIndex]];
}

function isValide(player, playerTeam) {
    return player.player_number === "" || player.player_age === "" ||
    player.player_type === "" || playerTeam.team_country === "" ||
    playerTeam.team_name === "" || player.player_image === "";
}

function launchGame(result) {
  let playerToGuess = result;
  let box1 = document.querySelector(".box1");
  let userInput = "";
  let turn = 0;
  for (let i = 0; i < playerToGuess.length; i++) {
    if (i === 0) {
        let new_data = `<input type="text" class="circle" maxlength="1" value="${playerToGuess[i]}" style="background-color: rgb(34, 197, 94);" readonly></input>`;        box1.innerHTML += new_data;
    } else if (i === 1) {
        let new_data = '<input type="text" class="circle" maxlength="1" autofocus></input>';
        box1.innerHTML += new_data;
    } else {
        let new_data = `<input type="text" class="circle" maxlength="1"></input>`;
        box1.innerHTML += new_data;
    }
  }
  playGame(playerToGuess, userInput, turn);
}

function tryPlayer(playerToGuess, userInput, turn, circles) {
  turn++;
  userInput.toLowerCase();

  const animation_duration = 500;
  if (playerToGuess === userInput) {
    for (let circle of circles) {
      circle.style.backgroundColor = "rgb(34, 197, 94)";
    }
    document.querySelector(".player").src = photo; 
    document.querySelector(".player").style.display = "block";
    document.querySelector(".revealPhoto").style.display = "none"; 
    document.querySelector(".playagain").style.display = "block"; 
    console.log("You won!");
    return;
  }
  for (let i = 0; i < playerToGuess.length; i++) {
    setTimeout(() => {
      if (playerToGuess[i] === userInput[i]) {
        circles[i].style.backgroundColor = "rgb(34, 197, 94)";
      } else if (playerToGuess.includes(userInput[i])) {
        circles[i].style.backgroundColor = "rgb(252, 179, 0)";
      } else {
        circles[i].style.backgroundColor = "rgb(15, 20, 52)";
      }
    }, ((i + 1) * animation_duration) / 2);
    circles[i].classList.add("animated");
    circles[i].style.animationDelay = `${(i * animation_duration) / 2}ms`;
    circles[i].disabled = true;
  }
  if (turn === 6) {
    document.querySelector(".player").src = photo; 
    document.querySelector(".player").style.display = "block";
    document.querySelector(".revealPhoto").style.display = "none"; 
    document.querySelector(".playagain").style.display = "block"; 
  }
  let box = document.querySelector(`.box${turn + 1}`);
    for (let i = 0; i < playerToGuess.length; i++) {
        let new_data = i === 0
            ? `<input type="text" class="circle${turn + 1}" maxlength="1" value="${playerToGuess[i]}" style="background-color: rgb(34, 197, 94);" readonly></input>`
            : `<input type="text" class="circle${turn + 1}" maxlength="1"></input>`;
        box.innerHTML += new_data;
}
  playGame(playerToGuess, userInput, turn);
}

function playGame(playerToGuess, userInput, turn) {
  userInput = "";
  let circles;
  if (turn === 0) {
    circles = document.querySelectorAll(".circle");
  } else{
    circles = document.querySelectorAll(`.circle${turn + 1}`);
  }
  circles[1].focus();
  circles.forEach((circle, index) => {
    circle.addEventListener("input", () => {
      userInput = "";
      userInput = Array.from(circles).map((input) => input.value).join("").toLocaleLowerCase();
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
        if (index === 1) {
          return;
        }
        userInput = Array.from(circles).map((input) => input.value).join("").toLocaleLowerCase;
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

function loadData(allData){
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
    return [playerArray, playerPhoto];
}

function startListener(photo) {
    console.log("startListener photo: ", photo);
    let button = document.querySelector(".revealPhoto");
    button.addEventListener("click", () => {    
    button.style.display = "none";
    let photoBox = document.querySelector(".player");
    photoBox.src = photo;
    photoBox.style.display = "block";
}
);

let button2 = document.querySelector(".playagain");
button2.addEventListener("click", () => {
    window.location.reload();
}
);


}