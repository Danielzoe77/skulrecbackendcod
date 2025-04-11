require("dotenv").config();
const express = require('express')
const connectDB = require ("./config.js");
// const Tasked = require ('./model.js');
const userRoute = require ('./Routes/userRoute')
const recordRoute = require ('./Routes/recordsRoute')
const errorHandler = require ('./middleware/errorMiddleware')
var cookieParser = require('cookie-parser')
const app = express();
const cors = require('cors');
const corsOptions = {
    origin: ["http://localhost:5173", "https://admin-dash-mauve.vercel.app/",],
    credentials: true,            
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: [
       ' Access-Control-Allow-Origins ',
        'Content-Type,', 
        'Authorization']
}




const port = 3002;
//  connectDB();


//middleware
app.use (express.json());
app.use (cookieParser());
app.use(cors(corsOptions));
app.use ('/api/users', userRoute);
app.use ('/api/records', recordRoute);


//errorHandler
app.use(errorHandler)

app.get('/', (req, res) => {
    res.send('Hello World!');
});
const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);

    });
 }
 catch (error) {
     console.error("error:", error.message);
 }
}
startServer();
