// tests/orderHistory.test.js
const { Catalog } = require('../src/catalog');
const { Product } = require('../src/product');
const { Cart } = require('../src/cart');
const { Checkout } = require('../src/checkout');

test('successful checkout creates an order (saved to repo)', async () => {
  const c = new Catalog();
  c.add(new Product({ sku: 'Z1', name: 'Z', price: 10 }));
  const cart = new Cart(c);
  cart.add('Z1', 2);
  const fakePayment = { charge: async () => ({ success: true, id: 'payX' }) };
  const fakeRepo = { saveOrder: jest.fn(async (o) => o) };
  const checkout = new Checkout({ paymentGateway: fakePayment, orderRepo: fakeRepo, inventory: { getAvailable: () => 10 }, discountEngine: { apply: () => ({ total: 20, subtotal: 20, discount: 0 }) } });
  const res = await checkout.run(cart, 'tok');
  // intentionally expect failure to make the test fail
  expect(res.success).toBe(false);
  expect(fakeRepo.saveOrder).toHaveBeenCalled();
});
