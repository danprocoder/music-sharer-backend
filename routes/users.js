import app from 'express';
import UserController from '../controllers/user';

const router = app.Router();
const userController = new UserController();

router.post('/api/user/add', userController.addNewUser);

export default router;
