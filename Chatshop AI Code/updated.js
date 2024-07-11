document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.suggestion').forEach(function(suggestion) {
        suggestion.addEventListener('click', function() {
            const text = suggestion.querySelector('small').textContent;
            fillInput(text);
        });
    });
});

function fillInput(text) {
    document.getElementById('userInput').value = text;
}

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        // Simulate AI response for demonstration
        setTimeout(() => {
            addMessage('This is an AI response to: ' + message, false);
        }, 1000);
        userInput.value = '';
    }
}

function addMessage(text, isUser) {
    const messages = document.getElementById('messages');
    const message = document.createElement('div');
    message.className = 'message' + (isUser ? ' user' : ' ai');
    
    if (!isUser) {
        const aiImage = document.createElement('img');
        aiImage.src = 'Chatshop Icon/robot-with-mobile.png'; // Update this path to your AI image location
        aiImage.className = 'ai-image';
        message.appendChild(aiImage);
    }

    const messageText = document.createElement('span');
    messageText.textContent = text;
    message.appendChild(messageText);

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}
