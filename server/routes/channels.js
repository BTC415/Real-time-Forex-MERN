import express from 'express';
import * as channelController from '../controllers/channelController.js';
import * as messageController from '../controllers/messageController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

// Channel routes
router.get('/', channelController.getChannels);
router.post('/', channelController.createChannel);
router.put('/:channelId', channelController.updateChannel);
router.delete('/:channelId', channelController.deleteChannel);

// Channel messages routes
router.get('/:channelId/messages', messageController.getMessages);
router.post('/:channelId/messages', messageController.createMessage);

export default router;