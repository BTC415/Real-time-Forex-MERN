import express from 'express';
import * as authController from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/validate', auth, authController.validateToken);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/update', auth, authController.updateUser);

export default router;