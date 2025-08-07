document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    const chatBox = document.getElementById('chat-box');

    sendBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message !== '') {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.textContent = 'You: ' + message;
            chatBox.appendChild(messageDiv);
            messageInput.value = '';
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    });
});
