// authentication.router.js

import { Authentication } from "../../middleware/Authentication.middleware";
import UserController from "../../mvc/controllers/userAccount.controller";
import UserTokenController from "../../mvc/controllers/userToken.controller";

const RouterAuth = (router) => {
    // router.get('/', UserController.);
    router.post('/', Authentication, (req, res, next) => {
        res.status(200).json({ messenger: "oke" });
    });
    router.post('/signup', UserController.createUser);    
    router.post('/logout', Authentication, UserTokenController.logout);

    return router; // Add this line to return the router
}

module.exports = RouterAuth;
