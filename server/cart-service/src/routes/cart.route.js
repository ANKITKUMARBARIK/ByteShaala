import { Router } from "express";
import {
    addToCart,
    getCart,
    removeFromCart,
    clearCart,
} from "../controllers/cart.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
    addToCartSchema,
    removeFromCartSchema,
} from "../validations/cart.validation.js";

const router = Router();

router.route("/add-cart").post(validate(addToCartSchema), addToCart);

router.route("/get-cart").get(getCart);

router
    .route("/remove-cart")
    .delete(validate(removeFromCartSchema), removeFromCart);

router.route("/clear-cart").delete(clearCart);

export default router;
