import * as db from '../db/queries.js';

export async function getDepartment(req, res) {
    const { department_id } = req.params;
    const department = await db.getDepartment(department_id);

    res.render('department', { department });
}