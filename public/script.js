let socket = io();
socket.on('createRoom', function(room) {
    let item = document.createElement('div');
    // item.id = "::img";
    item.style.cssText = 'display:inline-block;margin:10px';
    console.log(room,789789)
    let href= 'joinRoom/' + room._id
    item.innerHTML = `<h1><a href=${href}>${room.name}</a></h1>
                       <p>MAX: ${room.max_gamer_count}</p>
                       <p id="count">NOW: ${room.current_count}</p>`;
    document.body.appendChild(item);
    socket.emit('join', room);
});

socket.on('joinRoom', function(roomId) {
    const p = document.getElementById('count').innerHTML;
    document.getElementById('count').innerHTML = +p + 1;
});

// socket.on("disconnect", function(room) {
//     const p = document.getElementById('count').innerHTML;
//     document.getElementById('count').innerHTML = +p - 1;
// });
socket.on('leaveRoom', function (room){
    // console.log(room._id)
    // const p = document.getElementById('count')
    // document.getElementById('count').innerHTML = +p - 1;
})

socket.on("connect_error", () => {
    socket.auth.token = "abcd";
    socket.connect();
});
