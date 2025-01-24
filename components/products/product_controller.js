import slugify from "slugify";
import { catchAsyncError } from "../../utils/catch_async_error";
import { AppError } from "../../utils/app_error";
import { deleteOne } from '../../handler/factor';
import { productModel } from "../../models/product_model";
import { ApiFeatures } from '../../utils/api_feature';


const addProduct = catchAsyncError(async (req, res, next) => {
    req.body.imgCover = req.files.imgCover[0].filename;
    req.body.images = req.files.images.map((ele) => ele.filename);

    req.body.slug = slugify(req.body.title);
    const addProduct = new productModel(req.body);
    await addProduct.save();

    res.status(201).json({ message: "success", addProduct });
});

const getAllProducts = catchAsyncError(async (req, res, next) => {
    let apiFeature = new ApiFeatures(productModel.find(), req.query)
        .pagination()
        .fields()
        .filteration()
        .search()
        .sort();
    const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;
    const getAllProducts = await apiFeature.mongooseQuery;

    res
        .status(201)
        .json({ page: PAGE_NUMBER, message: "success", getAllProducts });
});
const getSpecificProduct = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const getSpecificProduct = await productModel.findByIdAndUpdate(id);
    res.status(201).json({ message: "success", getSpecificProduct });
});

const updateProduct = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await productModel.findByIdAndUpdate(id, req.body, {
        new: true,
    });

    updateProduct && res.status(201).json({ message: "success", updateProduct });

    !updateProduct && next(new AppError("Product was not found", 404));
});

const deleteProduct = deleteOne(productModel, "Product");
export {
    addProduct,
    getAllProducts,
    getSpecificProduct,
    updateProduct,
    deleteProduct,
};