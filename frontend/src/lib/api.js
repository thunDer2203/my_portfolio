// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// export async function getProducts() {
//   try {
//     const res = await fetch(`${BASE_URL}/products`, { cache: "no-store" });
//     if (!res.ok) return [];
//     const data = await res.json();
//     return Array.isArray(data) ? data : data.products ?? [];
//   } catch {
//     return [];
//   }
// }

// export async function addToCart(items) {
//   const res = await fetch(`${BASE_URL}/cart/add`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ items }),
//   });
//   return res.json();
// }

// export async function createOrder(items) {
//   const res = await fetch(`${BASE_URL}/orders/create`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ items }),
//   });
//   return res.json();
// }

// export async function login({ email, password }) {
//   const res = await fetch(`${BASE_URL}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ email, password }),
//   });
//   return res.json();
// }

// export async function register({ username, email, password, phone }) {
//   const res = await fetch(`${BASE_URL}/auth/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ username, email, password, phone }),
//   });
//   return res.json();
// }

// export async function logout() {
//   const res = await fetch(`${BASE_URL}/auth/logout`, {
//     method: "POST",
//     credentials: "include",
//   });
//   return res.json();
// }
