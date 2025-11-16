import * as db from '../db/queries.js'

export async function getAllRooms(req, res) {
    const rooms = await db.getAllRooms();

    res.render('index', { rooms });
}

export async function createRoom(req, res) {
    res.render('create-room');
}

export async function createRoomPost(req, res) {
    const { room_number, capacity, department_id, room_types_ids } = req.body;
    const room = await db.createRoom(room_number, capacity, department_id, room_types_ids);

    res.render('room', { room });
}

export async function getRoom(req, res) {
    const { roomId } = req.params;
    const room = await db.getRoom(roomId);

    res.render('room', { room });
}

export async function updateRoomPost(req, res) {
    const { room_id, room_number, capacity, department_id, room_types_ids } = req.body;
    const room = await db.updateRoom(room_id, room_number, capacity, department_id, room_types_ids);    

    res.render('room', { room });
}

export async function deleteRoom(req, res) {
    const { room_id } = req.body;
    await db.deleteRoom(room_id);

    res.redirect('/');
}


