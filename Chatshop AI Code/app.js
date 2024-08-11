document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.getElementById("menuToggle");
    const hiddenContent = document.getElementById("hiddenContent");
    const sideBar = document.querySelector(".side-bar");

    menuToggle.addEventListener("click", function() {
        if (sideBar.classList.contains("collapsed")) {
            hiddenContent.style.display = "block";
        } else {
            hiddenContent.style.display = "none";
        }
        sideBar.classList.toggle("collapsed");
    });

    const suggestions = document.querySelectorAll('.suggestion');
    const messagesContainer = document.getElementById('messages');
    const userInput = document.getElementById('userInput');
    const introText = document.querySelector('.intro-text');

    // Retrieve email from sessionStorage
    let sessionKey = sessionStorage.getItem('session_key');
    const email = sessionStorage.getItem('email');

    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            const userMessage = suggestion.querySelector('small').textContent;
            addMessage('user', userMessage);
            userInput.value = '';
            introText.style.display = 'none'; // Hide introductory text
            document.getElementById('suggestions').style.display = 'none'; // Hide suggestions
            sendMessageToBackend(userMessage);
        });
    });

    userInput.addEventListener('keydown', function(event) {
        if (event.keyCode === 13) { // Check if Enter key is pressed
            if (!event.shiftKey && userInput.value.trim() !== '') {
                event.preventDefault(); // Prevent default Enter key behavior (new line)
                sendMessage(userInput.value.trim());
            }
        }
    });

    function sendMessage(message) {
        addMessage('user', message);
        userInput.value = '';
        document.querySelector('.main-bar-chat-area h3').style.display = 'none'; // Hide introductory text
        document.getElementById('suggestions').style.display = 'none'; // Hide suggestions

        if (!sessionKey) {
            initializeChatSession(message);
        } else {
            sendMessageToBackend(message);
        }
    }

    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        const contentElement = document.createElement('div');
        contentElement.classList.add('content');
        contentElement.textContent = message;
        messageElement.appendChild(contentElement);
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
    }

    function sendMessageToBackend(message) {
        fetch('/api/v1/chat/product-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_key: sessionKey,
                email: email,
                input: message
            })
        })
        .then(response => response.json())
        .then(data => {
            // Check if the response has a 'products' field
            if (data && data.products) {
                displayProducts(data.products); // Display the products
            }
            // Check if the response has a 'message' field
            if (data && data.message) {
                addMessage('ai', data.message); // Display the AI's message
            } else if (!data.products) {
                // Display error message if neither products nor message are present
                console.error('Invalid response from backend:', data);
                addMessage('ai', 'Sorry, there was an error processing your request.');
            }

            // Update session key if present in response
            if (data && data.session_key) {
                sessionKey = data.session_key;
                sessionStorage.setItem('session_key', sessionKey);
            }
        })
        .catch(error => {
            console.error('Error sending message to backend:', error);
            addMessage('ai', 'Sorry, there was an error processing your request.');
        });
    }

    function displayProducts(products) {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');

            productElement.innerHTML = `
                <h2>${product.title}</h2>
                <img src="${product.image}" alt="${product.title}" />
                <p>Rating: ${product.rating} (${product.number_of_ratings} ratings)</p>
                <p>Price: ${product.price}</p>
                <p>Shipping: ${product.shipping ? product.shipping : 'Not available'}</p>
                <p>Source: ${product.source}</p>
                <a href="${product.url}" target="_blank" class="url-card">View Product</a>
            `;

            messagesContainer.appendChild(productElement);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
    }

    function initializeChatSession(message) {
        // Fetch session key from backend or initialize session if not present
        fetch('/api/v1/chat/product-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({      
                email: email,
                input: message // Initialize the session with the user's first message
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.session_key) {
                sessionKey = data.session_key;
                sessionStorage.setItem('session_key', sessionKey);
                if (data.message) {
                    addMessage('ai', data.message); // Display the AI's initial message
                }
            } else {
                console.error('Error initializing chat session:', data);
            }
        })
        .catch(error => {
            console.error('Error initializing chat session:', error);
        });
    }
});



