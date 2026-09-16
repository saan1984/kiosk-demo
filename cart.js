// Kiosk's cart. An in-memory array is all it is, and it resets on reload, on
// purpose — Kiosk is a product list and a cart, nothing more.
import { getProduct } from './products.js';

const cart = [];
const listeners = new Set();

// Chapter 5 registers and unregisters tools based on whether the cart is
// empty. This is the only hook it needs: call every listener after any
// mutation, and let each listener decide what "changed" means for it.
export function onCartChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  for (const fn of listeners) fn();
}

export function getCart() {
  return cart.map((item) => ({ ...item }));
}

export function addToCart(productId, quantity = 1) {
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  notify();
  return getCart();
}

export function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.productId === productId);
  if (index === -1) return false;
  cart.splice(index, 1);
  notify();
  return true;
}

export function clearCart() {
  cart.length = 0;
  notify();
}

export function getCartSummary() {
  const itemCount = cart.reduce((n, item) => n + item.quantity, 0);
  const total = cart.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  return { itemCount, total };
}
