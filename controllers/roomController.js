import * as db from '../db/queries.js'

export async function getAllRooms(req, res) {
    const rooms = await db.getAllRooms();

    res.render('index', { rooms });
}

export async function createRoom(req, res) {
    const departments = await db.getAllDepartments();
    const room_types = await db.getAllRoomTypes();
    res.render('create-room', { departments, room_types });
}

export async function createRoomPost(req, res) {
    const { room_number, capacity, department_id, room_types_ids} = req.body;
    const roomId = await db.createRoom(room_number, capacity, department_id ?? null, room_types_ids ?? null);
    res.redirect(`/room/${roomId}`);
}

export async function getRoom(req, res) {
    const { roomId } = req.params;
    const room = await db.getRoom(roomId);
    const departments = await db.getAllDepartments();
    const room_types = await db.getAllRoomTypes();
    res.render('room', { room, departments, room_types });
}

export async function updateRoomPost(req, res) {
    const { roomId } = req.params;
    const { room_number, capacity, room_types_ids } = req.body;
    const departmentId = req.body.departmentId === '' ? null : Number(req.body.departmentId);

    await db.updateRoom(roomId, room_number, capacity, departmentId, room_types_ids ?? null);

    res.redirect(`/room/${roomId}`);
}

export async function deleteRoom(req, res) {
    const room_id = req.params.roomId;
    await db.deleteRoom(room_id);
    
    res.sendStatus(204);
}