// Get the elements
var popup = document.getElementById("settings-popup");
var btn = document.getElementById("settings-button");
var span = document.getElementById("close-popup");
var themeSelect = document.getElementById("theme");
var notificationsCheckbox = document.getElementById("notifications");
var body = document.getElementById("body");

// Open the popup
btn.onclick = function() {
    popup.style.display = "block";
}

// Close the popup
span.onclick = function() {
    popup.style.display = "none";
}

// Close the popup if clicking outside of it
window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none";
    }
}

// Handle theme change
themeSelect.onchange = function() {
    if (themeSelect.value === "dark") {
        body.classList.add("dark-mode");
    } else {
        body.classList.remove("dark-mode");
    }
}

// Handle notifications toggle (example)
notificationsCheckbox.onchange = function() {
    if (notificationsCheckbox.checked) {
        console.log("Notifications Enabled");
    } else {
        console.log("Notifications Disabled");
    }
}




// Recent chat

// Function to fetch and display recent chats
function fetchRecentChats(email, sessionKey) {
    const url = `/api/v1/chat/chats/${encodeURIComponent(email)}/${encodeURIComponent(sessionKey)}/`;
    console.log('Fetching URL:', url);
  
    fetch(url, { method: 'GET' })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('API Response:', data);
        if (Array.isArray(data)) {
          displayRecentChats(data);
        } else {
          console.error('Expected an array but got:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching recent chats:', error);
      });
  }
  
  // Function to display recent chats in the sidebar
  function displayRecentChats(chats) {
    const sidebar = document.getElementById('recent-chats');
    sidebar.innerHTML = ''; // Clear previous chats
    chats.forEach(chat => {
      console.log('Chat object:', chat); // Log the chat object to inspect its structure
      const chatPreview = document.createElement('li');
      const chatLink = document.createElement('a');
      chatLink.href = '#';
      
      // Use the first message in the history as the preview
      const previewMessage = chat.history && chat.history[0] && chat.history[0].parts[0].text || 'No message preview';
      chatLink.innerText = previewMessage; // Use the first message text as preview
      chatPreview.appendChild(chatLink);
      chatPreview.addEventListener('click', () => openChat(chat));
      sidebar.appendChild(chatPreview);
    });
  }
  
  // Function to open a full chat conversation
  function openChat(chat) {
    console.log('Opening chat:', chat);
    const chatWindow = document.getElementById('messages');
    chatWindow.innerHTML = ''; // Clear previous chat content

    const messages = chat.history || []; // Assuming history contains the messages

    if (Array.isArray(messages)) {
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');

            if (message.role === 'user') {
                messageElement.classList.add('user'); // Add user class for user messages
            } else if (message.role === 'model') {
                messageElement.classList.add('ai'); // Add ai class for AI messages
            }

            const contentElement = document.createElement('div');
            contentElement.classList.add('content');
            const messageText = message.parts[0] && message.parts[0].text || 'No message content'; // Assuming parts[0] has the text
            contentElement.innerText = messageText;

            messageElement.appendChild(contentElement);
            chatWindow.appendChild(messageElement);
        });
    } else {
        console.error('history is not an array:', messages);
    }
}

  
  // Example usage: Fetch recent chats when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    const email = sessionStorage.getItem('email'); // Get email from session storage
    const sessionKey = sessionStorage.getItem('session_key'); // Get session key from session storage
    console.log('Email:', email);
    console.log('Session Key:', sessionKey);
    if (email && sessionKey) {
      fetchRecentChats(email, sessionKey);
    } else {
      console.error('Email or session key not found in session storage');
    }
  });
  


//   document.addEventListener("DOMContentLoaded", function() {
    // Check if email and username exist in sessionStorage
    // const email = sessionStorage.getItem('email');
    // const username = sessionStorage.getItem('username'); // Assuming you also store a username

    // if (!email || !username) {
        // Redirect to login.html if either is not found
    //     window.location.href = 'login.html';
    // }
    
    // Rest of your code goes here
// });



// Menu toggle for mobile device

document.getElementById('menuToggle').addEventListener('click', function() {
    document.querySelector('.side-bar').classList.toggle('active');
});
