import { default as UserController } from "../../mvc/controllers/userAccount.controller";

// chatroom.router.js
const ListAllUser = (router) => {
    ///chat solo
    router.get('/list_user', UserController.getAllUser);
    router.get('/list_user/:user_id', UserController.getUserById);
    
    return router; // Add this line to return the router
}


export default ListAllUser;
