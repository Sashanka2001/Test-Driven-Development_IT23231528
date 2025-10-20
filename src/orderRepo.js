class InMemoryOrderRepo {
  constructor() { this.orders = []; }
  async saveOrder(order) { this.orders.push(order); return order; }
  async findAll() { return this.orders.slice(); }
}
module.exports = { InMemoryOrderRepo };
