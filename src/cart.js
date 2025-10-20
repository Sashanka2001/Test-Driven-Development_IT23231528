class Cart {
  constructor(catalog) {
    if (!catalog) throw new Error('catalog required');
    this.catalog = catalog;
    this.items = new Map(); // sku -> qty
  }

  add(sku, qty = 1) {
    const product = this.catalog.findBySku(sku);
    if (!product) throw new Error('product not found');
    if (!Number.isInteger(qty) || qty <= 0) throw new Error('invalid quantity');
    const existing = this.items.get(sku) || 0;
    this.items.set(sku, existing + qty);
  }

  remove(sku) {
    this.items.delete(sku);
  }

  total() {
    let sum = 0;
    for (const [sku, qty] of this.items.entries()) {
      const p = this.catalog.findBySku(sku);
      sum += p.price * qty;
    }
    return sum;
  }
}
module.exports = { Cart };
