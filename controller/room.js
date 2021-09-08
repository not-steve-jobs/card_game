const roomModel = require('../models/room');
const { logger } = require('../utils/logger');
const { roomValidate } = require('../validation/room');


class Room {
    async create (req, res, next) {
      try{
          const io = req.app.get('socketio');

          const {error, value} = roomValidate(req.body);
          if (error){
              logger.error('ValidationError', error.message);
              return res.status(400).json({
                  message: error
              });
          };

          logger.info('Room creat started - - -');
          const room = new roomModel({
              ...value,
              userId:req.user._id
          });
          await room.save();
          logger.info('Room creat ended - - -');

          //Socket
          io.emit('createRoom', room);
          io.to(room._id);
          io.emit('joinRoom',room._id);

          const temp = io.sockets.adapter.rooms;

          console.log(temp,555)

          return res.status(200).json(room);
      }  catch (e) {
          logger.error(e);
          next(e);
      };
    };

    async joinRoom (req, res, next) {
        try{
            const { roomId:id } = req.params;
            const room = await roomModel.findById(id);
            if (!room){
                return res.status(404).json({
                    message: 'Room not found'
                });
            };

            //Socket
            const io = req.app.get('socketio');
            io.to(room._id);
            io.emit('joinRoom',room._id);

            return res.status(200).json(room);
        }  catch (e) {
            next(e);
        };
    };

    async delete (req, res, next) {
        try{
            // io.on('connection', (socket) => {
            //
            //     // give each socket a random identifier so that we can determine who is who when
            //     // we're sending messages back and forth!
            //     socket.id = uuid();
            //     console.log('a user connected');
            //
            //     /**
            //      * Gets fired when a player leaves a room.
            //      */
            //     socket.on('leaveRoom', () => {
            //         leaveRooms(socket);
            //     });
            //
            //     /**
            //      * Gets fired when a player disconnects from the server.
            //      */
            //     socket.on('disconnect', () => {
            //         console.log('user disconnected');
            //         leaveRooms(socket);
            //     });
            // });


            const { id } = req.params;
            const room = await roomModel.findById(id);
            if (!room){
                return res.status(404).json({
                    message: 'Room not found'
                });
            } else if (room.userId != req.user._id){
                return res.status(406).json({
                    message: 'not acceptable'
                });
            };
            await roomModel.deleteOne({
                _id: room._id
            });
            return res.status(204).json({
                message: 'Room deleted'
            });
        }  catch (e) {
            next(e);
        };
    };

    async getAllRooms (req, res, next) {
      try{
          // io.on('connection', (socket) => {
          //     console.log(789)
          //     // give each socket a random identifier so that we can determine who is who when
          //     // we're sending messages back and forth!
          //     socket.id = uuid();
          //     console.log('a user connected');
          //
          //     /**
          //      * Gets fired when someone wants to get the list of rooms. respond with the list of room names.
          //      */
          //     socket.on('getRoomNames', (data, callback) => {
          //         const roomNames = [];
          //         for (const id in rooms) {
          //             const {name} = rooms[id];
          //             const room = {name, id};
          //             roomNames.push(room);
          //         }
          //
          //         callback(roomNames);
          //     });
          // });

          const rooms = await roomModel.find({});
          // return res.status(200).json(rooms);
          return res.render('getAllRooms',{
              rooms
          })
      }  catch (e) {
          next(e);
      };
    };

    async getRoom (req, res, next) {
        try{
            // io.on('connection', (socket) => {
            //
            //     // give each socket a random identifier so that we can determine who is who when
            //     // we're sending messages back and forth!
            //     socket.id = uuid();
            //     console.log('a user connected');
            //
            //     /**
            //      * Gets fired when a player has joined a room.
            //      */
            //     socket.on('joinRoom', (roomId, callback) => {
            //         const room = rooms[roomId];
            //         joinRoom(socket, room);
            //         callback();
            //     });
            // });

            const { id } = req.params;
            const room = await roomModel.findById(id);
            if (!room){
                return res.status(404).json({
                    message: 'Room not found'
                });
            };

            return res.status(200).json(room);
        }  catch (e) {
            next(e);
        };
    };

};

module.exports = new Room();