document.addEventListener("DOMContentLoaded", function() {
    // Email step functionality
    const emailStep = document.getElementById("emailStep");
    const passwordStep = document.getElementById("passwordStep");
    const continueEmail = document.getElementById("continueEmail");
    const editEmail = document.getElementById("editEmail");
    const emailText = document.getElementById("email_address_display");
    const emailInput = document.getElementById("email_address");

    console.log("Document is ready");

    // Check if elements exist before adding event listeners
    if (continueEmail && emailInput && emailText && emailStep && passwordStep) {
        continueEmail.addEventListener("click", function() {
            const email = emailInput.value;
            console.log("Continue button clicked. Email:", email);
            if (email) {
                emailText.value = email;
                emailStep.style.display = "none";
                passwordStep.style.display = "block";
            } else {
                alert("Please enter a valid email address.");
            }
        });
    } else {
        console.error("One or more elements not found for emailStep functionality.");
    }

    if (editEmail && passwordStep && emailStep && emailInput) {
        editEmail.addEventListener("click", function() {
            passwordStep.style.display = "none";
            emailStep.style.display = "block";
            emailInput.focus();
        });
    } else {
        console.error("One or more elements not found for editEmail functionality.");
    }

    function togglePasswordVisibility(toggleButton, passwordField) {
        if (toggleButton && passwordField) {
            toggleButton.addEventListener("click", function() {
                const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
                passwordField.setAttribute("type", type);
                this.classList.toggle("fa-eye-slash");
            });
        } else {
            console.error("Toggle button or password field not found.");
        }
    }

    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirm_password");

    if (togglePassword && toggleConfirmPassword && passwordField && confirmPasswordField) {
        togglePasswordVisibility(togglePassword, passwordField);
        togglePasswordVisibility(toggleConfirmPassword, confirmPasswordField);
    } else {
        console.error("One or more elements not found for password visibility toggle.");
    }

    // Register event listener for password submission
    const submitPassword = document.getElementById("submitPassword");
    if (submitPassword && emailText && passwordField && confirmPasswordField) {
        submitPassword.addEventListener("click", async () => {
            const email = emailText.value;
            const password = passwordField.value;
            const confirmPassword = confirmPasswordField.value;

            console.log("Submit button clicked. Email:", email);

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                console.log("Response from server:", data);
                alert(data.msg);
                // Optionally, redirect after successful registration
                // window.location.href = 'welcome.html';
            } catch (error) {
                console.error("Error:", error);
                alert('Error registering user');
            }
        });
    } else {
        console.error("One or more elements not found for submitPassword functionality.");
    }

    // Reset password functionality
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            const email = urlParams.get('email');
            const newPassword = document.getElementById('newPassword') ? document.getElementById('newPassword').value : '';
            const message = document.getElementById('message');

            if (!token || !email || !newPassword || !message) {
                console.error("Token, email, new password, or message element not found.");
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token, email, newPassword })
                });

                if (response.ok) {
                    message.textContent = 'Password has been reset successfully!';
                } else {
                    message.textContent = 'Error: Could not reset password. Please try again.';
                }
            } catch (error) {
                console.error('Error:', error);
                message.textContent = 'Error: Could not reset password. Please try again.';
            }
        });
    } else {
        console.log("Reset password form not found.");
    }
});

// Code for login to welcome Page
async function login(event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    // Check if email and password fields are available
    const emailField = document.getElementById('email_address_display');
    const passwordField = document.getElementById('password');

    if (!emailField || !passwordField) {
        console.error("Email or password field not found.");
        return;
    }

    const email = emailField.value;
    const password = passwordField.value;

    // Send login request to the backend
    try {
        const response = await fetch('http://localhost:5000/api/login', {
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
    } catch (error) {
        console.error("Error:", error);
        alert('Error logging in');
    }
}

// Check if loginForm element exists before adding event listener
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', login);
} else {
    console.log("Login form not found.");
}

// Code for forgotten password
document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    const email = document.getElementById('email').value;
    const message = document.getElementById('message');

    if (!email || !message) {
        console.error("Email input or message element not found.");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            message.textContent = 'Password reset link sent to your email.';
        } else {
            const errorText = await response.text();
            message.textContent = `Error: ${errorText}`;
        }
    } catch (error) {
        console.error('Error:', error);
        message.textContent = 'Error: Could not send reset link. Please try again.';
    }
});
