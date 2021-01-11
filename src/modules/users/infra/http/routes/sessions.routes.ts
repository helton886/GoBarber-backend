import { Router } from 'express';
import SessionsController from '../controllers/sessionsController';

const usersRouter = Router();

const sessionsController = new SessionsController();

usersRouter.post('/', sessionsController.create);

export default usersRouter;
