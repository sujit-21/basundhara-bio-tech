import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals & Inquiry Form State
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({ name: '', email: '', subject: '', message: '' });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryAlert, setInquiryAlert] = useState({ show: false, message: '', type: 'success' });

  // Update selected category if URL parameters update
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory('All');
    }
    setPage(1);
  }, [searchParams]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products based on search, category filter, and page
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (selectedCategory && selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }
        params.append('page', page);
        params.append('limit', 9); // Show 9 products per page

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.data);
          setTotalPages(res.data.pagination.pages);
        }
      } catch (err) {
        setError('Failed to retrieve products catalog. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, selectedCategory, page]);

  // Handle Category click
  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    setPage(1);
    setSearchParams(catName === 'All' ? {} : { category: catName });
  };

  // Inquiry form change
  const handleInquiryChange = (e) => {
    setInquiryData({ ...inquiryData, [e.target.name]: e.target.value });
  };

  // Submit Inquiry to backend
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = inquiryData;

    if (!name || !email || !message) {
      setInquiryAlert({ show: true, message: 'Please enter name, email and message.', type: 'danger' });
      return;
    }

    setInquiryLoading(true);
    setInquiryAlert({ show: false, message: '', type: 'success' });

    try {
      const payload = {
        name,
        email,
        subject: `Product Specs Inquiry: ${activeProduct.title}`,
        message,
        productInquiry: activeProduct.title,
      };

      const res = await api.post('/contacts', payload);
      if (res.data.success) {
        setInquiryAlert({ show: true, message: 'Your specifications inquiry has been sent to our trade desk.', type: 'success' });
        setInquiryData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => {
          setShowInquiryForm(false);
          setInquiryAlert({ show: false, message: '', type: 'success' });
        }, 3000);
      }
    } catch (err) {
      setInquiryAlert({ show: true, message: 'Failed to dispatch inquiry. Please try again.', type: 'danger' });
    } finally {
      setInquiryLoading(false);
    }
  };

  const [cartSuccessAlert, setCartSuccessAlert] = useState({ show: false, message: '' });

  const addToCart = (product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.product._id === product._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cart-updated'));
      
      setCartSuccessAlert({ show: true, message: `"${product.title}" added to your cart.` });
      setTimeout(() => setCartSuccessAlert({ show: false, message: '' }), 3000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const openSpecsModal = (prod) => {
    setActiveProduct(prod);
    setActiveImage(prod.image);
    setShowInquiryForm(false);
    setInquiryAlert({ show: false, message: '', type: 'success' });
  };

  return (
    <div className="products-container py-5 text-start">
      {/* Floating Toast Notification */}
      {cartSuccessAlert.show && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div className="toast show align-items-center text-white bg-success border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2">
                <i className="bi bi-check-circle-fill"></i>
                {cartSuccessAlert.message}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setCartSuccessAlert({ show: false, message: '' })}></button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill science-font mb-2">Enterprise Catalog</span>
          <h1 className="science-font fw-bold text-gradient-bio">Organic Products & Services</h1>
          <p className="text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Browse our catalog of premium agro-biotech inputs, cold-dehydrated leaves, spices, animal feed blocks, and Ayurvedic extract bases.
          </p>
        </div>

        {/* Toolbar Filter */}
        <div className="row g-3 mb-5 align-items-center">
          {/* Search */}
          <div className="col-lg-4">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search dehydrated foods, seeds, pots..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>
          {/* Categories select tabs */}
          <div className="col-lg-8">
            <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
              <button
                onClick={() => handleCategorySelect('All')}
                className={`btn btn-sm px-3 py-2 rounded-pill science-font fw-semibold ${selectedCategory === 'All' ? 'btn-success text-white' : 'btn-light border border-secondary border-opacity-10 text-dark'}`}
              >
                All Sectors
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`btn btn-sm px-3 py-2 rounded-pill science-font fw-semibold ${selectedCategory === cat.name ? 'btn-success text-white' : 'btn-light border border-secondary border-opacity-10 text-dark'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center shadow-sm">{error}</div>
        ) : products.length === 0 ? (
          <div className="card glass-card text-center py-5">
            <i className="bi bi-basket3 text-muted fs-1 mb-3"></i>
            <h4 className="science-font text-dark">No products found</h4>
            <p className="text-muted">Adjust search keywords or select a different industry category.</p>
          </div>
        ) : (
          <div>
            <div className="row g-4">
              {products.map((prod) => (
                <div className="col-lg-4 col-md-6" key={prod._id}>
                  <div className="card glass-card h-100 p-3 border border-secondary border-opacity-10 d-flex flex-column">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="img-fluid rounded mb-3 object-fit-cover"
                      style={{ height: '220px', width: '100%' }}
                    />
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-2 gap-2">
                      <div className="d-flex gap-1.5 flex-wrap">
                        <span className="badge bg-success bg-opacity-10 text-success px-2.5 py-1 rounded small science-font">
                          {prod.category?.name}
                        </span>
                        {prod.subCategory && (
                          <span className="badge bg-light text-secondary border px-2.5 py-1 rounded small science-font">
                            {prod.subCategory}
                          </span>
                        )}
                      </div>
                      <span className="text-muted small font-monospace">{prod.price}</span>
                    </div>
                    <h4 className="science-font card-title fs-5 fw-bold text-dark mb-2">{prod.title}</h4>
                    <p className="card-text text-muted small mb-4 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {prod.description}
                    </p>
                    <div className="d-flex gap-2 mt-auto">
                      <button
                        onClick={() => openSpecsModal(prod)}
                        className="btn btn-outline-secondary btn-sm flex-grow-1"
                        data-bs-toggle="modal"
                        data-bs-target="#productSpecsModal"
                      >
                        Specs & Inquire <i className="bi bi-info-circle"></i>
                      </button>
                      <button
                        onClick={() => addToCart(prod)}
                        className="btn btn-success btn-sm px-3"
                        title="Add to Cart"
                      >
                        <i className="bi bi-cart-plus-fill"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="d-flex justify-content-center mt-5">
                <ul className="pagination">
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>&laquo; Previous</button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next &raquo;</button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        )}
      </div>

      {/* Product Specifications & Direct Inquiry Modal */}
      {activeProduct && (
        <div className="modal fade" id="productSpecsModal" tabIndex="-1" aria-labelledby="productSpecsModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow border-0" style={{ borderRadius: '16px' }}>
              
              <div className="modal-header border-bottom-0 pb-0">
                <div className="d-flex gap-1.5 flex-wrap">
                  <span className="badge bg-success bg-opacity-10 text-success px-3 py-1.5 rounded-pill science-font">
                    {activeProduct.category?.name}
                  </span>
                  {activeProduct.subCategory && (
                    <span className="badge bg-light text-secondary border px-3 py-1.5 rounded-pill science-font">
                      {activeProduct.subCategory}
                    </span>
                  )}
                </div>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div className="modal-body p-4 pt-2">
                {!showInquiryForm ? (
                  // Display Product Specs
                  <div>
                    <div className="d-flex align-items-center mb-3">
                      <h3 className="modal-title science-font fw-bold text-dark" id="productSpecsModalLabel">
                        {activeProduct.title}
                      </h3>
                    </div>
                    
                    <div className="row g-4">
                      <div className="col-md-5">
                        <img
                          src={activeImage || activeProduct.image}
                          alt={activeProduct.title}
                          className="img-fluid rounded-3 object-fit-cover mb-2"
                          style={{ height: '220px', width: '100%' }}
                        />
                        {activeProduct.images && activeProduct.images.length > 1 && (
                          <div className="d-flex gap-2 overflow-x-auto py-1" style={{ scrollbarWidth: 'thin' }}>
                            {activeProduct.images.map((imgSrc, idx) => (
                              <img
                                key={idx}
                                src={imgSrc}
                                alt={`Thumbnail ${idx}`}
                                className={`img-thumbnail rounded object-fit-cover ${activeImage === imgSrc ? 'border-success border-2' : ''}`}
                                style={{ width: '50px', height: '50px', cursor: 'pointer', opacity: activeImage === imgSrc ? 1 : 0.6, transition: 'all 0.2s ease' }}
                                onClick={() => setActiveImage(imgSrc)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="col-md-7">
                        <h6 className="science-font fw-bold text-success">Product Description</h6>
                        <p className="text-secondary small mb-3">{activeProduct.description}</p>
                        
                        <h6 className="science-font fw-bold text-primary">Standard Specifications</h6>
                        <ul className="list-group list-group-flush mb-3">
                          {(activeProduct.specifications || []).map((spec, index) => (
                            <li className="list-group-item bg-transparent px-0 py-1 text-muted small" key={index}>
                              <i className="bi bi-patch-check-fill text-success me-2"></i>{spec}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="d-flex justify-content-between align-items-center border-top pt-2">
                          <span className="text-muted small">Price Target: <strong className="text-dark font-monospace">{activeProduct.price}</strong></span>
                          <span className="badge bg-success">{activeProduct.inStock ? 'Available' : 'Out of Stock'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Direct Product Inquiry Form
                  <div>
                    <h4 className="science-font fw-bold text-gradient-bio mb-4">Request Commercial Specs: {activeProduct.title}</h4>
                    
                    {inquiryAlert.show && (
                      <div className={`alert alert-${inquiryAlert.type} py-2.5 small mb-3`} role="alert">
                        {inquiryAlert.message}
                      </div>
                    )}

                    <form onSubmit={handleInquirySubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-secondary">Contact Name</label>
                          <input type="text" className="form-control" name="name" value={inquiryData.name} onChange={handleInquiryChange} required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-secondary">Business Email</label>
                          <input type="email" className="form-control" name="email" value={inquiryData.email} onChange={handleInquiryChange} required />
                        </div>
                        <div className="col-12">
                          <label className="form-label small fw-bold text-secondary">Requirements & Quantities</label>
                          <textarea className="form-control" name="message" rows="4" placeholder="Enter target shipping schedules, estimated annual tonnage, packaging specs..." value={inquiryData.message} onChange={handleInquiryChange} required></textarea>
                        </div>
                        <div className="col-12 mt-4 d-flex gap-2">
                          <button type="submit" className="btn btn-science-primary btn-sm" disabled={inquiryLoading}>
                            {inquiryLoading ? 'Dispatched...' : 'Send Inquiry Request'}
                          </button>
                          <button type="button" onClick={() => setShowInquiryForm(false)} className="btn btn-secondary btn-sm">
                            Back to Specs
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {!showInquiryForm && (
                <div className="modal-footer border-top-0 pt-0 gap-2 justify-content-end">
                  <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close Specs</button>
                  <button 
                    type="button" 
                    onClick={() => { addToCart(activeProduct); }} 
                    className="btn btn-success btn-sm d-flex align-items-center gap-1.5"
                  >
                    <i className="bi bi-cart-plus-fill"></i> Add to Cart
                  </button>
                  <button type="button" onClick={() => setShowInquiryForm(true)} className="btn btn-science-primary btn-sm">
                    Inquire Commercial Contract <i className="bi bi-send ms-1"></i>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
