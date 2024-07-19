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

    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            const userMessage = suggestion.querySelector('small').textContent;
            addMessage('user', userMessage);
            userInput.value = '';
            introText.style.display = 'none'; // Hide introductory text
            document.getElementById('suggestions').style.display = 'none'; // Hide suggestions
            setTimeout(() => {
                const aiMessage = generateAIResponse(userMessage);
                addMessage('ai', aiMessage);
            }, 500); // Simulate AI response delay
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

        // Simulate AI response after 1 second
        setTimeout(() => {
            const aiMessage = generateAIResponse(message);
            addMessage('ai', aiMessage);
        }, 1000);
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

    function generateAIResponse(userMessage) {
        // Placeholder for AI response generation logic
        // You can implement your actual AI response logic here
        return `AI response to: "${userMessage}"`;
    }
});
