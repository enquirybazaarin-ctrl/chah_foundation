import { Router } from 'express';
import * as userController from './user.controller';
import { protect, restrictTo } from '../auth/auth.middleware';

const router = Router();

router.use(protect);
router.use(restrictTo('SUPER_ADMIN')); // Only super admin can manage users

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.patch('/:id/status', userController.updateUserStatus);

export default router;
