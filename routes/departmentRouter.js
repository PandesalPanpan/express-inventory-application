import { Router } from "express";
import * as departmentController from '../controllers/departmentController.js';

const departmentRouter = Router();

departmentRouter.get('/', departmentController.getAllDepartments);
departmentRouter.get('/:departmentId/rooms', departmentController.getRoomsByDepartment);
departmentRouter.get('/:departmentId', departmentController.getDepartment);
departmentRouter.get('/create', departmentController.createDepartmentGet);
departmentRouter.post('/create', departmentController.createDepartmentPost);
departmentRouter.post('/:departmentId/update', departmentController.updateDepartmentPost);
departmentRouter.delete('/:departmentId/delete', departmentController.deleteDepartment);

export default departmentRouter;