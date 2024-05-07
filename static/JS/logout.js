function logout() {
  fetch("/logout", { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        // Update the UI to reflect that the user is logged out
        document.querySelector(".button-connection").innerHTML =
          '<a href="#login" onclick="togglePopup()">Login</a><a href="signup.html">Sign Up</a>';
        const logoutButton = document.getElementById("logoutButton");
        if (logoutButton) {
          logoutButton.style.display = "none"; // Hide the logout button
        }
        window.location.href = "/";
      } else {
        console.error("Error logging out:", data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
}
