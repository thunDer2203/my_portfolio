import express from "express";
import prisma from "../lib/db.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { razorpay } from "../lib/razorpay.js";
import crypto from "crypto";

const router = express.Router();



// CREATE RAZORPAY ORDER

router.post(
  "/create-order",
  protectRoute,
  async (req, res) => {
    try {
      const { items } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({
          message: "Cart is empty",
        });
      }

      const productIds = items.map(
        (item) => item.productId
      );

      const products = await prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
          isDeleted: false,
        },
      });

      let totalPrice = 0;

      for (const item of items) {
        const product = products.find(
          (p) => p.id === item.productId
        );

        if (!product) {
          return res.status(400).json({
            message: "Product not found",
          });
        }

        // PRE-CHECK ONLY
        // FINAL CHECK HAPPENS IN VERIFY ROUTE

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `${product.name} is out of stock`,
          });
        }

        totalPrice +=
          product.price * item.quantity;
      }

      const razorpayOrder =
        await razorpay.orders.create({
          amount: totalPrice * 100,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        });

      res.json({
        success: true,
        order: razorpayOrder,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message: "Failed to create order",
      });
    }
  }
);



// VERIFY PAYMENT + CREATE ORDER

router.post(
  "/verify",
  protectRoute,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        items,
      } = req.body;

      // VERIFY PAYMENT SIGNATURE

      const generatedSignature = crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          razorpay_order_id +
            "|" +
            razorpay_payment_id
        )
        .digest("hex");

      if (
        generatedSignature !==
        razorpay_signature
      ) {
        return res.status(400).json({
          message: "Invalid payment signature",
        });
      }

      // PREVENT DUPLICATE PAYMENTS

      const existingOrder =
        await prisma.order.findFirst({
          where: {
            paymentId: razorpay_payment_id,
          },
        });

      if (existingOrder) {
        return res.status(400).json({
          message: "Order already exists",
        });
      }

      // TRANSACTION

      const order = await prisma.$transaction(
        async (tx) => {

          // FETCH LATEST PRODUCTS INSIDE TRANSACTION

          const productIds = items.map(
            (item) => item.productId
          );

          const products =
            await tx.product.findMany({
              where: {
                id: {
                  in: productIds,
                },
                isDeleted: false,
              },
            });

          let totalPrice = 0;

          // ATOMIC STOCK CHECK + DECREMENT

          for (const item of items) {
            const product = products.find(
              (p) =>
                p.id === item.productId
            );

            if (!product) {
              throw new Error(
                "Product not found"
              );
            }

            const updated =
              await tx.product.updateMany({
                where: {
                  id: product.id,

                  stock: {
                    gte: item.quantity,
                  },
                },

                data: {
                  stock: {
                    decrement:
                      item.quantity,
                  },
                },
              });

            // IF STOCK UPDATE FAILED

            if (updated.count === 0) {
              throw new Error(
                `${product.name} went out of stock`
              );
            }

            totalPrice +=
              product.price *
              item.quantity;
          }

          // CREATE ORDER

          const newOrder =
            await tx.order.create({
              data: {
                userId,

                totalPrice,

                paymentId:
                  razorpay_payment_id,

                status: "PAID",

                razorpayOrderId:
                  razorpay_order_id,
              },
            });

          // CREATE ORDER ITEMS

          for (const item of items) {
            const product = products.find(
              (p) =>
                p.id === item.productId
            );

            await tx.orderItem.create({
              data: {
                orderId: newOrder.id,

                productId: product.id,

                quantity: item.quantity,

                price: product.price,
              },
            });
          }

          return newOrder;
        }
      );

      res.json({
        success: true,
        orderId: order.id,
        message:
          "Payment verified and order created",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        message:
          err.message ||
          "Payment verification failed",
      });
    }
  }
);

export default router;