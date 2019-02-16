import { Router } from 'express';
import TrackController from '../controllers/track';

const router = new Router();
const trackController = new TrackController();

router.get('/api/tracks', trackController.getTracks.bind(trackController));
router.get('/api/:username/tracks/', trackController.getTracks.bind(trackController));
router.post('/api/track/upload', trackController.upload.bind(trackController));
router.get('/api/track/tmp/:filename', trackController.sendFileToSonicAPI.bind(trackController));

export default router;
