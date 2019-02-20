import app from 'express';
import UserController from '../controllers/user';
import authRequired from '../middlewares/authRequired';

const router = app.Router();
const userController = new UserController();

router.post('/api/user/add', userController.addNewUser.bind(userController));
router.post('/api/user/auth', userController.auth.bind(userController));
router.get('/api/user', authRequired, userController.userData.bind(userController));
router.get('/api/user/:username', userController.userData.bind(userController));
router.patch('/api/user/bio', authRequired, userController.updateUserBio.bind(userController));
router.patch('/api/user/photo', authRequired, userController.updateUserPhoto.bind(userController));

export default router;
