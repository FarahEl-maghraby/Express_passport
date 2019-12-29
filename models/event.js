const mongoose = require('mongoose')

EventsSchema = new mongoose.Schema({
    eventID:{
        type:Number,
        default:0
    },
    name:{
        type:String,
        required:true,
        maxlength:50,
        minlength:2,
        trim:true
    },

    description:{
        type:String,
        required:true,
        maxlength:50,
        minlength:2,
        trim:true

    },

    date:{
        type:Date,
        required:true,
        trim:true
    },

    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users'
        
    }]
})


const Events = mongoose.model('Events',EventsSchema)
module.exports = Events