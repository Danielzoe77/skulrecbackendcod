const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userScheme = mongoose.Schema({
    username:{
        type: String,
        required: [true, "please enter a name"]
    },
    email:{
        type: String,
        required: [true, "please enter a email"],
        trim: true,
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "please add valid email"]
    },

    password :{
        type: String,
        required: [true, "please add a password"],
        minLength: [6, "password should be at least 6 characters"],
        maxLength: [15, "password should not be more than 15 characters"],
        select: false
    },
},
{
    timestamps:true
})

userScheme.pre("save", async function (next){
    if (!this.isModified("password")){
        return next()
    }

    //encrypt password b4 saving to db
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(this.password,salt)
    this.password = hashpassword
    next()


} )
const userModel = mongoose.model("Users", userScheme)
module.exports = userModel;