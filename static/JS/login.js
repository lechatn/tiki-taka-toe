function togglePopup() {
  let popup = document.getElementById("wrapper");
  popup.classList.toggle("open");
}

function togglePopup2() {
  let popup = document.getElementById("wrapper2");
  popup.classList.toggle("open");
}
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log('email:', email);
  console.log('password:', password);

  fetch('/login', {
   method: 'POST',
    headers: {
      'Content-Type': 'application/json',
   },
   body: JSON.stringify({ email, password }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        window.location.href = '/';
        localStorage.setItem('isConnected', 'true');
      } else {
        document.getElementById('loginStatus').textContent = 'Invalid email or password';
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});
