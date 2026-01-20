import { Router } from 'express'
import { createEmployee, getAllEmployees, getEmployeeProfile, loginEmployee, logoutEmployee, updatProfile } from '../controllers/employee.controller.js';

const router = Router();

router.post('/login', loginEmployee)
router.get('/logout', logoutEmployee)
router.get('/profile', getEmployeeProfile)
router.route('/create').post(createEmployee)
router.patch('/update-profile', updatProfile)
router.get('/get-all-employees', getAllEmployees)

export default router;