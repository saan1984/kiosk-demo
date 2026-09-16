// Kiosk's shipping address. One in-memory string, same scope discipline as
// the cart. This exists to give Chapter 6's attack a real destination, not to
// be a shipping feature.
let shippingAddress = 'Not set';

export function getShippingAddress() {
  return shippingAddress;
}

export function setShippingAddress(address) {
  shippingAddress = address;
}
