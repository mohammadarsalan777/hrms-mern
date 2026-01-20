import mongoose, {Schema} from "mongoose";

const projectSchema = new Schema({
    projectName: {
        type: String,
        required: true, 
        trim: true
    },
    description: {  
        type: String,
        trim: true
    },      
    startDate: {
        type: Date,
        required: true      
    },
    endDate: {
        type: Date,
    },
    status: {   
        type: String,   
        enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
        default: 'Not Started'
    },
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee' 
    }],
    teamManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee' 
    },
    teamLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee' 
    },
    progress: {   
        type: Number,
        default: 0  
    }
},
    { timestamps: true }    
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
