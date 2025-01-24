import express from "express";
import * as coupon from './coupon_controller.js';
import { validate } from '../../middleware/validation.js';
import {
    createCouponValidation,
    deleteCouponValidation,
    getSpecificCouponValidation,
    updateCouponValidation,
} from "./coupon_validation.js";
import { allowedTo, protectedRoutes } from '../auth/auth_controller.js';

const couponRouter = express.Router();

couponRouter.route("/").post(protectedRoutes, allowedTo("user", "admin"), validate(createCouponValidation), coupon.createCoupon).get(coupon.getAllCoupons);

couponRouter.route("/:id").put(protectedRoutes, allowedTo("admin", "user"), validate(updateCouponValidation), coupon.updateCoupon).delete(protectedRoutes, allowedTo("user", "admin"), validate(deleteCouponValidation), coupon.deleteCoupon).get(validate(getSpecificCouponValidation), coupon.getSpecificCoupon);

export default couponRouter;