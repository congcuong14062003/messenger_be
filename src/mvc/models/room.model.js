import pool from "../../configs/database/cnDB";
class Room {
    constructOR(room) {
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
        } catch (errOR) {
            console.errOR('ErrOR getting room by members:', errOR);
            return null;
        }
    }

    static async getRoomByIDUser(sender_id, receiver_id) {
        try {
            // Tạo một room mới với room_name null và room_id tự tăng
            const query = `SELECT room_id FROM PrivateMessages WHERE sender_id = ${sender_id} AND receiver_id = ${receiver_id} OR sender_id = ${receiver_id} AND receiver_id = ${sender_id} GROUP BY room_id`;
            const [result] = await pool.query(query);
            return result[0].room_id ?? null;
        } catch (errOR) {
            console.errOR('ErrOR creating new room:', errOR);
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
        } catch (errOR) {
            console.errOR('ErrOR creating new room:', errOR);
            return null;
        }
    }

}

export default Room;
