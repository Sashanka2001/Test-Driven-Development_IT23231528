// tests/product.catalog.test.js
const { Product } = require('../src/product');
const { Catalog } = require('../src/catalog');

test('creating a product requires sku name and non-negative price', () => {
  expect(() => new Product({ sku: 'A1', name: 'Widget' })).toThrow();
  expect(() => new Product({ sku: 'A2', name: 'Gadget', price: -5 })).toThrow();
});

test('catalog can add and find by sku', () => {
  const catalog = new Catalog();
  const p = new Product({ sku: 'AX1', name: 'X', price: 10 });
  catalog.add(p);
  expect(catalog.findBySku('AX1')).toBe(p);
  expect(catalog.findBySku('NOPE')).toBeNull();
});
