import express from "express";
import { validate } from '../../middleware/validation.js';
import {
    addToWishListValidation,
    deleteFromWishListValidation,
} from "./wishlist_validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth_controller.js";
import * as wishlist from "../wishlist/wishlist_controller.js";

const wishListRouter = express.Router();

wishListRouter.route("/").patch(protectedRoutes, allowedTo("user"), validate(addToWishListValidation), wishlist.addToWishList).delete(protectedRoutes, allowedTo("user"), validate(deleteFromWishListValidation), wishlist.removeFromWishList).get(protectedRoutes, allowedTo("user"), wishlist.getAllUserWishList);

export default wishListRouter;