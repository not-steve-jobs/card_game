let socket = io();

socket.on('createRoom', function(room) {
    console.log('createRoom socket - - -')
    document.getElementById(`count-${room._id}`).innerHTML = room.current_count
});

socket.on('joinRoom', function({room,length}) {
   document.getElementById('currentCount').innerHTML = length;
    console.log(room._id,777)
    document.getElementById(`count-${room._id}`).innerHTML = length


});

socket.on('leave', function ({room,length}){
    if(room && length) {
        document.getElementById(`count-${room._id}`).innerHTML = length
    }

});

socket.on('leaveRoom', function ({room,length}){
    console.log('leaveRoom')
    console.log(room,666)
    console.log(length,888)
    if(length && document.getElementById('currentCount')) {
        console.log(62020)
        console.log(document.getElementById('currentCount'))
        document.getElementById('currentCount').innerHTML = length;
    }
});
