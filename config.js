const mongoose = require("mongoose")


const connectDb = async () => {
    try {
        const MONGO_URI = "mongodb+srv://drimbignation12:danielehis12@daniel1.cp9t3mb.mongodb.net/drimbignation12?retryWrites=true&w=majority";
         await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("connected to MongoDB");
    }
    catch (error){
        console.error("error connecting to mongoDB:", error.message);
        process.exit(1);
    }
}
module.exports = connectDb;