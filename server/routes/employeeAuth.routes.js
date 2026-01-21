import { Router } from 'express'
import {
    createEmployee,
    getAllEmployees,
    getEmployeeProfile,
    loginEmployee, 
    logoutEmployee,
    resetEmployeePassword,
    updateEmployeeEmail,
    updatProfile
} from '../controllers/employee.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', loginEmployee)
router.get('/logout', authMiddleware, logoutEmployee)
router.get('/profile', authMiddleware, getEmployeeProfile)
router.route('/create').post(authMiddleware, createEmployee)
router.patch('/update-profile', authMiddleware, updatProfile)
router.get('/get-all', authMiddleware, getAllEmployees)
router.patch('/update-email/:id', authMiddleware, updateEmployeeEmail)
router.patch('/reset-password', resetEmployeePassword)

export default router;