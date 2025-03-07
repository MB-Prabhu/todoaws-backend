const mongoose = require('mongoose')

const TodoSchema = mongoose.Schema({
    todoName:{
        type:String,
    },
    completed:{
        type:Boolean
    }
}, {
    timestamps:true
})


module.exports = mongoose.model('TodoModel', TodoSchema)