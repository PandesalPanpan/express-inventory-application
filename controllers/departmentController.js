import * as db from '../db/queries.js';

export async function getDepartment(req, res) {
    const department_id = req.params.departmentId;
    const department = await db.getDepartment(department_id);

    res.render('department', { department });
}

export async function getRoomsByDepartment(req, res) {
    const department_id = req.params.departmentId;
    const rooms = await db.getRoomsByDepartment(department_id);
    
    res.render('department-rooms', { rooms });
}

export async function getAllDepartments(req, res) {
    const departments = await db.getAllDepartments();

    res.render('departments', { departments });
}

export async function createDepartmentGet(req, res) {
    res.render('create-department');
}

export async function createDepartmentPost(req, res) {
    const { name } = req.body;
    const department = await db.createDepartment(name);
    res.render('department', { department });
}

export async function updateDepartmentPost(req, res) {
    const { name } = req.body;
    const department_id = req.params.departmentId;
    await db.updateDepartment(department_id, name);
    res.redirect(`/department/${department_id}`);
}

export async function deleteDepartment(req, res) {
    const { department_id } = req.params;
    await db.deleteDepartment(department_id);

    res.redirect('/');
}