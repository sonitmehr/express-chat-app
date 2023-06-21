const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const socket = io();

const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix : true,
});

// Join chatroom

socket.emit('joinRoom',{username,room});

// Bot message

socket.on('botMessage',message => {
    outputBotMessage(message);
});

// This is how we catch a message sent from server using emit method.
socket.on('message',message => {
    console.log(message);
    outputMessage(message,0);

    // Scroll to bottom-most message when we recieve a new message.
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Current user sends message - Green background
socket.on('sendMessage',message => {
    console.log(message);
    outputMessage(message,1);

    // Scroll to bottom-most message when we recieve a new message.
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Change room users and room name


socket.on('roomUsers',({room,users}) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message submit 
chatForm.addEventListener('submit',(e) =>{
    e.preventDefault();
    
    // Getting message in input feild.
    const msg = e.target.elements.msg.value;

    // Emitting towards server.
    socket.emit('chatMessage',msg);

    // Clear input feild
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

// Output message to DOM
function outputMessage(message,val){
    const div = document.createElement('div');
    // div.classList.add('talk-bubble');
    //   div.classList.add('triangle');
       
    //     div.classList.add('black-color');

    // const divChild = document.createElement("div");
    // divChild.classList.add("talktext");
    // divChild.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    // <p class="text">${message.text} </p>`;
    // div.appendChild(divChild);


    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text} </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){
    document.getElementById('room-name').innerText = room;
}
function outputUsers(users){

    for(var i = 0;i<users.length;i++){
        const div = document.getElementById('users');
        div.innerHTML = `
            ${users.map(user => `<li>${user.username}</li>`).join('')}
        `;
    }
    
}
function outputBotMessage(message){
    const div = document.createElement('div');
     div.classList.add('bot-message');
     div.classList.add('center-bot');

    div.innerHTML = `<p class="meta">${message} </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}