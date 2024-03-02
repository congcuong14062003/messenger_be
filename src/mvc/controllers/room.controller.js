import Room from "../models/room.model";

class RoomController {
    // Create a new room
    static async createRoom(req, res) {
        try {
            const newRoomId = await Room.save(req.body);
            res.status(201).json({ room_id: newRoomId, message: 'Room created' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    // Get all rooms
    static async getAllRooms(req, res) {
        try {
            const rooms = await Room.findAll();
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    // Get room by ID
    static async getRoomById(req, res) {
        try {
            const roomId = req.params.roomId;
            const room = await Room.findById(roomId);
            if (room) {
                res.status(200).json(room);
            } else {
                res.status(404).json({ message: 'Room not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    // Update room by ID
    static async updateRoomById(req, res) {
        try {
            const roomId = req.params.roomId;
            await Room.updateById(roomId, req.body);
            res.status(200).json({ message: 'Room updated' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    // Delete room by ID
    static async deleteRoomById(req, res) {
        try {
            const roomId = req.params.roomId;
            await Room.deleteById(roomId);
            res.status(200).json({ message: 'Room deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}

export default RoomController;
