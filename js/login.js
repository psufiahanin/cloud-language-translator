const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();


        if (!email || !password) {

            if (loginMessage) {

                loginMessage.textContent =
                    "Please enter your email and password.";

                loginMessage.style.color = "#b44f45";
            }

            return;
        }


        if (loginMessage) {

            loginMessage.textContent =
                "Login successful! Redirecting...";

            loginMessage.style.color = "#6c8b62";
        }


        setTimeout(function () {

            window.location.href = "translate.html";

        }, 700);

    });

}