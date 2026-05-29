import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'Cash on Delivery',
  });
  
  // Checkout/Invoice states
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Load cart from localStorage
  const loadCart = () => {
    try {
      const items = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(items);
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Sync to localStorage and notify navbar badge
  const saveCart = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
    setCartItems(items);
    window.dispatchEvent(new CustomEvent('cart-updated'));
  };

  // Helper to extract a numeric price from the database price string
  const getNumericPrice = (priceStr) => {
    if (!priceStr) return 150; // fallback default
    const match = priceStr.replace(/,/g, '').match(/\d+(?:\.\d+)?/);
    if (match) {
      return parseFloat(match[0]);
    }
    return 150; // default baseline for "On Inquiry"
  };

  // CRUD: Update Item Quantity
  const handleQuantityChange = (productId, delta) => {
    const updated = cartItems.map(item => {
      if (item.product._id === productId) {
        const newQty = (item.quantity || 1) + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    saveCart(updated);
  };

  // CRUD: Delete Item
  const handleDeleteItem = (productId) => {
    const updated = cartItems.filter(item => item.product._id !== productId);
    saveCart(updated);
    setSuccessMsg('Product removed from cart.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // CRUD: Clear Cart
  const handleClearCart = () => {
    saveCart([]);
    setSuccessMsg('Cart cleared successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = getNumericPrice(item.product.price);
    return sum + price * (item.quantity || 1);
  }, 0);

  const tax = subtotal * 0.05; // 5% dynamic bio-tax
  const shipping = subtotal > 1500 ? 0 : 150; // Free shipping above Rs. 1500
  const grandTotal = subtotal + tax + shipping;

  // Billing form inputs change
  const handleBillingChange = (e) => {
    setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  // Handle Checkout / Invoice Placement
  const handleCheckout = (e) => {
    e.preventDefault();
    const { name, email, phone, address } = billingDetails;

    if (!name || !email || !phone || !address) {
      setErrorMsg('Please populate all billing details before generating invoice.');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMsg('Your cart is empty. Please add items to checkout.');
      return;
    }

    // Generate Invoice Data
    const invoiceNum = 'BBT-' + Math.floor(100000 + Math.random() * 900000);
    const invoiceDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const detailedInvoice = {
      invoiceNumber: invoiceNum,
      date: invoiceDate,
      customer: { ...billingDetails },
      items: cartItems.map(item => ({
        title: item.product.title,
        price: getNumericPrice(item.product.price),
        quantity: item.quantity,
        subtotal: getNumericPrice(item.product.price) * item.quantity
      })),
      summary: {
        subtotal,
        tax,
        shipping,
        grandTotal
      }
    };

    setInvoiceData(detailedInvoice);
    setShowInvoice(true);
    setErrorMsg('');

    // Clear cart after checkout
    saveCart([]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cart-page-container py-5 text-start">
      <div className="container">
        
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill science-font mb-2">Checkout Desk</span>
          <h1 className="science-font fw-bold text-gradient-bio">Your Selection & Billing</h1>
          <p className="text-muted" style={{ maxWidth: '700px', margin: '0 auto' }}>
            Manage your selected biotech solutions, fill out customer billing parameters, and confirm your order clearance.
          </p>
        </div>

        {/* Global Feedback Messages */}
        {successMsg && (
          <div className="alert alert-success d-flex align-items-center shadow-sm mb-4 py-2.5" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            <div>{successMsg}</div>
          </div>
        )}

        {errorMsg && (
          <div className="alert alert-danger d-flex align-items-center shadow-sm mb-4 py-2.5" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{errorMsg}</div>
          </div>
        )}

        {cartItems.length === 0 && !showInvoice ? (
          /* EMPTY CART VIEW */
          <div className="card glass-card text-center py-5 shadow-sm border border-secondary border-opacity-10">
            <div className="mb-4">
              <i className="bi bi-cart-x text-muted" style={{ fontSize: '4.5rem' }}></i>
            </div>
            <h3 className="science-font fw-bold text-dark mb-2">Cart is empty</h3>
            <p className="text-muted mb-4">You have not selected any biological systems or organic products yet.</p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/products" className="btn btn-science-primary">
                Browse Products Catalog <i className="bi bi-basket3 ms-1"></i>
              </Link>
            </div>
          </div>
        ) : showInvoice && invoiceData ? (
          /* BILLING INVOICE SUCCESS VIEW */
          <div className="invoice-container max-w-4xl mx-auto" style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div className="card border-0 shadow-lg p-4 p-md-5 bg-white" style={{ borderRadius: '24px' }} id="printable-invoice">
              
              {/* Invoice Logo & Header */}
              <div className="row g-4 align-items-center mb-4 pb-4 border-bottom">
                <div className="col-sm-6 text-center text-sm-start">
                  <div className="d-flex align-items-center justify-content-center justify-content-sm-start mb-2">
                    <span className="science-font fw-bold fs-4 text-success">BASUNDHARA</span>
                    <span className="science-font fw-light fs-4 text-dark ms-1">BIO-TECH</span>
                  </div>
                  <p className="text-muted small mb-0">Sector V, Salt Lake, Kolkata, West Bengal</p>
                  <p className="text-muted small mb-0">Email: billing@basundharabiotech.com</p>
                </div>
                <div className="col-sm-6 text-center text-sm-end">
                  <h2 className="science-font text-gradient-bio fw-bold mb-1">INVOICE</h2>
                  <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1.5 small mb-1 fw-bold">ORDER CLEARED</span>
                  <div className="text-muted small">Invoice #: <strong>{invoiceData.invoiceNumber}</strong></div>
                  <div className="text-muted small">Date: {invoiceData.date}</div>
                </div>
              </div>

              {/* Customer & Billing breakdown */}
              <div className="row g-4 mb-4 pb-4 border-bottom text-start">
                <div className="col-md-6">
                  <h6 className="science-font fw-bold text-success mb-2"><i className="bi bi-person-fill me-1"></i>Billed To:</h6>
                  <p className="text-dark mb-1 fw-semibold">{invoiceData.customer.name}</p>
                  <p className="text-muted small mb-1"><i className="bi bi-envelope me-1"></i>{invoiceData.customer.email}</p>
                  <p className="text-muted small mb-1"><i className="bi bi-telephone me-1"></i>{invoiceData.customer.phone}</p>
                  <p className="text-muted small mb-0"><i className="bi bi-geo-alt me-1"></i>{invoiceData.customer.address}</p>
                </div>
                <div className="col-md-6 text-sm-end text-start">
                  <h6 className="science-font fw-bold text-primary mb-2"><i className="bi bi-credit-card-fill me-1"></i>Payment Information:</h6>
                  <p className="text-dark mb-1">Method: <strong>{invoiceData.customer.paymentMethod}</strong></p>
                  <p className="text-muted small">Status: <span className="text-success fw-bold">Pending on Logistics</span></p>
                </div>
              </div>

              {/* Items Table */}
              <h6 className="science-font fw-bold text-dark mb-3"><i className="bi bi-list-check me-1"></i>Itemized Specifications Summary:</h6>
              <div className="table-responsive mb-4">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="small fw-bold">Product Details</th>
                      <th className="text-center small fw-bold" style={{ width: '120px' }}>Unit Price</th>
                      <th className="text-center small fw-bold" style={{ width: '100px' }}>Qty</th>
                      <th className="text-end small fw-bold" style={{ width: '150px' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className="fw-semibold text-dark d-block">{item.title}</span>
                        </td>
                        <td className="text-center font-monospace small">Rs. {item.price.toFixed(2)}</td>
                        <td className="text-center font-monospace small">{item.quantity}</td>
                        <td className="text-end font-monospace small">Rs. {item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Grand Total breakdown */}
              <div className="row justify-content-end text-end g-2">
                <div className="col-md-6 col-lg-5">
                  <div className="d-flex justify-content-between py-1 border-bottom border-secondary border-opacity-10 small">
                    <span className="text-muted">Subtotal:</span>
                    <span className="font-monospace text-dark">Rs. {invoiceData.summary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom border-secondary border-opacity-10 small">
                    <span className="text-muted">Bio-Tax (5% CGST/SGST):</span>
                    <span className="font-monospace text-dark">Rs. {invoiceData.summary.tax.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1 border-bottom border-secondary border-opacity-10 small">
                    <span className="text-muted">Logistics Shipping Charge:</span>
                    <span className="font-monospace text-dark">
                      {invoiceData.summary.shipping === 0 ? <span className="text-success fw-bold">FREE</span> : `Rs. ${invoiceData.summary.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between py-2 mt-2 bg-light px-2 rounded">
                    <span className="fw-bold text-dark">Grand Total:</span>
                    <span className="font-monospace fw-bold text-success">Rs. {invoiceData.summary.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Printable Invoice Footer Note */}
              <div className="text-center mt-5 pt-4 border-top border-secondary border-opacity-10">
                <p className="text-muted small italic mb-0">Thank you for partnering with Basundhara Bio-Tech Private Limited.</p>
                <p className="text-muted small mb-0" style={{ fontSize: '10px' }}>This is an automated, secure computer-generated billing clearance document.</p>
              </div>

            </div>

            {/* Print & Action Controls (excluded during native print) */}
            <div className="d-flex justify-content-center gap-3 mt-4 d-print-none">
              <button onClick={handlePrint} className="btn btn-science-primary px-4">
                Print / Save Invoice PDF <i className="bi bi-printer-fill ms-2"></i>
              </button>
              <button onClick={() => { setShowInvoice(false); setInvoiceData(null); }} className="btn btn-outline-secondary px-4">
                Close Invoice / Clear View
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE CART & BILLING VIEW */
          <div className="row g-4">
            
            {/* Left Side: Cart Items List (CRUD Read/Update/Delete) */}
            <div className="col-lg-7">
              <div className="card glass-card p-4 border border-secondary border-opacity-10 shadow-sm h-100 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="science-font fs-4 fw-bold text-dark mb-0"><i className="bi bi-basket-fill text-success me-2"></i>Selected Items ({cartItems.length})</h3>
                  <button onClick={handleClearCart} className="btn btn-xs btn-outline-danger small py-1 px-2.5">
                    Clear Cart <i className="bi bi-trash-fill"></i>
                  </button>
                </div>

                <div className="d-flex flex-column gap-3 mb-4 flex-grow-1">
                  {cartItems.map((item) => {
                    const priceVal = getNumericPrice(item.product.price);
                    return (
                      <div key={item.product._id} className="d-flex flex-column flex-sm-row gap-3 p-3 bg-light rounded-3 border align-items-sm-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="rounded object-fit-cover shadow-sm"
                            style={{ width: '70px', height: '70px' }}
                          />
                          <div>
                            <h5 className="science-font fs-6 fw-bold text-dark mb-1">{item.product.title}</h5>
                            <span className="badge bg-success bg-opacity-10 text-success text-xs px-2.5 py-0.5 rounded small">{item.product.category?.name || 'Bio-tech'}</span>
                            {item.product.price.toLowerCase().includes('inquiry') && (
                              <div className="text-secondary small mt-1" style={{ fontSize: '11px' }}>
                                <i className="bi bi-exclamation-circle-fill me-1 text-warning"></i>Using Rs. 150.00 baseline price
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between gap-4">
                          {/* CRUD Update: Quantity Control */}
                          <div className="d-flex align-items-center border rounded-pill bg-white overflow-hidden" style={{ height: '36px' }}>
                            <button
                              onClick={() => handleQuantityChange(item.product._id, -1)}
                              className="btn btn-sm btn-light border-0 px-2.5 h-100 rounded-0"
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <span className="px-3 fw-bold font-monospace text-dark small">{item.quantity || 1}</span>
                            <button
                              onClick={() => handleQuantityChange(item.product._id, 1)}
                              className="btn btn-sm btn-light border-0 px-2.5 h-100 rounded-0"
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>

                          {/* Calculations & CRUD Delete */}
                          <div className="d-flex align-items-center gap-3 text-end">
                            <div>
                              <div className="fw-bold text-dark font-monospace small">Rs. {(priceVal * (item.quantity || 1)).toFixed(2)}</div>
                              <div className="text-muted small" style={{ fontSize: '11px' }}>Rs. {priceVal.toFixed(2)} / unit</div>
                            </div>
                            <button
                              onClick={() => handleDeleteDeleteItem(item.product._id)}
                              className="btn btn-sm btn-outline-danger border-0 rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: '32px', height: '32px' }}
                              title="Delete Item"
                            >
                              <i className="bi bi-x-lg fs-6"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotals Footer inside card */}
                <div className="border-top pt-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">Subtotal:</span>
                    <strong className="text-dark font-monospace fs-5">Rs. {subtotal.toFixed(2)}</strong>
                  </div>
                  <p className="text-muted small italic mb-0"><i className="bi bi-shield-check text-success me-1"></i>Free logistics cargo shipping clearance on all orders above Rs. 1,500.00!</p>
                </div>
              </div>
            </div>

            {/* Right Side: Billing Form & Invoice Generation Checkout */}
            <div className="col-lg-5">
              <div className="card glass-card p-4 border border-secondary border-opacity-10 shadow-sm h-100">
                <h3 className="science-font fs-4 fw-bold text-dark mb-4"><i className="bi bi-receipt text-primary me-2"></i>Billing & Summary</h3>
                
                <form onSubmit={handleCheckout} className="text-start">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Customer Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Dr. John Doe"
                      value={billingDetails.name}
                      onChange={handleBillingChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Contact Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="johndoe@institution.edu"
                      value={billingDetails.email}
                      onChange={handleBillingChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      placeholder="+91 98765-43210"
                      value={billingDetails.phone}
                      onChange={handleBillingChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Cargo Shipping Address</label>
                    <textarea
                      className="form-control"
                      name="address"
                      rows="3"
                      placeholder="Provide full laboratory/institutional shipping coordinates..."
                      value={billingDetails.address}
                      onChange={handleBillingChange}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-dark">Clearance Payment Method</label>
                    <select
                      className="form-select"
                      name="paymentMethod"
                      value={billingDetails.paymentMethod}
                      onChange={handleBillingChange}
                    >
                      <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                      <option value="Bank Transfer">Direct Bank/Wire Transfer</option>
                      <option value="Card">Institutional Credit/Debit Card</option>
                    </select>
                  </div>

                  {/* Calculations breakdown summary */}
                  <div className="p-3 bg-light rounded-3 mb-4 text-start border">
                    <div className="d-flex justify-content-between mb-2 small">
                      <span className="text-secondary">Subtotal:</span>
                      <span className="font-monospace text-dark fw-semibold">Rs. {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2 small">
                      <span className="text-secondary">Bio-Tax (5%):</span>
                      <span className="font-monospace text-dark fw-semibold">Rs. {tax.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2 small">
                      <span className="text-secondary">Shipping Cargo:</span>
                      <span className="font-monospace text-dark fw-semibold">
                        {shipping === 0 ? <span className="text-success fw-bold">FREE</span> : `Rs. ${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <hr className="my-2 border-secondary border-opacity-10" />
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold text-dark">Grand Total:</span>
                      <span className="font-monospace fw-bold text-success fs-5">Rs. {grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-science-primary w-100 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2">
                    Generate Billing Invoice & Place Order <i className="bi bi-file-earmark-pdf-fill"></i>
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
