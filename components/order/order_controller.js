import { catchAsyncError } from '../../utils/catch_async_error.js';
import { AppError } from '../../utils/app_error.js';
import { cartModel } from '../../models/cart_model.js';
import { productModel } from '../../models/product_model.js';
import { orderModel } from '../../models/order_model.js';
import { userModel } from '../../models/user_model.js';
import Stripe from "stripe";


// TODO: NEED TO ADD STRIPE KEYS
const stripe = new Stripe(
    ""
);

const createCashOrder = catchAsyncError(async (req, res, next) => {
    let cart = await cartModel.findById(req.params.id);

    let totalOrderPrice = cart.totalPriceAfterDiscount
        ? cart.totalPriceAfterDiscount
        : cart.totalPrice;

    console.log(cart.cartItem);
    const order = new orderModel({
        userId: req.user._id,
        cartItem: cart.cartItem,
        totalOrderPrice,
        shippingAddress: req.body.shippingAddress,
    });

    await order.save();

    if (order) {
        let options = cart.cartItem.map((item) => ({
            updateOne: {
                filter: { _id: item.productId },
                update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
            },
        }));

        await productModel.bulkWrite(options);

        await cartModel.findByIdAndDelete(req.params.id);

        return res.status(201).json({ message: "success", order });
    } else {
        next(new AppError("Error in cart ID", 404));
    }
});

const getSpecificOrder = catchAsyncError(async (req, res, next) => {
    console.log(req.user._id);

    let order = await orderModel
        .findOne({ userId: req.user._id })
        .populate("cartItems.productId");

    res.status(200).json({ message: "success", order });
});

const getAllOrders = catchAsyncError(async (req, res, next) => {
    let orders = await orderModel.findOne({}).populate("cartItems.productId");

    res.status(200).json({ message: "success", orders });
});

const createCheckOutSession = catchAsyncError(async (req, res, next) => {
    let cart = await cartModel.findById(req.params.id);
    if (!cart) return next(new AppError("Cart was not found", 404))

    console.log(cart);

    let totalOrderPrice = cart.totalPriceAfterDiscount
        ? cart.totalPriceAfterDiscount
        : cart.totalPrice;

    let sessions = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "egp",
                    unit_amount: totalOrderPrice * 100,
                    product_data: {
                        name: req.user.name,
                    },
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: "",
        cancel_url: "",
        customer_email: req.user.email,
        client_reference_id: req.params.id,
        metadata: req.body.shippingAddress,
    });

    res.json({ message: "success", sessions });
});

const createOnlineOrder = catchAsyncError(async (request, response) => {
    const sig = request.headers["stripe-signature"].toString();

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            "whsec_fcatGuOKvXYUQoz5NWSwH9vaqdWXIWsI"
        );
    } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type == "checkout.session.completed") {
        card(event.data.object, response)


    } else {
        console.log(`Unhandled event type ${event.type}`);
    }
});



async function card(e, res) {
    let cart = await cartModel.findById(e.client_reference_id);

    if (!cart) return next(new AppError("Cart was not found", 404))

    let user = await userModel.findOne({ email: e.customer_email })
    const order = new orderModel({
        userId: user._id,
        cartItem: cart.cartItem,
        totalOrderPrice: e.amount_total / 100,
        shippingAddress: e.metadata.shippingAddress,
        paymentMethod: "card",
        isPaid: true,
        paidAt: Date.now()
    });

    await order.save();

    if (order) {
        let options = cart.cartItem.map((item) => ({
            updateOne: {
                filter: { _id: item.productId },
                update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
            },
        }));

        await productModel.bulkWrite(options);

        await cartModel.findOneAndDelete({ userId: user._id });

        return res.status(201).json({ message: "success", order });
    } else {
        next(new AppError("Error in cart ID", 404));
    }
}

export {
    createCashOrder,
    getSpecificOrder,
    getAllOrders,
    createCheckOutSession,
    createOnlineOrder,
};