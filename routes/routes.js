const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

const User = require('../controller/user');
const Room = require('../controller/room');

//User routes
router.post('/signup', User.signup);
router.post('/login', User.login);
router.get('/confirm/:id', User.verify);


//Room routes
router.post('/create', auth, Room.create);
router.delete('/delete/:id', Room.delete);
router.get('/', Room.getAllRooms);
router.get('/getRoom/:id', Room.getRoom);
router.post('/joinRoom/:roomId', Room.joinRoom);


module.exports = router;