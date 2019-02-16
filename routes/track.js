import { Router } from 'express';
import TrackController from '../controllers/track';

const router = new Router();
const trackController = new TrackController();

router.get('/api/tracks', trackController.getTracks.bind(trackController));
router.get('/api/:username/tracks/', trackController.getTracks.bind(trackController));

export default router;
