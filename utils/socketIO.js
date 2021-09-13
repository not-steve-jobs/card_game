// const socketIo = require('socket.io')
//
// let io = null
// const sockets = {}
// // const rooms = {}
//
// // const joinRoom = (roomId, userId) => {
// //     console.log(rooms,555)
// //
// //     // rooms[roomId].roomInfo.gamers.push(userId)
// // }
// //
// // const createRoom = (roomId, roomInfo) => {
// //     rooms[roomId] = roomInfo
// // }
//
// const initSocket = (server) => {
//     io = socketIo(server, { cors: { origin: '*' } })
//
//     io.on('connection', (socket) => {
//         console.log('New client connected')
//
//         const { userId } = socket.handshake.query
//         sockets[userId] = socket
//
//         socket.on('disconnect', () => {
//             const userId = Object.keys(sockets).find(key => socket.id === sockets[key].id)
//
//             console.log(`Client disconnected - ${userId}`)
//             delete sockets[userId]
//         })
//     })
// }
//
// const sendMessage = (type = '', message = {}, userIds = []) => {
//     for (const userId of userIds) {
//         const socket = sockets[userId]
//
//         if (socket) {
//             socket.emit(type, message)
//         }
//     }
// }
//
// const isUserOnline = (userId) => {
//     return !!sockets[userId]
// }
//
// module.exports = {
//     joinRoom,
//     initSocket,
//     sendMessage,
//     createRoom
// }