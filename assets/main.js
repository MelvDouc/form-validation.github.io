const form = document.querySelector("form"),
    inputs = document.querySelectorAll("input"),
    username = document.querySelector("#username"),
    email_address = document.querySelector("#email_address"),
    password1 = document.querySelector("#password1"),
    password2 = document.querySelector("#password2"),
    showPasswordCheckbox = document.querySelector("#show-password-checkbox"),
    usernameRegex = /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/,
    emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    error_emptyFields = "Veuillez remplir tous les champs.",
    error_invalidUsername =
        "Le nom d'utilisateur ne peut contenir que des lettres et des chiffres ainsi que des tirets (- ou _), sauf au début et à la fin. Exemple : son_goku75.",
    error_invalidEmail = "Adresse électronique invalide.",
    error_differentPasswords = "Les mots de passe ne se correspondent pas.",
    error_invalidPassword = "Mots de passe invalide :";

const passwordErrorsDetail = {};
fetch("./assets/password-errors-detail.json")
    .then(res => res.json())
    .then(data => {
        Object.keys(data).forEach((key, i) => {
            passwordErrorsDetail[key] = Object.values(data)[i];
        });
        Object.values(passwordErrorsDetail).forEach(obj => obj.regex = new RegExp(obj.regex));
    });

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ====================
// ====================

const validateForm = (e) => {
    e.preventDefault();

    let errorAlert;

    if (Object.values(inputs).some(input => input.value === "")) {
        errorAlert = error_emptyFields;
    } else if (!usernameRegex.test(username.value)) {
        errorAlert = error_invalidUsername;
    } else if (!emailRegex.test(email_address.value)) {
        errorAlert = error_invalidEmail;
    } else if (password1.value !== password2.value) {
        errorAlert = error_differentPasswords;
    } else {
        const passwordErrorsFound = Object.values(passwordErrorsDetail)
            .filter(obj => !obj.regex.test(password1.value))
            .map(obj => obj.message);
        if (passwordErrorsFound.length > 0) {
            errorAlert = error_invalidPassword;
            passwordErrorsFound.forEach(msg => errorAlert += `\n- ${msg}`);
        }
    }

    if (errorAlert) {
        alert(errorAlert);
        return;
    }
    alert("Formulaire correctement rempli !");
}

form.addEventListener("submit", validateForm);

// ====================
// ====================

const comparePasswords = () => {
    if (password1.value.length > 0 && password2.value.length >= password1.value.length) {
        if (password1.value != password2.value) password2.style.background = "red";
        else password2.style.background = "#66ff66";
    } else password2.removeAttribute("style");
}

password2.addEventListener("keyup", comparePasswords);

// ====================
// ====================

const showPassword = () => {
    const passwordType = (showPasswordCheckbox.checked) ? "text" : "password";
    password1.type = passwordType;
    password2.type = passwordType;
}

showPasswordCheckbox.addEventListener("change", showPassword);

// ====================
// ====================

const generateRandomUsername = () => {
    fetch("https://randomuser.me/api/")
        .then(res => res.json())
        .then(data => {
            const fullNameObject = data.results[0].name,
                randomUsername =
                    fullNameObject.first.toLowerCase() + "-" + fullNameObject.last.toLowerCase() + randomInt(10, 99);
            username?.setAttribute("placeholder", "exemple : " + randomUsername);
        });

}

generateRandomUsername();