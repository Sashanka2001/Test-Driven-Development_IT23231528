// tests/cart.test.js
const { Catalog } = require('../src/catalog');
const { Product } = require('../src/product');
const { Cart } = require('../src/cart');

test('add item not in catalog should throw', () => {
  const catalog = new Catalog();
  const cart = new Cart(catalog);
  expect(() => cart.add('MISSING', 1)).toThrow();
});

test('quantity must be integer > 0', () => {
  const catalog = new Catalog();
  const p = new Product({ sku: 'P1', name: 'P', price: 5 });
  catalog.add(p);
  const cart = new Cart(catalog);
  expect(() => cart.add('P1', 0)).toThrow();
  expect(() => cart.add('P1', -1)).toThrow();
});

test('total sums price * quantity', () => {
  const catalog = new Catalog();
  catalog.add(new Product({ sku: 'P1', name: 'P', price: 5 }));
  catalog.add(new Product({ sku: 'P2', name: 'Q', price: 20 }));
  const cart = new Cart(catalog);
  cart.add('P1', 2); // 10
  cart.add('P2', 1); // 20
  expect(cart.total()).toBe(30);
});
