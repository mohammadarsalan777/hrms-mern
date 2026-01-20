import mongoose, { Schema } from "mongoose";
import Login from './../../client/src/pages/authenctication/Login';

const attendanceSchema = new Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    date: {
        type: Date,       
        required: true
    },
    status: {   
        type: String,
        enum: ['Present', 'Absent', 'On Leave', 'Late', 'Half Day'],
        required: true 
    },
    loginTime: {
        type: Date,
        trim: true,
        default: null
    },
    logoutTime: {
        type: Date,
        trim: true,
        default: null
    },
    workedHours: {
        type: Number,
        default: 0 
    }
},
    { timestamps: true }

)

attendanceSchema.pre('save', function (next) {
    if (this.loginTime) {
        const loginDate = new Date(this.LoginTime);
        const loginHourIST = Number(
            loginDate.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            hour12: false,
      })
    )
    if (loginHourIST > 8 && loginHourIST < 10) {
        this.status = 'Present';
    } else {
        this.status = 'Late';
    }
    }
})

attendanceSchema.methods.calculateWorkedHours = function () {
    if (this.loginTime && this.logoutTime) {
        const diffMs = this.logoutTime - this.loginTime;
        const diffHrs = diffMs / (1000 * 60 * 60);
        this.workedHours = parseFloat(diffHrs.toFixed(2));
    }

    if (this.workedHours >= 8) {
        this.status = 'Present';
    } else if (this.workedHours <= 4) { 
        this.status = 'Half Day';
    } else {
        this.status = 'Absent';
    }
}

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;