import express from 'express';
import { createGadget, deleteGadget, getGadgets, selfDestruct, updateGadget } from '../controller/gadgetController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getGadgets);

router.post('/create', authenticateToken, createGadget);

router.patch('/update/:id', authenticateToken, updateGadget);

router.delete('/delete/:id', authenticateToken, deleteGadget);

router.post('/:id/self-destruct', authenticateToken, selfDestruct);

export default router;