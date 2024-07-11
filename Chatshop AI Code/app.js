function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() !== '') {
        addMessage(userInput, true);
        document.getElementById('userInput').value = '';

        // Simulate AI response after 1 second
        setTimeout(() => {
            addMessage('AI Response', false);
        }, 1000);
    }
}

function addMessage(text, isUser) {
    const messages = document.getElementById('messages');
    const message = document.createElement('div');
    message.className = 'message' + (isUser ? ' user' : '');
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}
