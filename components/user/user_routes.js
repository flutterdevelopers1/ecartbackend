import express from "express";
import * as User from "./user_controller.js";
import { validate } from '../../middleware/validation.js';

import {
    addUserValidation,
    changeUserPasswordValidation,
    deleteUserValidation,
    updateUserValidation,
} from "./user_validation.js";

const userRouter = express.Router();

userRouter.route("/").post(validate(addUserValidation), User.addUser).get(User.getAllUsers);

userRouter.route("/:id").put(validate(updateUserValidation), User.updateUser).delete(validate(deleteUserValidation), User.deleteUser).patch(validate(changeUserPasswordValidation), User.changeUserPassword);

export default userRouter;