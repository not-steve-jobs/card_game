var socket = io();
socket.on('createRoom', function(room) {
    var item = document.createElement('h1');
    console.log(room,444)
     item.innerHTML = room.name;
    document.body.appendChild(item);
    socket.emit('join', room);
});
socket.on('joinRoom', function(roomId) {
    console.log(roomId)
});