import mongoose from 'mongoose';
import express from 'express';
import hbs from 'hbs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path'
import taskRouter from "./routes/taskRoute.js";
import UserRoute from "./routes/userRoute.js";
import bcrypt from "bcryptjs";
// const session = require('express-session');
import session from 'express-session';
import fileUpload from 'express-fileupload';
const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, "../public"); //its save our static files like css js
app.use(express.static(publicPath));

app.set('view engine', 'hbs');
app.use(session({   //session handling
    secret: 'siuu',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: false }
}));

//saveuntiti - is optional
app.use(express.json()); //whater ever data comes in it converted to json
app.use(express.urlencoded({ extended: true })); //it makes conver th efomr format
app.use(fileUpload());//makes to upload th files
app.use(UserRoute); //all the routes
app.use(taskRouter); //all the routes

//if response came it will break th pipline


app.listen(port, () => {
    console.log('Server is up on port ' + port);
});

// const main = async ()=>{
//     const password ="1234"
//     const hashedPassword = await bcrypt.hash(password, 8)
//     console.log(hashedPassword)   ;

//     const isMatch = await bcrypt.compare("1234", hashedPassword)
//     console.log(isMatch)
// }

// main();


//middleware

// in here i want to do somthing before and after  saving function - that what middleware//


// do something 1 -> save () do_something 2


//session handling  -make it authancticated 

//whenn the user visit first time we gonna give session token 
//the id token will string in thath id it will be obejct and it will save user identification
//it wont store permanatly

// in order to use the use the session we have to bring th esesssion library that is express-session

//cookies arer kind of storage which there we save session informations (SessionId) it is just 4MB

//every single user should have the uniquqe id