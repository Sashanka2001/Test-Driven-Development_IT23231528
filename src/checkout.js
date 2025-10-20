// src/checkout.js
class Checkout {
  constructor({ inventory, paymentGateway, orderRepo, discountEngine } = {}) {
    this.inventory = inventory;
    this.paymentGateway = paymentGateway;
    this.orderRepo = orderRepo || { saveOrder: async () => null };
    this.discountEngine = discountEngine || { apply: () => ({ total: 0, subtotal: 0, discount: 0 }) };
  }

  async run(cart, token) {
    // validate inventory
    for (const [sku, qty] of cart.items.entries()) {
      const avail = this.inventory.getAvailable(sku);
      if (qty > avail) return { success: false, error: 'insufficient inventory' };
    }
    // compute total after discounts
    const { total } = this.discountEngine.apply(cart);
    // charge
    const chargeRes = await this.paymentGateway.charge(total, token);
    if (!chargeRes.success) {
      return { success: false, error: chargeRes.error || 'payment failed' };
    }
    // create order record
    const order = { id: `order_${Date.now()}`, items: Array.from(cart.items.entries()), total, createdAt: new Date().toISOString() };
    await this.orderRepo.saveOrder(order);
    return { success: true, paymentId: chargeRes.id, orderId: order.id };
  }
}
module.exports = { Checkout };
