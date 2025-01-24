import slugify from "slugify";
import { catchAsyncError } from '../../utils/catch_async_error';
import { AppError } from '../../utils/app_error';
import { brandModel } from '../../models/brand_model';
import { deleteOne } from '../../handler/factor';
import { ApiFeatures } from '../../utils/api_feature';

const addBrand = catchAsyncError(async (req, res, next) => {
    req.body.slug = slugify(req.body.name);
    const addBrand = new brandModel(req.body);
    await addBrand.save();

    res.status(201).json({ message: "success", addBrand });
});

const getAllBrands = catchAsyncError(async (req, res, next) => {
    let apiFeature = new ApiFeatures(brandModel.find(), req.query)
        .pagination()
        .fields()
        .filteration()
        .search()
        .sort();
    const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;
    const getAllBrands = await apiFeature.mongooseQuery;

    res.status(201).json({ page: PAGE_NUMBER, message: "success", getAllBrands });
});

const updateBrand = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    req.body.slug = slugify(req.body.name);
    const updateBrand = await brandModel.findByIdAndUpdate(id, req.body, {
        new: true,
    });

    updateBrand && res.status(201).json({ message: "success", updateBrand });

    !updateBrand && next(new AppError("Brand was not found", 404));
});

const deleteBrand = deleteOne(brandModel, "brand");
export { addBrand, getAllBrands, updateBrand, deleteBrand };