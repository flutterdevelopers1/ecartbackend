import { catchAsyncError } from '../../utils/catch_async_error';
import { AppError } from '../../utils/app_error';
import { deleteOne } from '../../handler/factor';
import { ApiFeatures } from '../../utils/api_feature';
import { couponModel } from '../../models/coupon_model';

const createCoupon = catchAsyncError(async (req, res, next) => {
    const createCoupon = new couponModel(req.body);
    await createCoupon.save();

    res.status(201).json({ message: "success", createCoupon });
});

const getAllCoupons = catchAsyncError(async (req, res, next) => {
    let apiFeature = new ApiFeatures(couponModel.find(), req.query)
        .pagination()
        .fields()
        .filteration()
        .search()
        .sort();
    const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;
    const getAllCoupons = await apiFeature.mongooseQuery;

    res
        .status(201)
        .json({ page: PAGE_NUMBER, message: "success", getAllCoupons });
});

const updateCoupon = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const updateCoupon = await couponModel.findByIdAndUpdate(id, req.body, {
        new: true,
    });

    updateCoupon && res.status(201).json({ message: "success", updateCoupon });

    !updateCoupon && next(new AppError("Coupon was not found", 404));
});

const deleteCoupon = deleteOne(couponModel, "Coupon");
export {
    createCoupon,
    getAllCoupons,
    getSpecificCoupon,
    updateCoupon,
    deleteCoupon,
};