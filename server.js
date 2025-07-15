const mongoose = require("mongoose")
const connt = mongoose.connect("mongodb://localhost:27017/User_info")
.then(() => {
    console.log("Connected to database");
})
.catch(() => {
    console.log("Failed to connect to db");
})

const connectionSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
},{timestamp: true})

const usermodel = mongoose.model("user", connectionSchema)

module.exports =  usermodel