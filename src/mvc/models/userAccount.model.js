import pool from "../../configs/database/cnDB";
import hashText from "../../ultils/hashCode/hashCode";
class User {
    constructor(user) {
        this.user_id = user.user_id;
        this.username = user.username;
        this.password_hash = user.password_hash;
        this.email = user.email;
        this.avatar_url = user.avatar_url || "https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien.jpg";
    }

    async createUser() {
        const sql = 'INSERT INTO Users (username, password_hash, email, avatar_url) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(sql, [this.username, hashText(this.password_hash), this.email, this.avatar_url]);
        return result;
    }

    static async getUserById(user_id) {
        const sql = 'SELECT * FROM Users WHERE user_id = ?';
        const [rows] = await pool.query(sql, [user_id]);
        if (rows.length > 0) {
            return new User(rows[0]);
        } else {
            return null;
        }
    }
    static async getAllUser() {
        const sql = 'SELECT * FROM Users';
        const [rows] = await pool.query(sql);
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }
    }

    static async getUserByName(user_name) {
        const sql = 'SELECT * FROM Users WHERE username = ?';
        const [rows] = await pool.query(sql, [user_name]);
        if (rows.length > 0) {
            return new User(rows[0]);
        } else {
            return null;
        }
    }

    static async checkAccount(data) {
        const sql = 'SELECT * FROM Users WHERE email = ? AND password_hash = ?';
        const [rows] = await pool.query(sql, [data.email, hashText(data.password_hash)]);

        if (rows.length > 0) {
            return new User(rows[0]);
        } else {
            return null;
        }
    }


    static async updateUser(user_id, userData) {
        const sql = 'UPDATE Users SET username = ?, password_hash = ?, email = ?, avatar_url = ? WHERE user_id = ?';
        const [result] = await pool.query(sql, [userData.username, userData.password_hash, userData.email, userData.avatar_url || null, user_id]);
        return result;
    }

    static async deleteUser(user_id) {
        const sql = 'DELETE FROM Users WHERE user_id = ?';
        const [result] = await pool.query(sql, [user_id]);
        return result;
    }
}
export default User;