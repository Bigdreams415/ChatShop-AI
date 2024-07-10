document.addEventListener("DOMContentLoaded", function() {
    const emailStep = document.getElementById("emailStep");
    const passwordStep = document.getElementById("passwordStep");
    const continueEmail = document.getElementById("continueEmail");
    const editEmail = document.getElementById("editEmail");
    const emailText = document.getElementById("email_address_display");
    const emailInput = document.getElementById("email_address");

    continueEmail.addEventListener("click", function() {
        const email = emailInput.value;
        if (email) {
            emailText.value = email;
            emailStep.style.display = "none";
            passwordStep.style.display = "block";
        } else {
            alert("Please enter a valid email address.");
        }
    });

    editEmail.addEventListener("click", function() {
        passwordStep.style.display = "none";
        emailStep.style.display = "block";
        emailInput.focus();
    });

    function togglePasswordVisibility(toggleButton, passwordField) {
        toggleButton.addEventListener("click", function() {
            const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
            passwordField.setAttribute("type", type);
            this.classList.toggle("fa-eye-slash");
        });
    }

    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirm_password");

    togglePasswordVisibility(togglePassword, passwordField);
    togglePasswordVisibility(toggleConfirmPassword, confirmPasswordField);
});
