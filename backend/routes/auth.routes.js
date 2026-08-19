import express from 'express';

import { adminCheck, getMe, login, logout, register } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/admin.middleware.js';

const router = express.Router();

router.post('/register', register); // ✅
router.post('/login', login); // ✅
router.post('/logout', protect, logout); // ✅
router.get('/me', protect, getMe); // ✅
router.get('/admin-check', protect, adminOnly, adminCheck);

export default router;
