import express from "express";
import { validate } from "../../middleware/validation.js";
import { allowedTo, protectedRoutes } from '../auth/auth_controller.js';
import { addProductToCartValidation, removeProductFromCart } from "./cart_validation.js";
import * as cart from "../cart/cart_controller.js"
const cartRouter = express.Router();

cartRouter.route("/").post(protectedRoutes, allowedTo("user"), cart.addProductToCart).get(protectedRoutes, allowedTo("user"), cart.getLoggedUserCart)

cartRouter.route("/apply-coupon").post(protectedRoutes, allowedTo("user"), cart.applyCoupon)

cartRouter.route("/:id").delete(protectedRoutes, allowedTo("user"), cart.removeProductFromCart).put(protectedRoutes, allowedTo("user"), cart.updateProductQuantity);

export default cartRouter;