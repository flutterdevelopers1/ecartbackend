import express from "express";
import * as auth from "./auth_controller.js";

const authRouter = express.Router();

authRouter.post("/signup", auth.signUp);
authRouter.post("/signin", auth.signIn);

export default authRouter;