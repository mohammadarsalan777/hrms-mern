import { asyncHandler } from './../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { validateEmail, validatePassword } from '../utils/validators.js';
import Employee from '../models/emplyee.model.js';




export const createEmployee = async (req, res) => {
    try {
        
        const { email, password, role, department } = req.body;
        
        // Simple validation
        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Email, password and role are required"
            });
        }
        
        // Validate email
        if (!validateEmail(email)) {
            return res.status(422).json({
                success: false, 
                message: "Invalid email format"
            });
        }
        // Validate password
        if (!validatePassword(password)) {
            return res.status(422).json({
                success: false,
                message: "Password must be at least 8 characters long and contain at least one number and one special character"
            });
        }

        // Check existing employee
        const existingEmployee = await Employee.findOne({ email });
        
        if (existingEmployee) {
            return res.status(409).json({
                success: false,
                message: "Employee with this email already exists"
            });
        }
        
        // Create employee
        const employee = await Employee.create({
            email,
            password,
            role,
            department
        });
        
        
        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            employee: {
                id: employee._id,
                email: employee.email
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

export const loginEmployee = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }
    
    if(validateEmail(email) === false) {
        return res.status(422).json({
            success: false,
            message: "Invalid email format"
        });
    }

    if(validatePassword(password) === false) {
        return res.status(422).json({
            success: false,
            message: "Password must be at least 8 characters long and contain at least one number and one special character"
        });
    }

    // Find employee with password field
    const employee = await Employee.findOne({ email }).select('+password');
    
    if (!employee) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    // Verify password
    const isPasswordValid = await employee.isPasswordCorrect(password);
    
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    // Generate token
    const token = employee.generateAccessToken();

    // Send response with cookie and token
    return res
        .status(200)
        .cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .json({
            success: true,
            message: 'Login successful',
            employee: {
                id: employee._id,
                email: employee.email,
                role: employee.role,
                department: employee.department
            }
        });
});

export const getEmployeeProfile = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee;
        const employee = await Employee.findById(employeeId)
        if (!employee) {
            throw new ApiError(404, 'Employee not found');
        }
        return res
            .status(200)
            .json(new ApiResponse(200, employee, 'Employee profile fetched successfully'));
    } catch (error) {
        return new ApiError(500, 'Internal Server Error');
    }
})

export const logoutEmployee = asyncHandler(async (req, res) => {
    try {
        return res
            .status(200)
            .cookie('token', '', {
                httpOnly: true,
                sameSite: 'strict',
                expires: new Date(0)
            })
            .json(new ApiResponse(200, null, 'Logout successful'));
    } catch (error) {
        return new ApiError(500, 'Internal Server Error');
    }
})

export const getAllEmployees = asyncHandler(async (req, res) => {
    try {
        const employees = await Employee.find();
        return res
            .status(200)
            .json(new ApiResponse(200, employees, 'Employees fetched successfully'));
    } catch (error) {
        return new ApiError(500, 'Internal Server Error');
    }
})

export const updatProfile = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const updateData = req.body;
        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedEmployee) {
            throw new ApiError(404, 'Employee not found');
        }
        return res
            .status(200)
            .json(new ApiResponse(200, 'Employee profile updated successfully'));
    } catch (error) {
        return new ApiError(500, 'Internal Server Error');
    }
})
