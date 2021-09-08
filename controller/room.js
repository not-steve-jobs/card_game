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
            } else if (room.now_gamer_count === room.max_gamer_count){
                return res.status(406).json({
                    message: 'This Room is Full'
                });
            } else {
                room.now_gamer_count++;
                if (room.now_gamer_count === room.max_gamer_count){
                    room.possibility = false;
                };
            };

            //Socket
            const io = req.app.get('socketio');
            io.to(room._id);
            io.emit('joinRoom',room._id);

            // return res.status(200).json(room);
            return res.render('joinRoom',{
                room
            })
        }  catch (e) {
            next(e);
        };
    };

    async delete (req, res, next) {
        try{
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