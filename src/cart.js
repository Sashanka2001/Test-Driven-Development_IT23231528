class Cart {
  constructor(catalog, inventory) {
    this.catalog = catalog;
    this.inventory = inventory || { getAvailable: () => Infinity };
    this.items = new Map();
  }
  add(sku, qty = 1) {
    const product = this.catalog.findBySku(sku);
    if (!product) throw new Error('product not found');
    if (!Number.isInteger(qty) || qty <= 0) throw new Error('invalid quantity');
    const available = this.inventory.getAvailable(sku);
    const existing = this.items.get(sku) || 0;
    if (qty + existing > available) throw new Error('insufficient inventory');
    this.items.set(sku, existing + qty);
  }
  remove(sku, qty = 1) {
    const existing = this.items.get(sku) || 0;
    if (qty >= existing) {
      this.items.delete(sku);
      return;
    }
    this.items.set(sku, existing - qty);
  }
  total() {
    let sum = 0;
    for (const [sku, qty] of this.items.entries()) {
      const product = this.catalog.findBySku(sku);
      if (!product) continue; // skip unknown products
      sum += product.price * qty;
    }
    return sum;
  }
}
module.exports = { Cart };
