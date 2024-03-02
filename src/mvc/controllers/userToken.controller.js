import UserToken from "../models/userToken.model";

class UserTokenController {
    // Tạo token mới khi đăng nhập
    static async login(req, res, next) {
        try {
            const user_id = req.body.user_id; // Giả sử userId được gửi từ client
            const access_token = req.body.access_token || null; // Giả sử userId được gửi từ client

            // Tạo token mới
            const tokens = await UserToken.createTokens(user_id, access_token); // xử lý token
            if (!tokens) {
                return res.status(400).json({ message: 'Cannot create tokens.' });
            }
            // Gán cookies cho client 
            res.cookie('accessToken', tokens.accessToken, { maxAge: 4 * 24 * 3600 * 1000, httpOnly: false, secure: true });
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Xoá token khi đăng xuất
    static async logout(req, res) {
        try {
            const { user_id } = req.body; // Giả sử user_id được gửi từ client

            // Xoá token
            await UserToken.deleteById(user_id);
            res.clearCookie("accessToken");
            res.json({ message: 'Logged out successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Tái tạo token khi cần
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body; // Giả sử refreshToken được gửi từ client

            // Kiểm tra xem refreshToken có hết hạn không
            if (UserToken.isTokenExpired(refreshToken)) {
                return res.status(401).json({ message: 'Refresh token expired.' });
            }

            // Decode refreshToken để lấy userId
            const decoded = jwt.decode(refreshToken);
            const userId = decoded.user_id;

            // Tạo token mới
            const tokens = await UserToken.createTokens(userId);

            if (!tokens) {
                return res.status(400).json({ message: 'Cannot create tokens.' });
            }

            // Gửi token mới trở lại cho client
            res.json(tokens);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

export default UserTokenController;
