import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';

const employeeSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    empoyeeId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        default: function () { 
            return 'EMP' + Math.floor(1000 + Math.random() * 9000);
        }
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        trim: true
    },
    phoneNo: {
        type: Number
    },
    permanentAddress: {
        type: String,
        trim: true
    },
    currentAddress: {
        type: String,
        trim: true
    },
    dob: {
        type: Date
    },
    designation: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'employee', 'manager'],
        retquired: true,
        default: 'employee'
    },
    relationshipStatus: {
        type: String,
        enum: ['single', 'married', 'complicated']
    },
    department: {
        type: String,
        trim: true  
    },
    dateOfJoining: {
        type: Date
    },
    emergencyContact: {
        name: {
            type: String,
            trim: true
        },
        phoneNo: {
            type: Number
        },
        relationship: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        }
    },

    Leaves: {
        appliedLeaves: {
            type: Schema.Types.ObjectId,
            ref: 'Leave'
        },

        leaveHistory: [{
            type: Schema.Types.ObjectId,
            ref: 'Leave'
        }],

        remainingLeaves: {
            type: Number,
            default: 30
        },

        leaveType: {
            sick: {
                type: Number,
                default: 15
            },
            casual: {
                type: Number,
                default: 7
            },
            paid: {
                type: Number,
                default: 5
            },
            unpaid: {
                type: Number,
                default: 3
            }
        }

    },

    attendance: {
        AttendanceHistory: [{
            type: Schema.Types.ObjectId,
            ref: 'Attendance'
        }],
        totalDaysPresent: {
            type: Number,
            default: 0 
        },
        totalDaysAbsent: {
            type: Number,
            default: 0 
        },
        totalDaysOnLeave: {
            type: Number,
            default: 0 
        },
        totalLateDays: {
            type: Number,
            default: 0  
        },
        totoalWorkingDays: {
            type: Number,
            default: 0  
        }
    },

    performanceReviews: [{
        type: Schema.Types.ObjectId,
        ref: 'PerformanceReview'
    }],

    payroll: {
        salarySlips: [{
            type: Schema.Types.ObjectId,
            ref: 'Payroll'
        }],
        bankDetails: {
            accountNumber: {
                type: String,
                trim: true
            },
            bankName: {
                type: String,
                trim: true  
            },
            ifscCode: {
                type: String,   
                trim: true
            },
            panNumber: {
                type: String,
                trim: true
            }
        },
        LastSalaryPaidDate: {
            type: Date
        },
        totalEarnings: {
            type: Number,
            default: 0  
        },
        totalDeductions: {
            type: Number,
            default: 0  
        },
        netPay: {
            type: Number,
            default: 0  
        }    
    }, 

    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }]


}, { timestamps: true });

employeeSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

employeeSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};


employeeSchema.methods.generateAccessToken = function() {
    return jwt.sign(
    {
        _id: this._id,
        email: this.email,
        role: this.role,
        empoyeeId: this.empoyeeId
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}
const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;