import mongoose from 'mongoose';
import express from 'express';
import hbs from 'hbs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path'
import taskRouter from "./routes/taskRoute.js";
import UserRoute from "./routes/userRoute.js";
const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

app.set('view engine', 'hbs');
app.use(express.json());
app.use(UserRoute);
app.use(taskRouter);



app.listen(port, () => {
    console.log('Server is up on port ' + port);
});