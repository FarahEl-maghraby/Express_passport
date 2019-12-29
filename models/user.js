const mongoose = require('mongoose');

UserSchema = new mongoose.Schema({
    userID:{
        type:Number,
        default:1
    },

    email:{
        type:String,
        maxlength:50,
        minlength:2,
        trim:true

    },

    firstName:{
        type:String,
        maxlength:50,
        minlength:2,
        trim:true

    },

    lastName:{
        type:String,
        maxlength:50,
        minlength:2,
        trim:true

    },

    events:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Events'
        
    }]
})


const Users = mongoose.model('Users',UserSchema)
module.exports = Users