import { asyncHandler } from './../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { validateEmail, validatePassword } from '../utils/validators.js';
import Employee from '../models/emplyee.model.js';
import bcrypt from 'bcryptjs';

// Funtion to create a new employee
export const createEmployee = async (req, res) => {
  try {
    const adminId = req.employee;
    const { email, password, role, department } = req.body;
    const admin = await Employee.findById(adminId);
      
    console.log("Admin Role:", admin.role);

    if (admin.role !== "Admin" && admin.role !== "Super Admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins and super admins can create new employees"
      });
      }
      
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password and role are required"
      });
    }

    if (!validateEmail(email)) {
      return res.status(422).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (!validatePassword(password)) {
      return res.status(422).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain at least one number and one special character"
      });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "Employee with this email already exists"
      });
    }

    

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

// Function to login an employee
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

// Funtion to get employee profile
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

// Function to logout an employee
export const logoutEmployee = asyncHandler(async (req, res) => {
    try {
        const employeeId = req.employee;
        const employee = await Employee.findById(employeeId)
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found', success: false });
        }
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

// Function to get all employees
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

// Function to update employee profile
export const updatProfile = asyncHandler(async (req, res) => {
    try {
        const employeeId = req?.params?.id;
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

// Funtion to update email of employee
export const updateEmployeeEmail = asyncHandler(async (req, res) => {
    try {
        const employeeId = req?.params?.id;
        const { email } = req.body;
        const adminId = req.employee;
        const admin = await Employee.findById(adminId);
        if (admin.role !== "Admin" && admin.role !== "Super Admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins and super admins can update employee email"
            });
        }
        if (validateEmail(email) === false) {
            return res.status(422).json({
                success: false,
                message: "Invalid email format"
            });
        }
        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { email },
            { new: true, runValidators: true }
        );
        if (!updatedEmployee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }
        return res
            .status(200)
            .json(new ApiResponse(200, 'Employee email updated successfully'));
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });

    }
})

// Function to Reset employee password
export const resetEmployeePassword = asyncHandler(async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!validateEmail(email)) {
            return res.status(422).json({
                success: false,
                message: "Invalid email format"
            });
        }

        if (!validatePassword(newPassword)) {
            return res.status(422).json({
                success: false,
                message: "Password must be at least 8 characters long and contain at least one number and one special character"
            });
        }   

        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee with this email does not exist"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        employee.password = hashedPassword;
        await employee.save();

        return res
            .status(200)
            .json(new ApiResponse(200, 'Employee password reset successfully'));

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});

// 