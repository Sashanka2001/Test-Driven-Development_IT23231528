// src/catalog.js
class Catalog {
  constructor() { this._items = new Map(); }
  add(product) {
    if (!product || !product.sku) throw new Error('invalid product');
    this._items.set(product.sku, product);
  }
  findBySku(sku) {
    return this._items.get(sku) || null;
  }
}
module.exports = { Catalog };
