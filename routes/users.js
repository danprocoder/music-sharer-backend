import app from 'express';
import UserController from '../controllers/user';

const router = app.Router();
const userController = new UserController();

router.post('/api/user/add', userController.addNewUser);
router.post('/api/user/auth', userController.auth);
router.post('/api/user', userController.userData);
router.post('/api/user/:username', userController.userData);

export default router;
