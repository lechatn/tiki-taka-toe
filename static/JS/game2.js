import bundesliga from "../data/bundes.json" assert { type: "json" };
import premierLeague from "../data/premier.json" assert { type: "json" };
import ligue1 from "../data/ligue1.json" assert { type: "json" };
import serieA from "../data/seria.json" assert { type: "json" };
import laLiga from "../data/liga.json" assert { type: "json" };
import { incrementWin, getUserEmail} from "./incrementWin.js";

const allData = laLiga.concat( // Concatenate all the data in one array
  bundesliga,
  premierLeague,
  ligue1,
  serieA,
);

let [playerArray, playerPhoto] = loadData(allData); // Loading data
let [result, photo] = randomPlayer(); // Choose a random player
startListener(photo);
launchGame(result); // Launch the game
console.log(result);

function randomPlayer() {
  let randomIndex = Math.floor(Math.random() * playerArray.length); // Choose a random index
  let randomPlayer = playerArray[randomIndex];
  return [
    randomPlayer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
    playerPhoto[randomIndex],
  ]; // Return the random player without accents and upper case
}

function isValide(player) {
  if (player.player_image === "") { // Check if the player has an image
    return false;
  } else if (
    !/^[a-zàâçéèêëîïôûùüÿñ]+$/i.test(player.player_name.substring(3))
  ) { // Check if the player name only contains letters of french alphabet
    return false;
  } else if (player.player_name.length >= 11) { // Check if the player name is not too long
    return false;
  }
  return true;
}

function launchGame(result) {
  let playerToGuess = result;
  let box1 = document.querySelector(".box1");
  let userInput = "";
  let turn = 0;
  for (let i = 0; i < playerToGuess.length; i++) { // Display the firsts circles
    if (i === 0) {
      let new_data = `<input type="text" class="circle" maxlength="1" value="${
        playerToGuess[i]
      }" style="background-color: rgb(34, 197, 94);" readonly></input>`; // Display the first circle with the first letter of the player name
      box1.innerHTML += new_data;
    } else if (i === 1) {
      let new_data =
        '<input type="text" class="circle" maxlength="1" autofocus></input>'; // Make the autofocus on the second circle
      box1.innerHTML += new_data;
    } else {
      let new_data = `<input type="text" class="circle" maxlength="1"></input>`;
      box1.innerHTML += new_data;
    }
  }
  playGame(playerToGuess, userInput, turn); // Start the game
}

