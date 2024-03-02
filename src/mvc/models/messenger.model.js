import { pool } from '../../configs/database/cnDB'; // Ensure the correct path

class Message {
    constructor(message) {
        this.message_id = message.message_id;
        this.sender_id = message.sender_id;
        this.room_id = message.room_id;
        this.message_text = message.message_text;
        this.sent_at = message.sent_at;
    }

   
}

export default Message;
