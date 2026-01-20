import mongoose, { Schema } from "mongoose";

const payrollSchema = new Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: 'Employee'
    },
    basicSalary: {
        type: Number,
        required: true
    },
    allowances: {
        type: Number,   
        default: 0
    },
    deductions: {
        type: Number,
        default: 0
    },  
    netSalary: {
        type: Number,
        required: true  
    },
    payDate: {
        type: Date,
        required: true  
    },
    paymentMethod: {
        type: String,   
        enum: ['Bank Transfer', 'Cheque', 'UPI'],
        default: 'Bank Transfer'
    },
},
    { timestamps: true }
);

const Payroll = mongoose.model('Payroll', payrollSchema);
export default Payroll;