const roomModel = require('../models/room');
const { logger } = require('../utils/logger');
const { roomValidate } = require('../validation/room');

class Room {
    async create (req, res, next) {
      try{
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
          return res.status(200).json(room);
      }  catch (e) {
          logger.error(e);
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
          return res.status(200).json(rooms);
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