function tryPlayer(playerToGuess, userInput, turn, circles) {
  turn++;
  userInput.toLowerCase(); // Put the user input in lower case to test it
  let find = false;
  const animation_duration = 500; // Duration of the animation in ms
  if (playerToGuess === userInput) {
    find = true;
  }
  for (let i = 0; i < playerToGuess.length; i++) {
    setTimeout(() => {
      if (playerToGuess[i] === userInput[i]) {
        circles[i].style.backgroundColor = "rgb(34, 197, 94)"; // Change the color of the circle to green if the letter is correct
      } else if (playerToGuess.includes(userInput[i])) {
        circles[i].style.backgroundColor = "rgb(252, 179, 0)"; // Change the color of the circle to orange if the letter is in the player name
      } else {
        circles[i].style.backgroundColor = "rgb(15, 20, 52)";
      }
    }, ((i + 1) * animation_duration) / 2);
    circles[i].classList.add("animated");
    circles[i].style.animationDelay = `${(i * animation_duration) / 2}ms`;
    circles[i].disabled = true;
  }

if (turn === 3) {
  document.querySelector(".revealPhoto").style.display = "block";
}
  if (turn === 6) { // If the user has made 6 tries, the game is over
    document.querySelector(".player").src = photo;
    document.querySelector(".player").style.display = "block"; // Display the player photo
    document.querySelector(".revealPhoto").style.display = "none";
    document.querySelector(".playagain").style.display = "block"; // Display the play again button
    document.querySelector("#defeatMessage").textContent =
      `Dommage ! Le joueur était ${playerToGuess}`; // Display the defeat message
    document.querySelector("#defeatMessage").style.display = "block";
    document.querySelector("#defeatMessage").style.color = "red";
    document.querySelector("#defeatMessage").style.fontSize = "1.5em";
    
  }
  let box = document.querySelector(`.box${turn + 1}`); // Display the next circles
  for (let i = 0; i < playerToGuess.length; i++) {
    let new_data = i === 0
      ? `<input type="text" class="circle${turn + 1}" maxlength="1" value="${
        playerToGuess[i]
      }" style="background-color: rgb(34, 197, 94);" readonly></input>`
      : `<input type="text" class="circle${turn + 1}" maxlength="1"></input>`;
    box.innerHTML += new_data;
  }
  if (find) { // If the user has found the player, the game is over
    document.querySelector(`.box${turn + 1}`).style.display = "none";
    document.querySelector(".player").src = photo; // Display the player photo
    document.querySelector(".player").style.display = "block";
    document.querySelector(".revealPhoto").style.display = "none";
    document.querySelector(".playagain").style.display = "block"; // Display the play again button
    document.querySelector("#victoryMessage").textContent =
      `Bravo ! Vous avez trouvé le joueur ${playerToGuess}`; // Display the victory message
      document.querySelector("#victoryMessage").style.display = "block";
      document.querySelector("#victoryMessage").style.color = "green";
      document.querySelector("#victoryMessage").style.fontSize = "1.5em";
    getUserEmail().then((email) => {
      incrementWin("wordleWin", email);
    });
    return;

    // Increment the win count


  }

  playGame(playerToGuess, userInput, turn); // Start the next turn
}

function playGame(playerToGuess, userInput, turn) {
  userInput = "";
  let circles;
  if (turn === 0) {
    circles = document.querySelectorAll(".circle");
  } else {
    circles = document.querySelectorAll(`.circle${turn + 1}`);
  }
  circles[1].focus(); // Put the focus on the second circle
  circles.forEach((circle, index) => { // Add event listeners on each circle
    circle.addEventListener("input", () => { // When the user types a letter
      userInput = "";
      userInput = Array.from(circles).map((input) => input.value).join("")
        .toLocaleLowerCase(); // Get the user input into a string
      if (index < circles.length - 1 && circles[index].value !== "") {
        circles[index + 1].focus();
      }
    });

    circle.addEventListener("keydown", (event) => { // When the user presses a key
      if (event.key === "Enter") { // If the user presses Enter
        if (Array.from(circles).every((input) => input.value !== "")) { // If all the circles are filled, we test the player
          tryPlayer(playerToGuess, userInput, turn, circles);
        }
        event.preventDefault(); // Prevent the default behavior of the Enter key
      } else if (event.key === "Backspace") { // If the user presses Backspace
        if (index === 1) {
          return;
        }
        userInput = Array.from(circles).map((input) =>
          input.value
        ).join("").toLocaleLowerCase;
        if (userInput.length > 0) {
          userInput = userInput.slice(0, -1); // Remove the last letter of the user input
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

function loadData(allData) { // Load the data
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
      } else if (isValide(allData[j].players[i], allData[j])) { // Check if the player is valid
        playerArray.push(allData[j].players[i].player_name.slice(3));
        playerPhoto.push(allData[j].players[i].player_image);
      }
    }
  }
  return [playerArray, playerPhoto]; // Return the player array and the player photo array
}

function startListener(photo) {
  let button = document.querySelector(".revealPhoto");
  button.addEventListener("click", () => {
    button.style.display = "none";
    let photoBox = document.querySelector(".player");
    photoBox.src = photo;
    photoBox.style.display = "block";
  });

  let button2 = document.querySelector(".playagain");
  button2.addEventListener("click", () => {
    window.location.reload();
  });
}
