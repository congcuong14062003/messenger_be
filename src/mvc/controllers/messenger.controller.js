import Message from "../models/messenger.model";

class MessageController {
    // Create a new message
    static async createMessage(req, res) {
        try {
            const newMessageId = await Message.save(req.body);
            res.status(201).json({ message_id: newMessageId, message: 'Message created' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    // Get all messages
    static async getAllMessages(req, res) {
        try {
            const messages = await Message.findAll();
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    // Get message by ID
    static async getMessageById(req, res) {
        try {
            const messageId = req.params.messageId;
            const message = await Message.findById(messageId);
            if (message) {
                res.status(200).json(message);
            } else {
                res.status(404).json({ message: 'Message not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    // Update message by ID
    static async updateMessageById(req, res) {
        try {
            const messageId = req.params.messageId;
            await Message.updateById(messageId, req.body);
            res.status(200).json({ message: 'Message updated' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    // Delete message by ID
    static async deleteMessageById(req, res) {
        try {
            const messageId = req.params.messageId;
            await Message.deleteById(messageId);
            res.status(200).json({ message: 'Message deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}

export default MessageController;
