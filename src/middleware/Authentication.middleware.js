import UserTokenController from "../mvc/controllers/userToken.controller";
import User from "../mvc/models/userAccount.model";
import jwt from "jsonwebtoken";
require("dotenv").config()


// hàm này sửa lại hết 

export async function Authentication(req, res, next) {
    const accessToken = req.headers?.authorization?.split(' ')[1] || req.cookies.accessToken;

    try {
        if (accessToken) {
            req.body.user_id = jwt.decode(accessToken).user_id;
            req.body.access_token = accessToken;
            UserTokenController.login(req, res, next);
        } else {
            const user = await User.checkAccount(req.body);
            if (user) {
                req.body.user_id = user.user_id;
                UserTokenController.login(req, res, next);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

