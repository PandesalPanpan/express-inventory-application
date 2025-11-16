import * as db from '../db/queries.js'

export async function getAllRooms(req, res) {
    const rooms = await db.getAllRooms();

    res.render('index', { rooms });
}

export async function createRoom(req, res) {
    res.render('create-room');
}

export async function getRoom(req, res) {
    const { roomId } = req.params;
    const room = await db.getRoom(roomId);

    res.render('room', { room });
}
