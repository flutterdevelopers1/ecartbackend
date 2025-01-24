import express from "express";
import { validate } from "../../middlewares/validate.js";
import { allowedTo, protectedRoutes } from "../auth/auth_controller.js";
import * as address from "../address/address_controller.js";
import {
    addAddressValidation,
    deleteAddressValidation,
} from "./address_validation.js";

const addressRouter = express.Router();

addressRouter.route("/").patch(protectedRoutes, allowedTo("user"), validate(addAddressValidation), address.addAddress).delete(protectedRoutes, allowedTo("user"), validate(deleteAddressValidation), address.removeAddress).get(protectedRoutes, allowedTo("user"), address.getAllAddresses);

export default addressRouter;