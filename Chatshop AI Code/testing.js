// document.addEventListener('keydown', function(event) {
//   console.log('Key pressed:', event.key);
//   console.log('Key code:', event.code);
// });






// fecting data from API

// Example GET request
fetch('https://chatshop-bktt.onrender.com/users', {
  method: 'GET',
  headers: {
      'Content-Type': 'application/json',
      // Include any other required headers
  }
})
.then(response => response.json())
.then(data => {
  console.log('GET response:', data); // Process and use the data
})
.catch(error => {
  console.error('Error fetching data:', error);
});

// Example POST request
fetch('https://chatshop-bktt.onrender.com/users', {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
      // Include any other required headers
  },
  body: JSON.stringify({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword'
  })
})
.then(response => response.json())
.then(data => {
  console.log('POST response:', data); // Process and use the created data
})
.catch(error => {
  console.error('Error creating user:', error);
});

// Example PUT request
fetch('https://chatshop-bktt.onrender.com/users/1', { // Replace '1' with the actual user ID
  method: 'PUT',
  headers: {
      'Content-Type': 'application/json',
      // Include any other required headers
  },
  body: JSON.stringify({
      name: 'John Doe Updated',
      email: 'john.doe.updated@example.com'
  })
})
.then(response => response.json())
.then(data => {
  console.log('PUT response:', data); // Process and use the updated data
})
.catch(error => {
  console.error('Error updating user:', error);
});

// Example DELETE request
fetch('https://chatshop-bktt.onrender.com/users/1', { // Replace '1' with the actual user ID
  method: 'DELETE',
  headers: {
      'Content-Type': 'application/json',
      // Include any other required headers
  }
})
.then(response => response.json())
.then(data => {
  console.log('DELETE response:', data); // Process and use the deletion confirmation
})
.catch(error => {
  console.error('Error deleting user:', error);
});





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




// code for AI chat

function sendMessageToBackend(message) {
  const session_key = "your-session-key"; // Replace with your actual session key
  const email = "user@example.com"; // Replace with the user's email

  fetch('http://localhost:3001/api/v1/chat/product-chat', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          session_key: session_key,
          email: email,
          input: message
      })
  })
  .then(response => response.json())
  .then(data => {
      // Check if the response has a 'message' field
      if (data && data.message) {
          addMessage('ai', data.message); // Display the AI's message
      } else {
          console.error('Invalid response from backend:', data);
          addMessage('ai', 'Sorry, there was an error processing your request.');
      }
  })
  .catch(error => {
      console.error('Error sending message to backend:', error);
      addMessage('ai', 'Sorry, there was an error processing your request.');
  });
}