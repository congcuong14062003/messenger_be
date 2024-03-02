const { Authentication } = require("../../middleware/Authentication.middleware");
const { sendPrivateMessage, getPrivateMessage } = require("../../mvc/controllers/messengerPrivate.controller");

// chatroom.router.js
const RouterChatRoom = (router) => {
    ///chat solo
    router.post('/partner/:receiver_id', Authentication  ,sendPrivateMessage);
    router.get('/message/:receiver_id', Authentication, getPrivateMessage)
    //chat teams
    // router.get('/signup', (req, res) => {
    //     res.render('signup/signup');
    // });
    
    return router; // Add this line to return the router
}

module.exports = RouterChatRoom;
