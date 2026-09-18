import { searchProducts, getProduct } from './products.js';
import { addToCart, removeFromCart, clearCart, getCart, getCartSummary, onCartChange } from './cart.js';

const form = document.getElementById('search-form');
const results = document.getElementById('results');
const cart = document.getElementById('cart');
const cartLines = document.getElementById('cart-lines');
const cartTotal = document.getElementById('cart-total');
const cartSummary = document.getElementById('cart-summary');
const checkoutBtn = document.getElementById('checkout-btn');

function render(products) {
  results.innerHTML = '';
  if (products.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'No products match.';
    results.appendChild(li);
    return;
  }
  for (const p of products) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>
        <span class="product-name">${p.name}</span>
        <span class="product-cat">${p.category}</span>
      </span>
      <span class="product-price">$${p.price}</span>
      <button class="add-btn" type="button" data-id="${p.id}">Add</button>
    `;
    results.appendChild(li);
  }
}

// One click handler for the whole list — every "Add" button uses the same
// underlying addToCart the add-to-cart tool calls. Same capability, two doors.
results.addEventListener('click', (event) => {
  const button = event.target.closest('.add-btn');
  if (button) addToCart(button.dataset.id);
});

cartLines.addEventListener('click', (event) => {
  const button = event.target.closest('.remove-btn');
  if (button) removeFromCart(button.dataset.id);
});

function renderCart() {
  const items = getCart();
  const { itemCount, total } = getCartSummary();

  cart.hidden = items.length === 0;
  cartLines.innerHTML = '';
  for (const item of items) {
    const product = getProduct(item.productId);
    const lineTotal = product.price * item.quantity;
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="cart-name">${product.name}</span>
      <span class="cart-qty">×${item.quantity}</span>
      <span class="cart-line-total">$${lineTotal.toFixed(2)}</span>
      <button class="remove-btn" type="button" data-id="${item.productId}">Remove</button>
    `;
    cartLines.appendChild(li);
  }
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;

  cartSummary.textContent = itemCount === 0
    ? 'Your cart is empty'
    : `${itemCount} item${itemCount === 1 ? '' : 's'} · $${total.toFixed(2)}`;
  // A disabled button and an absent tool are the same decision — see Chapter 5.
  checkoutBtn.disabled = itemCount === 0;
}

checkoutBtn.addEventListener('click', () => {
  const { itemCount, total } = getCartSummary();
  clearCart();
  window.alert(`Order placed for ${itemCount} item(s), $${total.toFixed(2)}. (Demo — no payment taken.)`);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const results = searchProducts({ query: data.get('query') ?? '', category: data.get('category') ?? '' });
  render(results);
  // The search-products declarative tool (§2.5). Kiosk handles submit in the
  // page, so an agent's call would hang without respondWith: it hands the
  // result back and tells the browser not to navigate. It throws on a submit a
  // person made, and this one handler runs for both, so ask which it is first.
  if (event.agentInvoked) {
    event.respondWith(Promise.resolve({
      content: [{ type: 'text', text: `${results.length} product(s) match.` }],
    }));
  }
});

onCartChange(renderCart);

// Show everything on first load, same as any ordinary storefront.
render(searchProducts());
renderCart();
