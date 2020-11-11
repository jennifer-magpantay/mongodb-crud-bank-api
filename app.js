import mongoose from 'mongoose';
import express from 'express'
import { accountRouter } from './routes/accountRouter.js'
import dotenv from 'dotenv/config.js';

// creating the app
const app = express();
app.use(express.json());
app.use(accountRouter);
app.listen(3000, () => console.log("API started"))

// --------- CONNECTING WITH MONGOOSE ----------//
await mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    // passing a console message to confirm the access to the db
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });;