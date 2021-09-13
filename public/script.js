let socket = io();

socket.on('createRoom', function(room) {
    document.getElementById(`count-${room._id}`).innerHTML = room.current_count
});

socket.on('joinRoom', function({room,length}) {
   document.getElementById('currentCount').innerHTML = length;
    document.getElementById(`count-${room._id}`).innerHTML = length
});

socket.on('leave', function ({room,length}){
    if(room && length) {
        document.getElementById(`count-${room._id}`).innerHTML = length
    }

});

socket.on('leaveRoom', function ({room,length}){
    if(length && document.getElementById('currentCount')) {
        document.getElementById('currentCount').innerHTML = length;
    }
});
