import mongoose from 'mongoose';
import express from 'express';
import taskRouter from "./routes/taskRoute.js";
import UserRoute from "./routes/userRoute.js";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(UserRoute);
app.use(taskRouter);



app.listen(port, () => {
    console.log('Server is up on port ' + port);
});