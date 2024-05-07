console.log("signup.js loaded");
document.getElementById("signupForm").addEventListener(
  "submit",
  function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("username:", username);
    console.log("email:", email);
    console.log("password:", password);

    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          localStorage.setItem("isConnected", "true");
          window.location.href = "/";
        } else {
          console.log("Registration failed");
          document.getElementById("signupStatus").textContent =
            "Email already exists";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },
);
