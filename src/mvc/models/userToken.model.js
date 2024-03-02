import jwt from 'jsonwebtoken';
import pool from "../../configs/database/cnDB";

class UserToken {
    constructor(userToken) {
        this.token_id = userToken.token_id;
        this.user_id = userToken.user_id;
        this.token = userToken.token;
        this.created_at = userToken.created_at || new Date();
    }

    async save() {
        try {
            const sql = 'INSERT INTO UserTokens (user_id, token) VALUES (?, ?) ON DUPLICATE KEY UPDATE token = VALUES(token)';
            const [result] = await pool.query(sql, [this.user_id, this.token]);
            this.token_id = result.insertId;
            return this;
        } catch (error) {
            console.error('Error saving token:', error);
            throw error;
        }
    }

    static async deleteById(userID) {
        try {
            const sql = 'DELETE FROM UserTokens WHERE user_id = ?';
            await pool.query(sql, [userID]);
        } catch (error) {
            console.error('Error deleting token by ID:', error);
            throw error;
        }
    }

    static async findByUserId(userId) {
        try {
            const sql = 'SELECT * FROM UserTokens WHERE user_id = ?';
            const [results] = await pool.query(sql, [userId]);
            return results.map(result => new UserToken(result));
        } catch (error) {
            console.error('Error finding tokens by user ID:', error);
            throw error;
        }
    }

    static async createTokens(userId, accessTokenOld) {
        try {
            let accessToken, refreshToken;
            const userDetailsQuery = 'SELECT user_id, username, email, password_hash FROM Users WHERE user_id = ?';
            const [userDetails] = await pool.query(userDetailsQuery, [userId]);

            if (userDetails.length === 0) {
                throw new Error('User not found.');
            }

            const user = userDetails[0];
            const payload = {
                user_id: user.user_id,
                username: user.username,
                email: user.email
            };

            const [existingToken] = await this.findByUserId(userId);
            if (existingToken?.token) { // nếu có id_user này thì
                if (this.isTokenExpired(existingToken.token)) { // kiểm tra rftk còn hạn k, nếu hết
                    accessToken = jwt.sign(payload, user.password_hash, { expiresIn: '30m' }); // tạo ac và rf mới
                    refreshToken = jwt.sign(payload, user.password_hash, { expiresIn: '1d' });
                    await this.updateRefreshToken(userId, refreshToken); // update the refresh token
                } else { // nếu còn hạn
                    if (this.isTokenExpired(accessTokenOld)) {
                        accessToken = jwt.sign(payload, user.password_hash, { expiresIn: '30m' }); // tạo ac và rf mới
                    } else {
                        accessToken = accessTokenOld;
                        
                    }
                    refreshToken = existingToken.token;
                }
            } else {
                accessToken = jwt.sign(payload, user.password_hash, { expiresIn: '30m' });
                refreshToken = jwt.sign(payload, user.password_hash, { expiresIn: '1d' });
                await this.saveRefreshToken(userId, refreshToken);
            }

            return { accessToken, refreshToken };
        } catch (error) {
            console.error('Error creating tokens:', error);
            throw error;
        }
    }


    static async saveRefreshToken(userId, refreshToken) {
        try {
            const newToken = new UserToken({
                user_id: userId,
                token: refreshToken
            });
            await newToken.save();
        } catch (error) {
            console.error('Error saving refresh token:', error);
            throw error;
        }
    }
    static async updateRefreshToken(userId, refreshToken) {
        try {
            const sql = 'UPDATE UserTokens SET token = ? WHERE user_id = ?';
            await pool.query(sql, [refreshToken, userId]);
        } catch (error) {
            console.error('Error updating refresh token:', error);
            throw error;
        }
    }

    static isTokenExpired(token) {
        try {
            const decoded = jwt.decode(token);
            if (!decoded) {
                throw new Error('Unable to decode token.');
            }
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                return true; // Token đã hết hạn
            }

            return false; // Token chưa hết hạn
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    }

    
}

export default UserToken;
