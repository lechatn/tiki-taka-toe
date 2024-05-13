export function incrementWin(gameField, userEmail) {
  fetch("/increment-win", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: userEmail, game: gameField }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        console.log("Win count incremented successfully");
      } else {
        console.error("Failed to increment win count:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function incrementLoss(userEmail) {
  console.log("incrementLoss userEmail:", userEmail);
  fetch("/increment-loss", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: userEmail }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        console.log("Loss count incremented successfully");
      } else {
        console.error("Failed to increment loss count:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function getUserEmail() {
  return fetch("/get-user-email")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const userEmail = data.email;
        return userEmail;
      } else {
        console.error("Failed to get user email:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function getUserUsername() {
  return fetch("/get-user-username")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const userUsername = data.username;
        return userUsername;
      } else {
        console.error("Failed to get user email:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function getUserStats() {
  return fetch("/get-user-stats")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const userStats = data.user;
        return userStats;
      } else {
        console.error("Failed to get user stats:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
