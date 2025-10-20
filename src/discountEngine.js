class DiscountEngine {
  constructor(rules = []) {
    // if no rules supplied, use sensible defaults
    if (!rules || rules.length === 0) {
      this.rules = [defaultBulkRule(), orderDiscountRule()];
    } else {
      this.rules = rules;
    }
  }

  apply(cart) {
    // compute subtotal
    const subtotal = cart.total();
    // apply line-based rules first (e.g. bulk discounts)
    let lineDiscount = 0;
    for (const rule of this.rules) {
      if (rule && rule.isLine) lineDiscount += rule(cart);
    }
    // subtotal after line discounts
    const subtotalAfterLines = subtotal - lineDiscount;
    // apply order-level rules against the subtotal after line discounts
    let orderDiscount = 0;
    for (const rule of this.rules) {
      if (rule && rule.isOrder) {
        const proxy = Object.create(cart);
        proxy.total = () => subtotalAfterLines;
        orderDiscount += rule(proxy);
      }
    }
    const discount = lineDiscount + orderDiscount;
    return { subtotal, discount, total: subtotal - discount };
  }
}
// export at bottom after helper functions

// helpers for rules:
function bulkDiscountRule(sku) {
  const fn = (cart) => {
    const qty = cart.items.get(sku) || 0;
    if (qty >= 10) {
      const p = cart.catalog.findBySku(sku);
      return p.price * qty * 0.10;
    }
    return 0;
  };
  fn.isLine = true;
  return fn;
}

function orderDiscountRule() {
  const fn = (cart) => {
    const subtotal = cart.total();
    if (subtotal >= 1000) return subtotal * 0.05;
    return 0;
  };
  fn.isOrder = true;
  return fn;
}

// default bulk rule: apply 10% off any line with qty >= 10
function defaultBulkRule() {
  const fn = (cart) => {
    let discount = 0;
    for (const [sku, qty] of cart.items.entries()) {
      if (qty >= 10) {
        const p = cart.catalog.findBySku(sku);
        if (!p) continue;
        discount += p.price * qty * 0.10;
      }
    }
    return discount;
  };
  fn.isLine = true;
  return fn;
}

module.exports = { DiscountEngine, bulkDiscountRule, orderDiscountRule };
