require("dotenv").config();
const express = require('express')
const connectDB = require ("./config.js");
// const Tasked = require ('./model.js');
const taskRoute = require ('./Routes/tasksRoute')
const userRoute = require ('./Routes/userRoute')
const recordRoute = require ('./Routes/recordsRoute')
const errorHandler = require ('./middleware/errorMiddleware')
var cookieParser = require('cookie-parser')
const app = express();
const cors = require('cors');
const corsOptions = {
    origin: '' || "*",
    credentials: true,            //access-control-allow-credentials:true
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: [
        'Access-Control-Allow-Headers',
        'Content-Type,', 
        'Authorization']
}




const port = 3000;
//  connectDB();


//middleware
app.use (express.json());
app.use (cookieParser());
app.use(cors(corsOptions));
// app.use (express.urlencoded({ extended: false }));
app.use (taskRoute);
app.use ('/api/users', userRoute);
app.use ('/api/records', recordRoute);


//errorHandler
app.use(errorHandler)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

//create post route
// app.post('/api/task', (req, res) => {
//     console.log(req.body)
//     res.send('task created');
// });
//creating a post request that will be saved in mongo database





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
