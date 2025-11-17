import * as db from '../db/queries.js'
import { body, validationResult } from 'express-validator';



// { room_number, capacity, department_id, room_types_ids} = req.body;
const validateRoom = [
    body("room_number").trim()
        .isInt().withMessage("Room Number must be a number.")
        .isLength({ min: 3 }).withMessage("Room number must be atleast 3 numbers.")
        .toInt(),
    body("capacity").trim()
        .isInt({ min: 1 }).withMessage("Capacity must be atleast greater than 0.")
        .toInt(),
    body("department_id").trim()
        .optional({ nullable: true, checkFalsy: true })
        .isInt().withMessage("Invalid Department Selection.")
        .toInt(),
    body("room_types_ids").trim()
        .optional({ nullable: true, checkFalsy: true })
        .isArray().withMessage("Room Types must be an array."),
    body("room_types_ids.*").trim()
        .optional()
        .isInt().withMessage("Room Type IDs must be an integer.")
        .toInt()
];

export async function getAllRooms(req, res) {
    const rooms = await db.getAllRooms();

    res.render('index', { rooms });
}

export async function createRoom(req, res) {
    const departments = await db.getAllDepartments();
    const room_types = await db.getAllRoomTypes();
    res.render('create-room', { departments, room_types });
}

export const createRoomPost = [
    validateRoom,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const departments = await db.getAllDepartments();
            const room_types = await db.getAllRoomTypes();

            return res.status(400).render("create-room", {
                errors: errors.array(),
                departments,
                room_types
            });
        }

        const { room_number, capacity, department_id, room_types_ids } = req.body;
        const roomId = await db.createRoom(room_number, capacity, department_id ?? null, room_types_ids ?? null);
        res.redirect(`/room/${roomId}`);
    }
]

export async function getRoom(req, res) {
    const { roomId } = req.params;
    const room = await db.getRoom(roomId);
    const departments = await db.getAllDepartments();
    const room_types = await db.getAllRoomTypes();
    res.render('room', { room, departments, room_types });
}

export const updateRoomPost = [
    validateRoom,
    async (req, res) => {
        const { roomId } = req.params;
        const { room_number, capacity, room_types_ids } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const room = await db.getRoom(roomId);
            const departments = await db.getAllDepartments();
            const room_types = await db.getAllRoomTypes();

            return res.render('room', { errors: errors.array(), room, departments, room_types })
        }

        await db.updateRoom(roomId, room_number, capacity, departmentId, room_types_ids ?? null);

        res.redirect(`/room/${roomId}`);
    }
]

export async function deleteRoom(req, res) {
    const room_id = req.params.roomId;
    await db.deleteRoom(room_id);

    res.sendStatus(204);
}


