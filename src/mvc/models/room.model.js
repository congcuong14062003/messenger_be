import pool from "../../configs/database/cnDB";
class Room {
    constructor(room) {
        this.room_id = room.room_id;
        this.room_name = room.room_name || null;
    }

    static async getRoomByMembers(sender_id, receiver_id) {
        try {
            // Truy vấn để lấy room_id chứa cả sender_id và receiver_id
            const query = `
                SELECT room_id 
                FROM PrivateMessages 
                WHERE (sender_id = ${sender_id} AND receiver_id = ${receiver_id}) 
                   OR (sender_id = ${receiver_id} AND receiver_id = ${sender_id}) 
            `;
            const [result] = await pool.query(query);
            if (result.length > 0) {
                return new Room({ room_id: result[0].room_id });
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting room by members:', error);
            return null;
        }
    }

    static async getRoomByIDUser(sender_id, receiver_id) {
        try {
            // Tạo một room mới với room_name null và room_id tự tăng
            const query = `select room_id from PrivateMessages where sender_id = ${sender_id} and receiver_id = ${receiver_id} or sender_id = ${receiver_id} and receiver_id = ${sender_id} group by room_id`;
            const [result] = await pool.query(query);
            return result[0].room_id ?? null;
        } catch (error) {
            console.error('Error creating new room:', error);
            return null;
        }
    }

    static async createNewRoom() {
        try {
            // Tạo một room mới với room_name null và room_id tự tăng
            const query = `INSERT INTO Rooms (room_name) VALUES (null)`;
            const [result] = await pool.query(query);
            const room_id = result.insertId;
            return new Room({ room_id: room_id });
        } catch (error) {
            console.error('Error creating new room:', error);
            return null;
        }
    }

}

export default Room;
