import express from 'express';
import { deleteOwner, googleAuth, loginUser, registerUser, setupOwner } from '../controllers/authController.js';

import { masterKey } from '../middleware/masterKeyMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/setup-owner', masterKey, setupOwner);
router.post('/delete-owner', masterKey, deleteOwner);

export default router;
