const express = require('express');
const catchSyncErrors = require("../utils/catchAsyncErrors");
const STRIPE_API_KEY = "pk_test_51JhU1RSEMlR408JMwSSPbvTACKuy5FHKxbNrjxtJQv2BuY8gFXYEtmojaSyvKaPJd5IYFlEXaWf5nVNVLDDVrsqL00sJHeSZvW";
const STRIPE_SECRET_KEY = "sk_test_51JhU1RSEMlR408JMix7I0HCyGYe9Fok8LfGcOVk6q4rgJ2mNiLVcU6vlGQzW0sRolEz8vhGR0zsuHMegoc5DXFj200CM366j4O";
const { isAuthenticatedUser } = require("../middleware/isAuthenticatedUser");
const stripe = require("stripe")(STRIPE_SECRET_KEY);
const router = express.Router();

// ROUTE 1: Create new Order
router.post(
  "/payment/process",
  isAuthenticatedUser,
  catchSyncErrors(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      metadata: {
        company: "Ecommerce",
      },
    });

    res
      .status(200)
      .json({ success: true, client_secret: myPayment.client_secret });
  })
);

// Router 2: Get Stripe Api Key
router.get(
  "/stripeapikey",
  isAuthenticatedUser,
  catchSyncErrors(async (req, res, next) => {
    try {
      res.status(200).json({
        stripeApiKey:
          STRIPE_API_KEY,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 404));
    }
  })
);


module.exports = router;
