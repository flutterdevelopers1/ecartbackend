import express from "express";
import { dbConnection } from './db/db.js';
import { entrypoint } from "./entrypoint.js";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from 'cors'
import { createOnlineOrder } from "./components/order/order_controller.js";

dotenv.config();
const app = express();
app.use(cors())

const port = 3000;
app.post('/webhook', express.raw({ type: 'application/json' }), createOnlineOrder);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("uploads"));

// call: entrypoint
entrypoint(app);

// initalize DB connection
dbConnection();

// start the server 
app.listen(process.env.PORT || port, () => console.log(`Backend running on: ${port}!`));