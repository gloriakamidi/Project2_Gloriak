const urlParams = new URLSearchParams(window.location.search);
const info = urlParams.get("info");

if (info) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.innerText = info;
  errorMessage.style.display = "block";
}

  const req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      const user = JSON.parse(req.response).user;
      document.getElementById(
        "welcome-message"
      ).innerText = `Welcome ${user.username}!`;
    }
  };
  req.open("GET", "http://localhost:3000/user", true);
  req.send();