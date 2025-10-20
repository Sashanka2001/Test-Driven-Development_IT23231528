// tests/checkout.test.js
const { Catalog } = require('../src/catalog');
const { Product } = require('../src/product');
const { Cart } = require('../src/cart');
const { Checkout } = require('../src/checkout');

test('successful checkout charges and returns order id', async () => {
  const c = new Catalog();
  c.add(new Product({ sku: 'C1', name: 'C', price: 100 }));
  const cart = new Cart(c);
  cart.add('C1', 1);
  const fakePayment = { charge: async (amount, token) => ({ success: true, id: 'pay_1' }) };
  const fakeInventory = { getAvailable: () => 10 };
  const checkout = new Checkout({ inventory: fakeInventory, paymentGateway: fakePayment });
  const res = await checkout.run(cart, 'tok_abc');
  expect(res.success).toBe(true);
  expect(res.paymentId).toBe('pay_1');
});

test('payment failure does not create order', async () => {
  // simulate charge failure
  const c = new Catalog();
  c.add(new Product({ sku: 'C2', name: 'D', price: 50 }));
  const cart = new Cart(c);
  cart.add('C2', 1);
  const fakePayment = { charge: async () => ({ success: false, error: 'card declined' }) };
  const repo = { saveOrder: jest.fn() };
  const checkout = new Checkout({ paymentGateway: fakePayment, orderRepo: repo, inventory: { getAvailable: () => 10 } });
  const res = await checkout.run(cart, 'tok_bad');
  expect(res.success).toBe(false);
  expect(repo.saveOrder).not.toHaveBeenCalled();
});
