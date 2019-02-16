import app from 'express';
import UserController from '../controllers/user';

const router = app.Router();
const userController = new UserController();

router.post('/api/user/add', userController.addNewUser.bind(userController));
router.post('/api/user/auth', userController.auth.bind(userController));
router.get('/api/user', userController.userData.bind(userController));
router.get('/api/user/:username', userController.userData.bind(userController));

export default router;
