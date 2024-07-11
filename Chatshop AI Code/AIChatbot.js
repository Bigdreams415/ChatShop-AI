// AIChatbot.js

function fillInput(text) {
    document.getElementById('userInput').value = text;
}

function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() !== '') {
        addMessage(userInput, true);
        document.getElementById('userInput').value = '';

        // Simulate AI response after 1 second
        setTimeout(() => {
            addMessage('This is an AI response.', false);
        }, 1000);
    }
}

function addMessage(text, isUser) {
    const messages = document.getElementById('messages');
    const message = document.createElement('div');
    message.className = 'message' + (isUser ? ' user' : ' ai');
    
    if (!isUser) {
        const aiImage = document.createElement('img');
        aiImage.src = 'Chatshop Icon/robot-with-mobile.png'; // Replace with the correct path to your AI image
        aiImage.className = 'ai-image';
        message.appendChild(aiImage);
    }

    const messageText = document.createElement('span');
    messageText.textContent = text;
    message.appendChild(messageText);

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}
