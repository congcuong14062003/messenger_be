// router.js
import RouterAuth from './Authentication/authentication.router';
import RouterChatRoom from './ChatRoom/chatroom.router';
import { Router } from 'express';
import ListAllUser from './ListAllUser/listalluser.router';
// Change the signature of RouterMain to accept a router
const RouterMain = (router) => {
    // Use router instead of 'express.Router()'
    router.get('/', (req, res) => {
        
    });
    router.use('/auth', RouterAuth(Router()));
    router.use('/chatroom', RouterChatRoom(Router()));
    router.use('/list', ListAllUser(Router()));    
    return router;
}
export default RouterMain;
