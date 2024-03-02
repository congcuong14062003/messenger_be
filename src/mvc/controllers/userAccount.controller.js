import User from "../models/userAccount.model";
class UserController {
    static async createUser(req, res, next) {
        const newUser = new User(req.body);
        try {
            const result = await newUser.createUser();
            res.status(201).json({ message: 'User created', userId: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getUserById(req, res, next) {
        try {
            const user = await User.getUserById(req.params.user_id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getAllUser(req, res, next) {
        try {
            const user = await User.getAllUser();
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getUserByName(req, res, next) {
        try {
            const user = await User.getUserByName(req.params.name_user);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }



    static async updateUser(req, res, next) {
        try {
            const result = await User.updateUser(req.params.user_id, req.body);
            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'User updated' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async deleteUser(req, res, next) {
        try {
            const result = await User.deleteUser(req.params.user_id);
            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'User deleted' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default UserController;