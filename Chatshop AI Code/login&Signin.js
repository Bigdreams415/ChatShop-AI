document.addEventListener("DOMContentLoaded", function() {
    const emailStep = document.getElementById("emailStep");
    const passwordStep = document.getElementById("passwordStep");
    const continueEmail = document.getElementById("continueEmail");
    const editEmail = document.getElementById("editEmail");
    const emailText = document.getElementById("email_address_display");
    const emailInput = document.getElementById("email_address");
    const submitPassword = document.getElementById("submitPassword");

    console.log("Document is ready");

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
    const passwordField = document.getElementById("password");

    if (togglePassword) {
        togglePasswordVisibility(togglePassword, passwordField);
    }

    // Login event listener
    if (submitPassword) {
        submitPassword.addEventListener("click", async () => {
            const email = emailText.value;
            const password = passwordField.value;

            console.log("Submit button clicked. Email:", email);

            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                console.log("Response from server:", data);

                if (res.ok) {
                    alert(data.msg);
                    sessionStorage.setItem('email', email);
                    sessionStorage.setItem('username', data.username);
                    window.location.href = 'welcome.html';
                } else {
                    alert(data.msg);
                }
            } catch (error) {
                console.error("Error:", error);
                alert('Error logging in');
            }
        });
    }
});

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
