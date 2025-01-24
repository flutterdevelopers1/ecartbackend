import { userModel } from '../../models/user_model';
import { AppError } from '../../utils/app_error';
import { catchAsyncError } from '../../utils/catch_async_error';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const signUp = catchAsyncError(async (req, res, next) => {
    let isUserExist = await userModel.findOne({ email: req.body.email });
    if (isUserExist) {
        return next(new AppError("Account is already exist!", 409));
    }
    const user = new userModel(req.body);
    await user.save();

    let token = jwt.sign(
        { email: user.email, name: user.name, id: user._id, role: user.role },
        "JR"
    );
    res.status(201).json({ message: "success", user, token });
});

const signIn = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return next(new AppError("Invalid email or password", 401));
    }
    let token = jwt.sign(
        { email: user.email, name: user.name, id: user._id, role: user.role },
        "JR"
    );
    res.status(201).json({ message: "success", token });
});

const protectedRoutes = catchAsyncError(async (req, res, next) => {
    const { token } = req.headers;
    if (!token) return next(new AppError("Token was not provided!", 401));

    let decoded = await jwt.verify(token, "JR");

    let user = await userModel.findById(decoded.id);
    if (!user) return next(new AppError("Invalid user", 404));

    if (user.passwordChangedAt) {
        let passwordChangedAt = parseInt(user.passwordChangedAt.getTime() / 1000);
        if (passwordChangedAt > decoded.iat)
            return next(new AppError("Invalid token", 401));
    }

    req.user = user;
    next();
});

const allowedTo = (...roles) => {
    return catchAsyncError(async (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(
                new AppError(
                    `You are not authorized to access this route. Your are ${req.user.role}`,
                    401
                )
            );
        next();
    });
};
export { signUp, signIn, protectedRoutes, allowedTo };