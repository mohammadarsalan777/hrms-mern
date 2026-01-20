import mongoose, { Schema } from "mongoose";

const performaceSchema = new Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee' 
    },
    reviewPeriod: {
        type: String,   
        required: true,
        trim: true
    },      
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    remarks: {   
        type: String,
        trim: true,
        default: ''
    },

    status: {   
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    },
    performanceMetrics: {
        productivity: {
            type: Number,   
            default: 0
        },
        qualityOfWork: {    
            type: Number,
            default: 0
        },  
        teamwork: {
            type: Number,
            default: 0
        },
        communication: {
            type: Number,
            default: 0  
        },
        punctuality: {
            type: Number,
            default: 0
        }
    }  
    
},
    { timestamps: true }
);

const Performance = mongoose.model('Performance', performaceSchema);
export default Performance;