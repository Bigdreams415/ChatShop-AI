document.addEventListener("DOMContentLoaded", function() {
    // Menu toggle for mobile devices
    const menuToggle = document.getElementById("menuToggle");
    const hiddenContent = document.getElementById("hiddenContent");
    const sideBar = document.querySelector(".side-bar");

    if (menuToggle && hiddenContent && sideBar) {
        menuToggle.addEventListener("click", function() {
            if (sideBar.classList.contains("collapsed")) {
                hiddenContent.style.display = "block";
            } else {
                hiddenContent.style.display = "none";
            }
            sideBar.classList.toggle("collapsed");
        });
    }

    const suggestions = document.querySelectorAll('.suggestion');
    const messagesContainer = document.getElementById('messages');
    const userInput = document.getElementById('userInput');
    const introText = document.querySelector('.intro-text');

    // Retrieve email and sessionKey from sessionStorage
    let sessionKey = sessionStorage.getItem('session_key');
    const email = sessionStorage.getItem('email');

    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            const userMessage = suggestion.querySelector('small').textContent;
            addMessage('user', userMessage);
            userInput.value = '';
            introText.style.display = 'none'; // Hide introductory text
            document.getElementById('suggestions').style.display = 'none'; // Hide suggestions
            sendMessage(userMessage);
        });
    });

    userInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    sendButton.addEventListener('click', sendMessage);

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage('user', message);
            userInput.value = '';
            document.querySelector('.main-bar-chat-area h3').style.display = 'none';
            document.getElementById('suggestions').style.display = 'none';

            if (!sessionKey) {
                initializeChatSession(message);
            } else {
                sendMessageToBackend(message);
            }
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
        fetch('https://chatshop.eastus2.cloudapp.azure.com/v1/chat/product-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_key: sessionKey,
                email: email,
                input: message
            }),
            timeout: 60000
        })
        .then(response => response.json())
        .then(data => {
            console.log('Backend response:', data);

            if (data && data.products) {
                displayProducts(data.products); // Display the products
            }
            if (data && data.message) {
                addMessage('ai', data.message); // Display the AI's message
            } else if (!data.products) {
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
        fetch('https://chatshop.eastus2.cloudapp.azure.com/v1/chat/product-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({      
                email: email,
                input: message
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Session initialization response:', data);

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

    // Settings popup and recent chats

    // Get the elements
    var popup = document.getElementById("settings-popup");
    var btn = document.getElementById("settings-button");
    var span = document.getElementById("close-popup");
    var themeSelect = document.getElementById("theme");
    var notificationsCheckbox = document.getElementById("notifications");
    var body = document.getElementById("body");

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
    const url = `https://chatshop.eastus2.cloudapp.azure.com/v1/chat/chats/${encodeURIComponent(email)}/${encodeURIComponent(sessionKey)}/`;
    console.log('Fetching URL:', url);
  
    fetch(url, { method: 'GET' })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    }

    // Close the popup
    if (span) {
        span.onclick = function() {
            popup.style.display = "none";
        }
    }

    // Close the popup if clicking outside of it
    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = "none";
        }
    }

    // Handle theme change
    if (themeSelect) {
        themeSelect.onchange = function() {
            if (themeSelect.value === "dark") {
                body.classList.add("dark-mode");
            } else {
                body.classList.remove("dark-mode");
            }
        }
    }

    // Handle notifications toggle (example)
    if (notificationsCheckbox) {
        notificationsCheckbox.onchange = function() {
            if (notificationsCheckbox.checked) {
                console.log("Notifications Enabled");
            } else {
                console.log("Notifications Disabled");
            }
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
        if (sidebar) {
            sidebar.innerHTML = ''; // Clear previous chats
            chats.forEach(chat => {
                console.log('Chat object:', chat); // Log the chat object to inspect its structure
                const chatPreview = document.createElement('li');
                const chatTitle = document.createElement('h3');
                chatTitle.textContent = chat.title || 'No Title';
                chatPreview.appendChild(chatTitle);
                sidebar.appendChild(chatPreview);
            });
        } else {
            console.error('Sidebar element not found!');
        }
    }

    if (email && sessionKey) {
        fetchRecentChats(email, sessionKey);
    }
});
