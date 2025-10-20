const { Catalog } = require('../src/catalog');
const { Product } = require('../src/product');
const { Cart } = require('../src/cart');

test('adding more than available should fail', () => {
  const catalog = new Catalog();
  const p = new Product({ sku: 'S1', name: 'S', price: 3 });
  catalog.add(p);

  // fake inventory that returns 2 available
  const fakeInventory = { getAvailable: (sku) => 2 };
  const cart = new Cart(catalog, fakeInventory);

  expect(() => cart.add('S1', 3)).toThrow(/insufficient inventory/);
});
