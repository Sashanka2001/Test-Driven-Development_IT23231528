// src/product.js
class Product {
  constructor({ sku, name, price }) {
    if (!sku || !name || price === undefined) throw new Error('missing fields');
    if (typeof price !== 'number' || price < 0) throw new Error('invalid price');
    this.sku = sku;
    this.name = name;
    this.price = price;
  }
}
module.exports = { Product };
