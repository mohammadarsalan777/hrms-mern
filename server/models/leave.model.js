import mongoose, { Schema } from "mongoose";

const leaveSchema = new Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    startDate: {
        type: Date,
        required: true,
        trim: true
    },
    endDate: {
        type: Date,
        required: true,
        trim: true
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    totalDays: {
        type: Number,
        required: true
    },
    leaveType: {
        type: String,
        enum: ['sick', 'causal', 'paid', 'unpaid'],
    },
},
    { timestamps: true }
);

leaveSchema.pre('save', function (next) {
    const now = new Date();
    
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      return next(new Error("Start date cannot be after end date"));
    }
  
    if (this.startDate && this.startDate < now) {
      return next(new Error("Start date cannot be in the past"));
    }
   
    next();
});


const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;