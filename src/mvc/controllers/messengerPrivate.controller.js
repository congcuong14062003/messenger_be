import PrivateMessage from "../models/messengerPrivate.model";
import Room from "../models/room.model";
const sendPrivateMessage = async (req, res) => {
    try {

        const { message_text, user_id } = req.body;
        const receiver_id = req.params.receiver_id;

        if (!message_text || !user_id || !receiver_id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newMessage = await PrivateMessage.createNewMessage({
            sender_id: user_id,
            receiver_id: receiver_id,
            message_text: message_text
        });

        res.status(200).json({ message: 'Private message sent successfully', data: newMessage });
    } catch (error) {
        console.error('Error sending private message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getPrivateMessage = async (req, res) => {
    try {
        const { user_id } = req.body;
        const receiver_id = req.params.receiver_id;
        const room_id = await Room.getRoomByIDUser(user_id, receiver_id);
        if (!room_id) {
            throw new Error("Invalid room ID provided for user " + user_id);
        }
        const data = await PrivateMessage.getMessageByRoomId(room_id);
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'Invalid Message' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error ' + error.message });
    }
}

export { sendPrivateMessage, getPrivateMessage };
