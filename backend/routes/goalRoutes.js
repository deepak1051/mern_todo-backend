import express from 'express';
import {
  deleteGoal,
  getGoal,
  postGoal,
  updateGoal,
  getSingleGoal,
} from '../controllers/goalController.js';
import protect from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', protect, getGoal);

router.post('/', protect, postGoal);

router.get('/:id', protect, getSingleGoal);

router.put('/:id', protect, updateGoal);

router.delete('/:id', protect, deleteGoal);

export default router;
