import mongoose from 'mongoose';

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId, // beacuse its an objects 
        required:true, // it shoul be not null without owner without create task
        ref:'User'//relationship with model of user
    }

});

export default  Task;


//relationship in mongodb 