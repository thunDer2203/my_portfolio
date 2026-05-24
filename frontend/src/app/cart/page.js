"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {redirect} from "next/navigation";
import AuthModal from "../../components/AuthModal";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const FALLBACK =
  "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80";



export default function CartPage() {

    const [showModal, setShowModal] = useState(false);
const [paymentOrderId, setPaymentOrderId] = useState("");   

    async function handleCheckout() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          items: cart,
        }),
      }
    );

    const data = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,

      amount: data.order.amount,

      currency: data.order.currency,

      name: "Mharo",

      description: "Order Payment",

      order_id: data.order.id,

      handler: async function (response) {
        const verifyRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payment/verify`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,

              items: cart,
            }),
          }
        );

        const verifyData = await verifyRes.json();
        async function clearCart() {
          await fetch(`${BASE}/cart/clear`, {
            method: "DELETE",
            credentials: "include",
          });
        }
        clearCart();
        // SHOW MODAL
        setPaymentOrderId(verifyData.orderId);
        setShowModal(true);
      },

      theme: {
        color: "#6B4F3B",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();
  } catch (err) {
    console.error(err);
  }
}

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const res = await fetch(`${BASE}/cart`, {
        credentials: "include",
      });

      const data = await res.json();

      setCart(data.cart?.items || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(productId, quantity) {
    try {
      setUpdating(productId);

      const res = await fetch(`${BASE}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          items: [{ productId, quantity }],
        }),
      });

      if (res.ok) {
        if (quantity <= 0) {
          setCart((prev) =>
            prev.filter((item) => item.productId !== productId)
          );
        } else {
          setCart((prev) =>
            prev.map((item) =>
              item.productId === productId
                ? { ...item, quantity }
                : item
            )
          );
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setUpdating(null);
    }
  }

  const subtotal = cart.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  return (
    <>
      <Navbar />

      <section className="min-h-screen relative bg-[#FDF8F2] pt-28 pb-20 ">
        <div className="max-w-7xl relative pt-16 mx-auto px-6">
          <div className="flex relative items-center justify-between mb-10">
            <div>
              <h1 className="font-display text-4xl font-bold text-bark">
                Your Cart
              </h1>
            </div>

            <Link
              href="/"
              className="text-earth-600 hover:text-earth-800 text-sm font-medium underline underline-offset-4"
            >
              Continue shopping →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl bg-earth-100 animate-pulse"
                />
              ))}
            </div>
          ) : cart.length === 0 ? (
            <div className="bg-white rounded-3xl border border-earth-100 p-16 text-center">
              <h2 className="font-display text-3xl text-bark mb-3">
                Your cart is empty
              </h2>

              <p className="text-bark/60 mb-8">
                Looks like you haven&apos;t added anything yet.
              </p>

              <Link
                href="/"
                className="inline-flex px-6 py-3 rounded-full bg-earth-700 text-cream font-medium hover:bg-earth-800 transition"
              >
                Explore products
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="space-y-5">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-white rounded-3xl border border-earth-100 p-6 flex gap-5"
                  >
                    <div className="relative w-28 h-28 rounded-2xl bg-earth-50">
                      <Image
                        src={
                          item.product.image ||
                          item.product.imageUrl ||
                          item.product.img ||
                          FALLBACK
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex gap-6 justify-between items-center">
                        {/* <p className="text-xs uppercase tracking-widest text-earth-400 font-medium mb-1">
                          {item.product.category || "Product"}
                        </p> */}

                        <h2 className="font-display text-xl font-semibold text-bark">
                          {item.product.name}
                        </h2>

                        <p className="text-earth-600 mt-2 font-medium">
                          ₹
                          {item.product.price?.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4 border border-earth-300 rounded-full px-4 py-2">
                          <button
                            disabled={updating === item.productId}
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            className="cursor-pointer text-lg font-semibold text-earth-700 disabled:opacity-40"
                          >
                            -
                          </button>

                          <span className="min-w-[20px] text-center font-medium">
                            {item.quantity}
                          </span>

                          <button
                            disabled={updating === item.productId}
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            className=" cursor-pointer text-lg font-semibold text-earth-700 disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold text-bark">
                         Item total : ₹
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-3xl border border-earth-100 p-8 h-fit sticky top-28">
                <h2 className="font-display text-2xl font-bold text-bark mb-8">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-bark/70">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between text-bark/70">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>

                  <div className="border-t border-earth-100 pt-4 flex justify-between font-semibold text-lg text-bark">
                    <span>Total</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button className="w-full py-4 rounded-full bg-earth-700 text-cream font-semibold hover:bg-earth-800 transition">
                  Proceed to Checkout
                </button>

                <p className="text-xs text-bark/50 text-center mt-4">
                  Secure checkout powered by Mharo
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-center ">
          <button onClick={handleCheckout} className="bg-amber-800 py-3 w-3/4 px-5 rounded-xl font-semibold hover:bg-amber-900  transition mt-2 cursor-pointer">
        Checkout -&gt;
            </button>
            </div>
        </div>
        
        {showModal && (
  <AuthModal
    mode="payment"
    orderId={paymentOrderId}
    onClose={() => setShowModal(false)}
  />
)}
      </section>

      <Footer />
    </>
  );
}