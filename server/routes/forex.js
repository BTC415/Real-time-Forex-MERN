import express from 'express';
import * as forexController from '../controllers/forexController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);
router.get('/history', forexController.getLatestPrices);

export default router;