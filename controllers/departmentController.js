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

export async function getAllDepartments(req, res) {
    const departments = await db.getAllDepartments();

    res.render('departments', { departments });
}

export async function updateDepartmentPost(req, res) {
    const { department_id, name } = req.body;
    const department = await db.updateDepartment(department_id, name);

    res.render('department', { department });
}