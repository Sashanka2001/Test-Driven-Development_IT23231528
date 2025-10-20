// tests/discounts.test.js
const { Catalog } = require('../src/catalog');
const { Product } = require('../src/product');
const { Cart } = require('../src/cart');
const { DiscountEngine } = require('../src/discountEngine');

test('bulk discount applies 10% for qty >= 10 on same SKU', () => {
  const c = new Catalog();
  c.add(new Product({ sku: 'B1', name: 'Bulk', price: 100 }));
  const cart = new Cart(c);
  cart.add('B1', 10);
  const engine = new DiscountEngine([/* rules injected */]);
  const result = engine.apply(cart);
  // result should include discounts amount; we assert final total
  expect(result.total).toBeCloseTo(100 * 10 * 0.9); // 10% off line
});

test('order discount applies 5% when subtotal >= 1000', () => {
  const c = new Catalog();
  c.add(new Product({ sku: 'O1', name: 'High', price: 500 }));
  const cart = new Cart(c);
  cart.add('O1', 2); // 1000
  const engine = new DiscountEngine([/* rules */]);
  const result = engine.apply(cart);
  expect(result.total).toBeCloseTo(1000 * 0.95);
});
