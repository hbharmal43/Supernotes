import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getUserContent, uploadFile } from '../controllers/files.controller.js';
const router = express.Router();

router.get('/my-content', verifyToken, getUserContent);
router.post('/upload', verifyToken, uploadFile);

export default router;

