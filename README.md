Take home activity - Test Driven Development
Focus: Practice TDD by building small, testable slices of an e‑commerce platform. Follow Red → Green → Refactor for each requirement and produce short test logs / explanations.

Project Setup Suggestions
Create a small repo with separate folders for src/ and tests/.
Keep implementations tiny — one function / class per file so unit tests remain focused.
Use mocks/stubs for external systems (payment gateway, inventory API) during early exercises.
CI note: Add a minimal workflow to run tests on push as a bonus exercise.
Activity — Requirements (work through each using TDD)
Requirement A — Product Model & Catalog
Build a minimal Product model and a Catalog that can add and search products by SKU.

Behaviour to cover with tests:

Creating a product requires sku, name, and price (non‑negative).
Catalog can add products and return a product by sku.
Searching for a missing SKU returns null / None / undefined.
RED — Failing Test
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

Test Output (RED)
PS C:\Users\Sashanka\Music\tdd-shop> npm test

> tdd-shop@1.0.0 test
> jest --runInBand

 FAIL  tests/product.catalog.test.js
  ● Test suite failed to run

    Cannot find module '../src/product' from 'tests/product.catalog.test.js'

      1 | // tests/product.catalog.test.js
    > 2 | const { Product } = require('../src/product');
        |                     ^
      3 | const { Catalog } = require('../src/catalog');
      4 |
      5 | test('creating a product requires sku name and non-negative price', () => {

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/index.js:863:11)
      at Object.require (tests/product.catalog.test.js:2:21)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        1.46 s
Ran all test suites.
GREEN — Minimal Implementation
product.js 

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


catalog.js

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

Test Output (GREEN)
PS C:\Users\Sashanka\Music\tdd-shop> npm test

> tdd-shop@1.0.0 test
> jest --runInBand

 PASS  tests/product.catalog.test.js
  √ creating a product requires sku name and non-negative price (14 ms)
  √ catalog can add and find by sku (1 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.845 s
Ran all test suites.
REFACTOR

Hints: Keep Product validation separate from Catalog logic. Prefer value objects for price to simplify later discount calculations.
Requirement B — Shopping Cart: Add / Remove / Total
Implement a Cart that lets you add line items (product SKU + quantity), remove items, and compute the cart total.

Adding a product not in the catalog should raise / return an error.
Quantity must be an integer > 0.
Total sums (price * quantity) across items.
RED — Failing Test
# Failing tests: add_item, remove_item, total_calculation
Test Output (RED)
Failing output here
GREEN — Minimal Implementation
# Minimal Cart implementation to pass the tests (handle add/remove/total)
Test Output (GREEN)
Passing output here
REFACTOR
Refactor: e.g., extract LineItem class, validate negative prices/quantities
Testing tip: mock Catalog lookups in Cart tests so cart tests focus only on cart behaviour.
Requirement C — Inventory Reservation
Add inventory checks when adding items to the cart. The inventory service exposes getAvailable(sku).

When adding items, ensure requested quantity ≤ available quantity.
Write tests that simulate low inventory using mocks/stubs.
If inventory insufficient, the add operation should fail with a clear error.
RED — Failing Test
# Test that adding more than available triggers a failure (mock inventory)
Test Output (RED)
Failing output here
GREEN — Minimal Implementation
# Minimal cart change: call inventory.getAvailable(sku) and reject if insufficient
Test Output (GREEN)
Passing output here
REFACTOR
Refactor notes: extract InventoryGateway interface to make tests easier
Use dependency injection to provide a fake inventory service in tests.
Requirement D — Discount Rules
Introduce a discount engine with rules that can apply to the cart. Start with two rules:

Bulk discount: If quantity >= 10 for a single SKU, apply 10% off that line.
Order discount: If cart total >= 1000, apply a 5% discount to the order subtotal.
RED — Failing Test
# Tests for bulk discount and order discount (failing)
Test Output (RED)
Failing output here
GREEN — Minimal Implementation
# Implement discount engine to make tests pass (keep it pluggable for new rules)
Test Output (GREEN)
Passing output here
REFACTOR
Refactor: make rules configurable, extract strategy pattern
Keep discount rule implementations small and unit-test each rule separately.
Requirement E — Checkout Validation & Payment
Implement a simple checkout flow that validates the cart and attempts to charge a payment gateway client.

Checkout should: validate items are still available, compute final total (after discounts), and call paymentGateway.charge(amount, token).
Use a fake payment gateway in tests to simulate success and failure.
On payment failure, the checkout should return a meaningful error and not create an order record.
RED — Failing Test
# Tests for successful checkout and for payment failure (failing)
Test Output (RED)
Failing output here
GREEN — Minimal Implementation
# Minimal checkout implementation using injected payment gateway (make simple happy path pass)
Test Output (GREEN)
Passing output here
REFACTOR
Refactor: split validation, payment, and order creation into services
Design checkout as an application service orchestrating smaller units. Unit test units in isolation and write a couple of integration tests for the orchestration.
Requirement F — Order History & Simple Persistence
When checkout succeeds, create a minimal Order record with line items, total, and timestamp. Provide a repository interface that can be faked for tests.

RED — Failing Test
# Test that successful checkout creates an order (use fake repo)
Test Output (RED)
Failing output here
GREEN — Minimal Implementation
# Save an Order object to the fake repository on success
Test Output (GREEN)
Passing output here
REFACTOR
Refactor: map domain objects to persistence model, add basic serialization
Advanced / Extension Challenges (optional)
Property‑based testing for cart totals (e.g., Hypothesis / fast-check).
Introduce concurrency tests for inventory reservation (simulate two carts reserving same SKU).
Add integration tests that spin up a minimal in‑memory DB (SQLite / in‑memory) and run the checkout flow end‑to‑end.
Set up a CI workflow that runs tests and fails the build on regressions.