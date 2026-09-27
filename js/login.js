// =========================
// CLOUDTRANSLATE - LOGIN
// =========================

function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();


    if (email === "" || password === "") {

        alert("Please enter your email and password.");

        return;

    }


    // Temporary login
    // Real authentication will be connected using Amazon Cognito later.

    window.location.href = "translate.html";

}