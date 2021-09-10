let socket = io();

socket.on('createRoom', function(room) {
    let item = document.createElement('div');
    // item.id = "::img";
    item.style.cssText = 'display:inline-block;margin:10px';
    console.log(room,789789)
    let href= 'joinRoom/' + room._id
    item.innerHTML = `<h1><a href=${href}>${room.name}</a></h1>
                       <p>MAX: ${room.max_gamer_count}</p>
                       <p id=count-${room._id}>${room.current_count}</p>`;
    document.body.appendChild(item);
    socket.emit('join', room);
});

socket.on('joinRoom', function(roomId) {
    ++document.getElementById(`count-${roomId}`).innerHTML

});

socket.on('fff', function(room){
    --document.getElementById(`count-${room._id}`).innerHTML
    console.log(document.getElementById(`count-${room._id}`).innerHTML, 777777777)

});
