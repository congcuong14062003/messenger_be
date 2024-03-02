import pool  from '../../configs/database/cnDB'; // Đảm bảo đường dẫn đúng
import Room from './room.model';

class PrivateMessage {
    constructor(privateMessage) {
        this.message_id = privateMessage.message_id;
        this.sender_id = privateMessage.sender_id;
        this.receiver_id = privateMessage.receiver_id;
        this.room_id = privateMessage.room_id;
        this.message_text = privateMessage.message_text;
        this.sent_at = privateMessage.sent_at || null;
    }

    static async createNewMessage(privateMessage) {
        const room_id = await this.getOrCreateRoomId(privateMessage.sender_id, privateMessage.receiver_id);
        // Tạo một tin nhắn mới
        const newMessage = new PrivateMessage({
            message_id: privateMessage.message_id,
            sender_id: privateMessage.sender_id,
            receiver_id: privateMessage.receiver_id,
            room_id: room_id,
            message_text: privateMessage.message_text,
            sent_at: privateMessage.sent_at || null
        });

        // Lưu tin nhắn vào cơ sở dữ liệu
        await this.saveMessageToDatabase(newMessage);

        return newMessage ?? [];
    }

    static async getOrCreateRoomId(sender_id, receiver_id) {
        const existingRoom = await Room.getRoomByMembers(sender_id, receiver_id);

        if (existingRoom) {
            return existingRoom.room_id;
        } else {
            const newRoom = await Room.createNewRoom();
            return newRoom.room_id;
        }
    }

    static async saveMessageToDatabase(message) {
        const query = 'INSERT INTO PrivateMessages (sender_id, receiver_id, room_id, message_text) VALUES (?, ?, ?, ?)';
        const values = [message.sender_id, message.receiver_id, message.room_id, message.message_text];
        await pool.query(query, values);
    }
    static async getMessageByRoomId(room_id) {
        const query = `SELECT * FROM PrivateMessages WHERE room_id = ${room_id} ORDER BY sent_at asc`
        const [result] = await pool.query(query);
        return result ?? [];
    }
}

export default PrivateMessage;
