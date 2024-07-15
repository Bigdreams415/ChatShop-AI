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


// Code for login to welcome Page

async function login(event) {
    event.preventDefault(); // Prevent the form from submitting the default way
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Send login request to the backend
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const data = await response.json();
        // Store user data in sessionStorage
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('username', data.username); // Store the username for use on the welcome page
        // Redirect to the welcome page
        window.location.href = 'welcome.html';
    } else {
        alert('Login failed');
    }
}

window.onload = function() {
    const path = window.location.pathname.split('/').pop(); // Get the current page name
    if (path === 'welcome.html') {
        const username = sessionStorage.getItem('username');
        const email = sessionStorage.getItem('email');

        if (username && email) {
            const userSpan = document.getElementById('user');
            if (userSpan) {
                userSpan.innerText = username;
            }
        } else {
            // Redirect back to login page if username or email is not found
            window.location.href = 'login.html';
        }
    }
}
