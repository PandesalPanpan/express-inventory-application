import * as db from '../db/queries.js'

export async function getAllRooms(req, res) {
    const rooms = await db.getAllRooms();

    res.render('index', { rooms });
}

export async function createRoom(req, res) {
    res.render('create-room');
}


