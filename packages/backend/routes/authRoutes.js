import express from 'express';
import { deleteOwner, googleAuth, loginUser, registerUser, setupOwner } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/setup-owner', setupOwner);
router.post('/delete-owner', deleteOwner);

export default router;
