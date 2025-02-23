const mongoose = require('mongoose');
const plm = require("passport-local-mongoose")

// const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aiwork"; // Use environment variable or default
const mongoURI ="mongodb://127.0.0.1:27017/aiwork"; 

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));


const userSchema = mongoose.Schema({
    username : String,
    name : String,
    email : String,
    password : String,
    profileImage : String,
    contact : Number,
    boards : {
      type : Array,
      default: []
    }
})

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);