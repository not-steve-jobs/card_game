const roomModel = require('../models/room');
const { logger } = require('../utils/logger');
const { roomValidate } = require('../validation/room');
const {get,set} = require('../utils/cache')


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

            //Socket
            const io = req.app.get('io');
            io.emit('createRoom', room);

            // const temp = io.sockets.adapter.rooms;
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
            }

            const io = req.app.get('io');
            const socket = req.app.get('socketio');
            socket.join(room._id);
            const clients = io.sockets.adapter.rooms[room._id];

            io.sockets.to(room._id).emit('joinRoom',{
                roomId:room,
                length:clients.length
            });
            room.current_count = clients.length;
            await room.save();

            set( "currentRoom", room, 10000 );
            set( "length", clients.length, 10000 );

            io.emit('createRoom', room)

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