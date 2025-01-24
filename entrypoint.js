import addressRouter from './components/address/address_router';
import authRouter from './components/auth/auth_routes';
import brandRouter from './components/brand/brand_routes';
import cartRouter from './components/cart/cart_routes';
import categoryRouter from './components/category/category_routes';
import couponRouter from './components/coupon/coupon_routes';
import orderRouter from './components/order/order_routes';
import productRouter from './components/products/product_routes';
import reviewRouter from './components/review/review_routes';
import subCategoryRouter from './components/subcategory/subcategory_routes';
import userRouter from './components/user/user_routes';
import wishListRouter from './components/wishlist/wishlist_routes';
import { AppError } from './utils/app_error';
import { globalErrorHandling } from './middleware/global_error_handler';

export function entrypoint(app) {
    app.use("/api/v1/categories", categoryRouter);
    app.use("/api/v1/subcategories", subCategoryRouter);
    app.use("/api/v1/brands", brandRouter);
    app.use("/api/v1/products", productRouter);
    app.use("/api/v1/users", userRouter);
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/review", reviewRouter);
    app.use("/api/v1/wishlist", wishListRouter);
    app.use("/api/v1/address", addressRouter);
    app.use("/api/v1/coupons", couponRouter);
    app.use("/api/v1/carts", cartRouter);
    app.use("/api/v1/orders", orderRouter);

    app.all("*", (req, res, next) => {
        next(new AppError("Endpoint was not found", 404));
    });

    app.use(globalErrorHandling);
}