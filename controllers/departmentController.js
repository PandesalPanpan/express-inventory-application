import * as db from '../db/queries.js';

export async function getDepartment(req, res) {
    const { department_id } = req.params;
    const department = await db.getDepartment(department_id);

    res.render('department', { department });
}

export async function getRoomsByDepartment(req, res) {
    const { department_id } = req.params;
    const rooms = await db.getRoomsByDepartment(department_id);

    res.render('department-rooms', { rooms });
}