import { Router } from "express";
import * as roomController from "../controllers/roomController";

const roomRouter = Router();

roomRouter.get('/', roomController.getAllRooms);
roomRouter.get('/room/create', roomController.createRoom);
roomRouter.get('/room/:roomId', roomController.getRoom);
roomRouter.post('/room/:roomId/update', roomController.updateRoomPost);
roomRouter.delete('/room/:roomId/delete', roomController.deleteRoom);

export default roomRouter;