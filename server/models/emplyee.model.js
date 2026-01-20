import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const employeeSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    name: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true }
    },

    phoneNo: {
      type: String,
      trim: true
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
      enum: ["Admin", "Employee", "Manager", "Super Admin"],
      // required: true,
      default: "Employee"
    },

    relationshipStatus: {
      type: String,
      enum: ["single", "married", "complicated"]
    },

    department: {
      type: String,
      enum: [
        "HR",
        "Engineering",
        "Sales",
        "Marketing",
        "Finance",
        "Executive",
        "IT",
        "Customer Support"
      ],
      trim: true
    },

    dateOfJoining: {
      type: Date
    },

    emergencyContact: {
      name: { type: String, trim: true },
      phoneNo: { type: String, trim: true },
      relationship: { type: String, trim: true },
      address: { type: String, trim: true }
    },

    leaves: {
      appliedLeaves: {
        type: Schema.Types.ObjectId,
        ref: "Leave"
      },
      leaveHistory: [
        {
          type: Schema.Types.ObjectId,
          ref: "Leave"
        }
      ],
      remainingLeaves: {
        type: Number,
        default: 30
      },
      leaveType: {
        sick: { type: Number, default: 15 },
        casual: { type: Number, default: 7 },
        paid: { type: Number, default: 5 },
        unpaid: { type: Number, default: 3 }
      }
    },

    attendance: {
      attendanceHistory: [
        {
          type: Schema.Types.ObjectId,
          ref: "Attendance"
        }
      ],
      totalDaysPresent: { type: Number, default: 0 },
      totalDaysAbsent: { type: Number, default: 0 },
      totalDaysOnLeave: { type: Number, default: 0 },
      totalLateDays: { type: Number, default: 0 },
      totalWorkingDays: { type: Number, default: 0 }
    },

    performanceReviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "PerformanceReview"
      }
    ],

    payroll: {
      salarySlips: [
        {
          type: Schema.Types.ObjectId,
          ref: "Payroll"
        }
      ],
      bankDetails: {
        accountNumber: { type: String, trim: true, select: false },
        bankName: { type: String, trim: true },
        ifscCode: { type: String, trim: true },
        panNumber: { type: String, trim: true, select: false }
      },
      lastSalaryPaidDate: {
        type: Date
      },
      totalEarnings: { type: Number, default: 0 },
      totalDeductions: { type: Number, default: 0 },
      totalAllowance: { type: Number, default: 0 },
      netPay: { type: Number, default: 0 }
    },

    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project"
      }
    ],

    documents: {
      profileImage: { type: String, trim: true },
      resume: { type: String, trim: true },
      idProof: { type: String, trim: true },
      bankPassbook: { type: String, trim: true },
      panCard: { type: String, trim: true }
    }
  },
  { timestamps: true }
);

// PASSWORD HASHING (ONLY HERE)
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  
});

// PASSWORD COMPARISON
employeeSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};


//  JWT GENERATION
employeeSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
};

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
