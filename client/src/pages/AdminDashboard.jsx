import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  // Active Panel Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Datasets
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [research, setResearch] = useState([]);
  const [importExport, setImportExport] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [aboutList, setAboutList] = useState([]);
  const [aboutSections, setAboutSections] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [sustainability, setSustainability] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Form toggles
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Alert State
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: 'success' });

  // Form Input bindings
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', image: '', images: [], subCategories: [] });
  const [newSubCategory, setNewSubCategory] = useState('');
  const [categoryImageUrlInput, setCategoryImageUrlInput] = useState('');
  const [productForm, setProductForm] = useState({ title: '', description: '', price: 'On Inquiry', image: '', images: [], category: '', subCategory: '', specifications: '', inStock: true });
  const [productImageUrlInput, setProductImageUrlInput] = useState('');
  const [importExportForm, setImportExportForm] = useState({ title: '', description: '', destinationCountries: '', shippingModes: '', status: 'active' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '', author: 'Dr. Basundhara Roy', tags: '', image: '', published: true });
  const [researchForm, setResearchForm] = useState({ title: '', abstract: '', authors: '', journal: '', publishDate: '', doi: '', pdfUrl: '/sample_research.pdf', category: 'Biofuels & Sustainability' });
  const [offices, setOffices] = useState([]);
  const [officeForm, setOfficeForm] = useState({ title: '', address: '', phone: '', email: '' });
  const [aboutForm, setAboutForm] = useState({ name: '', role: '', qualification: '', bio: '', icon: 'bi-person', image: '' });
  const [aboutSectionForm, setAboutSectionForm] = useState({ type: 'vision_values', title: '', content: '', icon: '', year: '', color: 'success', order: 0 });
  const [aboutSubTab, setAboutSubTab] = useState('leadership');
  
  // Gallery & Sustainability forms
  const [galleryForm, setGalleryForm] = useState({ title: '', description: '', category: 'Farms', images: [], order: 0 });
  const [galleryImageUrlInput, setGalleryImageUrlInput] = useState('');
  const [sustainabilityForm, setSustainabilityForm] = useState({ type: 'initiative', title: '', description: '', impact: '', icon: 'bi-recycle', order: 0 });
  const [sustainabilitySubTab, setSustainabilitySubTab] = useState('hero');

  const triggerAlert = (message, type = 'success') => {
    setAlertInfo({ show: true, message, type });
    setTimeout(() => setAlertInfo({ show: false, message: '', type: 'success' }), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, categoriesRes, productsRes, blogsRes, researchRes, ieRes, contactsRes, officesRes, ordersRes, aboutRes, aboutSecRes, galleryRes, sustainabilityRes] = await Promise.all([
        api.get('/analytics'),
        api.get('/categories'),
        api.get('/products?limit=100'),
        api.get('/blogs?all=true&limit=100'),
        api.get('/research?limit=100'),
        api.get('/importexport'),
        api.get('/contacts?limit=100'),
        api.get('/offices'),
        api.get('/orders?limit=100'),
        api.get('/about'),
        api.get('/about-sections'),
        api.get('/gallery'),
        api.get('/sustainability'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (categoriesRes.data.success) setCategories(categoriesRes.data.data);
      if (productsRes.data.success) setProducts(productsRes.data.data);
      if (blogsRes.data.success) setBlogs(blogsRes.data.data);
      if (researchRes.data.success) setResearch(researchRes.data.data);
      if (ieRes.data.success) setImportExport(ieRes.data.data);
      if (contactsRes.data.success) setContacts(contactsRes.data.data);
      if (officesRes.data.success) setOffices(officesRes.data.data);
      if (ordersRes.data.success) setOrders(ordersRes.data.data);
      if (aboutRes.data.success) setAboutList(aboutRes.data.data);
      if (aboutSecRes.data.success) setAboutSections(aboutSecRes.data.data);
      if (galleryRes.data.success) setGallery(galleryRes.data.data);
      if (sustainabilityRes.data.success) setSustainability(sustainabilityRes.data.data);
    } catch (err) {
      console.error(err);
      triggerAlert('Failed to synchronize system records.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- CRUD API HANDLERS ---

  const handleDelete = async (endpoint, id) => {
    if (!window.confirm('Delete this record permanently?')) return;
    try {
      const res = await api.delete(`${endpoint}/${id}`);
      if (res.data.success) {
        triggerAlert('Record successfully purged.');
        loadData();
        if (endpoint.includes('/offices')) {
          window.dispatchEvent(new CustomEvent('offices-updated'));
        }
      }
    } catch (err) {
      triggerAlert('Purge request failed.', 'danger');
    }
  };

  // Submit Category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/categories/${currentItem._id}`, categoryForm);
        triggerAlert('Category specs updated.');
      } else {
        await api.post('/categories', categoryForm);
        triggerAlert('Category registered.');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      triggerAlert(err.response?.data?.message || 'Category action failed.', 'danger');
    }
  };

  // Submit Product
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/products/${currentItem._id}`, productForm);
        triggerAlert('Product specifications updated.');
      } else {
        await api.post('/products', productForm);
        triggerAlert('Product added to catalog.');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      triggerAlert(err.response?.data?.message || 'Product action failed.', 'danger');
    }
  };

  // Submit ImportExport Corridor
  const handleImportExportSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/importexport/${currentItem._id}`, importExportForm);
        triggerAlert('Freight route updated.');
      } else {
        await api.post('/importexport', importExportForm);
        triggerAlert('Freight route registered.');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      triggerAlert(err.response?.data?.message || 'Freight lane action failed.', 'danger');
    }
  };

  // Submit Blog
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/blogs/${currentItem._id}`, blogForm);
        triggerAlert('Blog post updated.');
      } else {
        await api.post('/blogs', blogForm);
        triggerAlert('Blog post published.');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      triggerAlert(err.response?.data?.message || 'Blog action failed.', 'danger');
    }
  };

  // Submit Research
  const handleResearchSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/research/${currentItem._id}`, researchForm);
        triggerAlert('Research publication updated.');
      } else {
        await api.post('/research', researchForm);
        triggerAlert('Research publication registered.');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      triggerAlert(err.response?.data?.message || 'Research action failed.', 'danger');
    }
  };

  // Submit Office
  const handleOfficeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/offices/${currentItem._id}`, officeForm);
        triggerAlert('Office specifications updated.');
      } else {
        await api.post('/offices', officeForm);
        triggerAlert('Office registered successfully.');
      }
      setShowForm(false);
      loadData();
      window.dispatchEvent(new CustomEvent('offices-updated'));
    } catch (err) {
      triggerAlert(err.response?.data?.message || 'Office action failed.', 'danger');
    }
  };

  // Submit About Member
  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/about/${currentItem._id}`, aboutForm);
        triggerAlert('About team member details updated.');
      } else {
        await api.post('/about', aboutForm);
        triggerAlert('About team member registered successfully.');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      triggerAlert(err.response?.data?.message || 'About member action failed.', 'danger');
    }
  };

  // Submit About Section
  const handleAboutSectionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/about-sections/${currentItem._id}`, aboutSectionForm);
        triggerAlert('About section specifications updated.');
      } else {
        await api.post('/about-sections', aboutSectionForm);
        triggerAlert('About section created successfully.');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      triggerAlert(err.response?.data?.message || 'About section action failed.', 'danger');
    }
  };

  // Submit Gallery Item
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryForm.images || galleryForm.images.length === 0) {
      triggerAlert('Please upload or link at least one image.', 'danger');
      return;
    }
    try {
      if (isEditMode) {
        await api.put(`/gallery/${currentItem._id}`, galleryForm);
        triggerAlert('Gallery item updated successfully.');
      } else {
        await api.post('/gallery', galleryForm);
        triggerAlert('Gallery item added successfully.');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      triggerAlert(err.response?.data?.message || 'Gallery item action failed.', 'danger');
    }
  };

  // Submit Sustainability Item
  const handleSustainabilitySubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/sustainability/${currentItem._id}`, sustainabilityForm);
        triggerAlert('Sustainability specifications updated.');
      } else {
        await api.post('/sustainability', sustainabilityForm);
        triggerAlert('Sustainability item created successfully.');
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      triggerAlert(err.response?.data?.message || 'Sustainability action failed.', 'danger');
    }
  };

  // Gallery multi image upload
  const handleGalleryImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let loadedImages = [];
    let count = 0;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        loadedImages.push(reader.result);
        count++;
        if (count === files.length) {
          setGalleryForm((prev) => {
            const updatedImages = [...(prev.images || []), ...loadedImages];
            return {
              ...prev,
              images: updatedImages,
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Gallery add image by link
  const handleAddGalleryImageByUrl = () => {
    if (!galleryImageUrlInput.trim()) return;
    setGalleryForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), galleryImageUrlInput.trim()]
    }));
    setGalleryImageUrlInput('');
  };

  // Contact status change
  const handleContactStatusUpdate = async (id, status) => {
    try {
      await api.put(`/contacts/${id}`, { status });
      triggerAlert('Inquiry status updated.');
      loadData();
    } catch (err) {
      triggerAlert('Failed to modify inquiry status.', 'danger');
    }
  };

  // Order status update
  const handleOrderStatusUpdate = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      triggerAlert('Order status updated successfully.');
      loadData();
    } catch (err) {
      triggerAlert('Failed to update order status.', 'danger');
    }
  };

  // Order delete
  const handleOrderDelete = async (id) => {
    if (!window.confirm('Delete this order record permanently?')) return;
    try {
      const res = await api.delete(`/orders/${id}`);
      if (res.data.success) {
        triggerAlert('Order successfully purged.');
        loadData();
        if (selectedOrder?._id === id) {
          setSelectedOrder(null);
        }
      }
    } catch (err) {
      triggerAlert('Failed to delete order record.', 'danger');
    }
  };

  // Form opening helpers
  const openAddForm = (type, extra = null) => {
    setIsEditMode(false);
    setCurrentItem(null);
    setShowForm(true);

    if (type === 'categories') {
      setCategoryForm({ name: '', description: '', image: '', images: [], subCategories: [] });
      setNewSubCategory('');
      setCategoryImageUrlInput('');
    } else if (type === 'products') {
      setProductForm({ title: '', description: '', price: 'On Inquiry', image: '', images: [], category: categories[0]?._id || '', subCategory: '', specifications: '', inStock: true });
      setProductImageUrlInput('');
    } else if (type === 'importexport') {
      setImportExportForm({ title: '', description: '', destinationCountries: '', shippingModes: 'Sea Freight (FCL)', status: 'active' });
    } else if (type === 'blogs') {
      setBlogForm({ title: '', content: '', author: 'Dr. Basundhara Roy', tags: 'Agro-Tech, Innovation', image: '', published: true });
    } else if (type === 'research') {
      setResearchForm({ title: '', abstract: '', authors: 'Roy, B.', journal: 'Sustainable Agriculture Journal', publishDate: new Date().toISOString().split('T')[0], doi: '', pdfUrl: '/sample_research.pdf', category: 'Biofuels & Sustainability' });
    } else if (type === 'offices') {
      setOfficeForm({ title: '', address: '', phone: '', email: '' });
    } else if (type === 'about') {
      setAboutForm({ name: '', role: '', qualification: '', bio: '', icon: 'bi-person', image: '' });
    } else if (type === 'about-section') {
      setAboutSectionForm({ type: extra || 'vision_values', title: '', content: '', icon: '', year: '', color: 'success', order: 0 });
    } else if (type === 'gallery') {
      setGalleryForm({ title: '', description: '', category: 'Farms', images: [], order: 0 });
      setGalleryImageUrlInput('');
    } else if (type === 'sustainability') {
      setSustainabilityForm({ type: extra || 'initiative', title: '', description: '', impact: '', icon: 'bi-recycle', order: 0 });
    }
  };

  const openEditForm = (type, item) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setShowForm(true);

    if (type === 'categories') {
      setCategoryForm({ name: item.name, description: item.description, image: item.image, images: item.images || (item.image ? [item.image] : []), subCategories: item.subCategories || [] });
      setNewSubCategory('');
      setCategoryImageUrlInput('');
    } else if (type === 'products') {
      setProductForm({ title: item.title, description: item.description, price: item.price, image: item.image, images: item.images || (item.image ? [item.image] : []), category: item.category?._id || item.category || '', subCategory: item.subCategory || '', specifications: (item.specifications || []).join(', '), inStock: item.inStock });
      setProductImageUrlInput('');
    } else if (type === 'importexport') {
      setImportExportForm({ title: item.title, description: item.description, destinationCountries: (item.destinationCountries || []).join(', '), shippingModes: (item.shippingModes || []).join(', '), status: item.status });
    } else if (type === 'blogs') {
      setBlogForm({ title: item.title, content: item.content, author: item.author, tags: (item.tags || []).join(', '), image: item.image, published: item.published });
    } else if (type === 'research') {
      setResearchForm({ title: item.title, abstract: item.abstract, authors: item.authors, journal: item.journal, publishDate: item.publishDate ? item.publishDate.split('T')[0] : '', doi: item.doi, pdfUrl: item.pdfUrl, category: item.category });
    } else if (type === 'offices') {
      setOfficeForm({ title: item.title, address: item.address, phone: item.phone, email: item.email });
    } else if (type === 'about') {
      setAboutForm({ name: item.name, role: item.role, qualification: item.qualification, bio: item.bio, icon: item.icon || 'bi-person', image: item.image || '' });
    } else if (type === 'about-section') {
      setAboutSectionForm({ type: item.type, title: item.title, content: item.content, icon: item.icon || '', year: item.year || '', color: item.color || 'success', order: item.order !== undefined ? item.order : 0 });
    } else if (type === 'gallery') {
      setGalleryForm({ title: item.title, description: item.description, category: item.category, images: item.images || (item.image ? [item.image] : []), order: item.order || 0 });
      setGalleryImageUrlInput('');
    } else if (type === 'sustainability') {
      setSustainabilityForm({ type: item.type, title: item.title, description: item.description, impact: item.impact || '', icon: item.icon || 'bi-recycle', order: item.order || 0 });
    }
  };

  const handleAddSubCategory = () => {
    if (!newSubCategory.trim()) return;
    if (categoryForm.subCategories && categoryForm.subCategories.includes(newSubCategory.trim())) {
      setNewSubCategory('');
      return;
    }
    setCategoryForm({
      ...categoryForm,
      subCategories: [...(categoryForm.subCategories || []), newSubCategory.trim()]
    });
    setNewSubCategory('');
  };

  const handleRemoveSubCategory = (indexToRemove) => {
    setCategoryForm({
      ...categoryForm,
      subCategories: (categoryForm.subCategories || []).filter((_, idx) => idx !== indexToRemove)
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let loadedImages = [];
    let count = 0;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        loadedImages.push(reader.result);
        count++;
        if (count === files.length) {
          setCategoryForm((prev) => {
            const updatedImages = [...(prev.images || []), ...loadedImages];
            return {
              ...prev,
              images: updatedImages,
              image: prev.image || updatedImages[0] || '',
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddCategoryImageByUrl = () => {
    if (!categoryImageUrlInput.trim()) return;
    setCategoryForm((prev) => {
      const updatedImages = [...(prev.images || []), categoryImageUrlInput.trim()];
      return {
        ...prev,
        images: updatedImages,
        image: prev.image || updatedImages[0] || '',
      };
    });
    setCategoryImageUrlInput('');
  };

  const handleProductImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let loadedImages = [];
    let count = 0;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        loadedImages.push(reader.result);
        count++;
        if (count === files.length) {
          setProductForm((prev) => {
            const updatedImages = [...(prev.images || []), ...loadedImages];
            return {
              ...prev,
              images: updatedImages,
              image: prev.image || updatedImages[0] || '',
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddProductImageByUrl = () => {
    if (!productImageUrlInput.trim()) return;
    setProductForm((prev) => {
      const updatedImages = [...(prev.images || []), productImageUrlInput.trim()];
      return {
        ...prev,
        images: updatedImages,
        image: prev.image || updatedImages[0] || '',
      };
    });
    setProductImageUrlInput('');
  };

  const handleAboutImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAboutForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className="admin-container text-start">
      <div className="container-fluid">
        <div className="row">
          
          {/* Sidebar Nav */}
          <div className="col-md-3 col-lg-2 px-0 admin-sidebar d-flex flex-column py-4 px-3 shadow-sm">
            <div className="science-font fw-bold text-success mb-4 px-2 d-flex align-items-center">
              <i className="bi bi-shield-lock-fill me-2 fs-5"></i> Trade Console
            </div>
            
            <nav className="nav flex-column">
              <button onClick={() => { setActiveTab('overview'); setShowForm(false); }} className={`nav-link border-0 text-start bg-transparent ${activeTab === 'overview' ? 'active' : ''}`}>
                <i className="bi bi-pie-chart-fill me-2"></i> Overview
              </button>
              <button onClick={() => { setActiveTab('categories'); setShowForm(false); }} className={`nav-link border-0 text-start bg-transparent ${activeTab === 'categories' ? 'active' : ''}`}>
                <i className="bi bi-grid-fill me-2"></i> Categories
              </button>
              <button onClick={() => { setActiveTab('products'); setShowForm(false); }} className={`nav-link border-0 text-start bg-transparent ${activeTab === 'products' ? 'active' : ''}`}>
                <i className="bi bi-basket3-fill me-2"></i> Products
              </button>
              <button onClick={() => { setActiveTab('orders'); setShowForm(false); }} className={`nav-link border-0 text-start bg-transparent ${activeTab === 'orders' ? 'active' : ''}`}>
                <i className="bi bi-receipt-cutoff me-2"></i> Orders
                {stats?.orders?.pending > 0 && <span className="badge bg-danger ms-2">{stats.orders.pending}</span>}
              </button>
              <button onClick={() => { setActiveTab('importexport'); setShowForm(false); }} className={`nav-link border-0 text-start bg-transparent ${activeTab === 'importexport' ? 'active' : ''}`}>
                <i className="bi bi-globe2 me-2"></i> Logistics
              </button>
              <button onClick={() => { setActiveTab('blogs'); setShowForm(false); }} className={`nav-link border-0 text-start bg-transparent ${activeTab === 'blogs' ? 'active' : ''}`}>
                <i className="bi bi-journal-text me-2"></i> Blogs
              </button>
              <button onClick={() => { setActiveTab('research'); setShowForm(false); }} className={`nav-link border-0 text-start bg-transparent ${activeTab === 'research' ? 'active' : ''}`}>
                <i className="bi bi-file-earmark-medical-fill me-2"></i> Research
              </button>
              <button onClick={() => { setActiveTab('messages'); setShowForm(false); }} className={`nav-link border-0 text-start bg-transparent ${activeTab === 'messages' ? 'active' : ''}`}>
                <i className="bi bi-chat-left-text-fill me-2"></i> Inquiries 
                {stats?.counts?.contacts > 0 && <span className="badge bg-danger ms-2">{stats.messages.unread}</span>}
              </button>
              <button onClick={() => { setActiveTab('offices'); setShowForm(false); }} className={`nav-link border-0 text-start bg-transparent ${activeTab === 'offices' ? 'active' : ''}`}>
                <i className="bi bi-geo-alt-fill me-2"></i> Trade Offices
              </button>
              <button onClick={() => { setActiveTab('about'); setShowForm(false); }} className={`nav-link border-0 text-start bg-transparent ${activeTab === 'about' ? 'active' : ''}`}>
                <i className="bi bi-info-circle-fill me-2"></i> About Us
              </button>
              <button onClick={() => { setActiveTab('gallery'); setShowForm(false); }} className={`nav-link border-0 text-start bg-transparent ${activeTab === 'gallery' ? 'active' : ''}`}>
                <i className="bi bi-images me-2"></i> Gallery
              </button>
              <button onClick={() => { setActiveTab('sustainability'); setShowForm(false); }} className={`nav-link border-0 text-start bg-transparent ${activeTab === 'sustainability' ? 'active' : ''}`}>
                <i className="bi bi-recycle me-2"></i> Sustainability
              </button>
            </nav>

            <div className="mt-auto pt-4 px-2 border-top border-secondary border-opacity-10">
              <div className="text-secondary small">Clearance Level:</div>
              <div className="text-success fw-bold science-font small">{user?.role?.toUpperCase()}</div>
            </div>
          </div>

          {/* Main Dashboard Panel */}
          <div className="col-md-9 col-lg-10 p-4">
            
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <div>
                <h1 className="science-font fw-bold fs-3 text-gradient-bio mb-1">Basundhara Enterprise Console</h1>
                <p className="text-muted small mb-0">Logged in: {user?.name} ({user?.email})</p>
              </div>
              <button onClick={loadData} className="btn btn-sm btn-outline-secondary">
                <i className="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </div>

            {/* Alert */}
            {alertInfo.show && (
              <div className={`alert alert-${alertInfo.type} shadow-sm py-2.5 mb-4`} role="alert">
                <i className="bi bi-info-circle-fill me-2"></i>{alertInfo.message}
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status"></div>
              </div>
            ) : (
              <>
                {/* --- TAB: OVERVIEW --- */}
                {activeTab === 'overview' && stats && (
                  <div>
                    <div className="row g-4 mb-5">
                      <div className="col-md-3 col-6">
                        <div className="card glass-card p-4 border border-secondary border-opacity-10 text-center">
                          <i className="bi bi-grid fs-1 text-success mb-2"></i>
                          <h3 className="fw-bold science-font">{stats.counts.categories}</h3>
                          <span className="text-muted small">Categories</span>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="card glass-card p-4 border border-secondary border-opacity-10 text-center">
                          <i className="bi bi-basket3 fs-1 text-primary mb-2"></i>
                          <h3 className="fw-bold science-font">{stats.counts.products}</h3>
                          <span className="text-muted small">Products Catalog</span>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="card glass-card p-4 border border-secondary border-opacity-10 text-center">
                          <i className="bi bi-globe2 fs-1 text-success mb-2"></i>
                          <h3 className="fw-bold science-font">{stats.counts.importExport}</h3>
                          <span className="text-muted small">Logistics Routes</span>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="card glass-card p-4 border border-secondary border-opacity-10 text-center">
                          <i className="bi bi-receipt-cutoff fs-1 text-primary mb-2"></i>
                          <h3 className="fw-bold science-font">{stats.orders?.total || 0}</h3>
                          <span className="text-muted small">Total Orders</span>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="card glass-card p-4 border border-secondary border-opacity-10 text-center">
                          <i className="bi bi-currency-rupee fs-1 text-success mb-2"></i>
                          <h3 className="fw-bold science-font">Rs. {(stats.orders?.revenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
                          <span className="text-muted small">Revenue</span>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="card glass-card p-4 border border-secondary border-opacity-10 text-center">
                          <i className="bi bi-chat-dots fs-1 text-primary mb-2"></i>
                          <h3 className="fw-bold science-font">{stats.counts.contacts}</h3>
                          <span className="text-muted small">Total Inquiries</span>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="card glass-card p-4 border border-secondary border-opacity-10 text-center">
                          <i className="bi bi-geo-alt fs-1 text-success mb-2"></i>
                          <h3 className="fw-bold science-font">{offices.length}</h3>
                          <span className="text-muted small">Active Offices</span>
                        </div>
                      </div>
                    </div>

                    <div className="row g-4">
                      {/* Inquiry summary */}
                      <div className="col-lg-4">
                        <div className="card glass-card p-4 border border-secondary border-opacity-10 h-100">
                          <h5 className="science-font fw-bold mb-4 text-dark"><i className="bi bi-inbox-fill text-success me-2"></i>Inquiries Box</h5>
                          <div className="d-flex flex-column gap-3">
                            <div className="d-flex justify-content-between align-items-center p-2.5 bg-light rounded">
                              <span className="fw-semibold text-danger small"><i className="bi bi-envelope-fill me-2"></i>Pending</span>
                              <span className="badge bg-danger fs-6">{stats.messages.unread}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-2.5 bg-light rounded">
                              <span className="fw-semibold text-warning"><i className="bi bi-envelope-open-fill me-2"></i>Read</span>
                              <span className="badge bg-warning text-dark fs-6">{stats.messages.read}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-2.5 bg-light rounded">
                              <span className="fw-semibold text-success"><i className="bi bi-check-circle-fill me-2"></i>Replied</span>
                              <span className="badge bg-success fs-6">{stats.messages.replied}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order summary */}
                      <div className="col-lg-4">
                        <div className="card glass-card p-4 border border-secondary border-opacity-10 h-100">
                          <h5 className="science-font fw-bold mb-4 text-dark"><i className="bi bi-truck text-primary me-2"></i>Orders Status</h5>
                          <div className="d-flex flex-column gap-2">
                            <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                              <span className="fw-semibold text-danger small"><i className="bi bi-clock-history me-2"></i>Pending</span>
                              <span className="badge bg-danger">{stats.orders?.pending || 0}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                              <span className="fw-semibold text-warning small"><i className="bi bi-gear-fill me-2"></i>Processing</span>
                              <span className="badge bg-warning text-dark">{stats.orders?.processing || 0}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                              <span className="fw-semibold text-primary small"><i className="bi bi-truck me-2"></i>Shipped</span>
                              <span className="badge bg-primary">{stats.orders?.shipped || 0}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                              <span className="fw-semibold text-success small"><i className="bi bi-check-circle-fill me-2"></i>Completed</span>
                              <span className="badge bg-success">{stats.orders?.completed || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Products per category distribution */}
                      <div className="col-lg-4">
                        <div className="card glass-card p-4 border border-secondary border-opacity-10 h-100">
                          <h5 className="science-font fw-bold mb-4 text-dark"><i className="bi bi-pie-chart-fill text-success me-2"></i>Product Splits</h5>
                          <ul className="list-group list-group-flush">
                            {stats.distributions.products.map((dist, idx) => (
                              <li className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-secondary border-opacity-10 px-0 py-2" key={idx}>
                                <span className="small text-secondary">{dist.name}</span>
                                <span className="badge bg-secondary rounded-pill">{dist.count} items</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAB: MANAGE CATEGORIES --- */}
                {activeTab === 'categories' && (
                  <div>
                    {!showForm ? (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h3 className="science-font fs-4 fw-bold">Industrial Categories ({categories.length})</h3>
                          <button onClick={() => openAddForm('categories')} className="btn btn-sm btn-success">
                            <i className="bi bi-plus-circle me-1"></i> Add Category
                          </button>
                        </div>
                        <div className="table-responsive">
                          <table className="table custom-table align-middle">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Sub-Categories</th>
                                <th>Image Source</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {categories.map((c) => (
                                <tr key={c._id}>
                                  <td><span className="fw-semibold text-dark">{c.name}</span></td>
                                  <td className="small text-muted" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description}</td>
                                  <td style={{ maxWidth: '250px' }}>
                                    <div className="d-flex flex-wrap gap-1">
                                      {c.subCategories && c.subCategories.map((sub, idx) => (
                                        <span key={idx} className="badge bg-light text-success border border-success border-opacity-10 px-2 py-0.5 rounded small">
                                          {sub}
                                        </span>
                                      ))}
                                      {(!c.subCategories || c.subCategories.length === 0) && (
                                        <span className="text-muted small italic">None</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="small font-monospace" style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.image}</td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <button onClick={() => openEditForm('categories', c)} className="btn btn-xs btn-outline-primary py-1 px-2.5 small"><i className="bi bi-pencil-square"></i></button>
                                      <button onClick={() => handleDelete('/categories', c._id)} className="btn btn-xs btn-outline-danger py-1 px-2.5 small"><i className="bi bi-trash"></i></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      // Add/Edit Category Form
                      <div className="card glass-card p-4 max-w-xl mx-auto text-start" style={{ maxWidth: '650px', margin: '0 auto' }}>
                        <h4 className="science-font fw-bold mb-4">{isEditMode ? 'Modify Category Specs' : 'Establish New Category'}</h4>
                        <form onSubmit={handleCategorySubmit}>
                          <div className="mb-3">
                            <label className="form-label small fw-bold text-dark">Category Name</label>
                            <input type="text" className="form-control" value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
                          </div>
                          
                          {/* Sub-Category Section below Category Name */}
                          <div className="mb-3">
                            <label className="form-label small fw-bold text-dark">Sub-Categories</label>
                            <div className="d-flex gap-2 mb-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Type sub-category and press Enter or Add"
                                value={newSubCategory}
                                onChange={(e) => setNewSubCategory(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddSubCategory();
                                  }
                                }}
                              />
                              <button type="button" className="btn btn-success px-3" onClick={handleAddSubCategory}>Add</button>
                            </div>
                            <div className="d-flex flex-wrap gap-2 p-2 bg-light rounded border" style={{ minHeight: '45px' }}>
                              {categoryForm.subCategories && categoryForm.subCategories.map((sub, index) => (
                                <span key={index} className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2.5 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 small fw-semibold">
                                  {sub}
                                  <button
                                    type="button"
                                    className="btn-close"
                                    style={{ fontSize: '0.65rem', filter: 'invert(0.3)' }}
                                    onClick={() => handleRemoveSubCategory(index)}
                                  ></button>
                                </span>
                              ))}
                              {(!categoryForm.subCategories || categoryForm.subCategories.length === 0) && (
                                <span className="text-muted small my-auto">No sub-categories added yet.</span>
                              )}
                            </div>
                          </div>

                          {/* Image URL or Device Upload */}
                          <div className="mb-3">
                            <label className="form-label small fw-bold text-dark">Add Image by URL</label>
                            <div className="d-flex gap-2 mb-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="https://images.unsplash.com/..."
                                value={categoryImageUrlInput}
                                onChange={(e) => setCategoryImageUrlInput(e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-success"
                                onClick={handleAddCategoryImageByUrl}
                              >
                                Add URL
                              </button>
                            </div>
                            <div className="text-muted small text-center mb-2 fw-semibold">- OR -</div>
                            <label className="form-label small fw-bold text-dark">Upload Multiple Images from Device</label>
                            <input
                              type="file"
                              className="form-control mb-3"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                            />
                            {categoryForm.images && categoryForm.images.length > 0 && (
                              <div className="mt-3">
                                <span className="small text-dark fw-bold d-block mb-2">Category Image Gallery:</span>
                                <div className="row g-2">
                                  {categoryForm.images.map((imgSrc, idx) => {
                                    const isPrimary = categoryForm.image === imgSrc;
                                    return (
                                      <div className="col-4" key={idx}>
                                        <div className="border rounded p-1 text-center bg-white position-relative" style={{ height: '110px' }}>
                                          <img
                                            src={imgSrc}
                                            alt={`Preview ${idx}`}
                                            className="img-fluid w-100 h-100 object-fit-cover rounded"
                                          />
                                          {isPrimary && (
                                            <span className="position-absolute top-0 start-0 m-1 badge bg-success text-white small" style={{ zIndex: 2 }}>
                                              Primary
                                            </span>
                                          )}
                                          <div className="position-absolute bottom-0 end-0 m-1 d-flex gap-1" style={{ zIndex: 2 }}>
                                            {!isPrimary && (
                                              <button
                                                type="button"
                                                className="btn btn-success p-1 py-0 d-flex align-items-center justify-content-center"
                                                style={{ width: '22px', height: '22px' }}
                                                title="Set as primary banner"
                                                onClick={() => setCategoryForm({ ...categoryForm, image: imgSrc })}
                                              >
                                                <i className="bi bi-star-fill" style={{ fontSize: '0.75rem' }}></i>
                                              </button>
                                            )}
                                            <button
                                              type="button"
                                              className="btn btn-danger p-1 py-0 d-flex align-items-center justify-content-center"
                                              style={{ width: '22px', height: '22px' }}
                                              title="Delete image"
                                              onClick={() => {
                                                const filtered = categoryForm.images.filter((_, i) => i !== idx);
                                                setCategoryForm({
                                                  ...categoryForm,
                                                  images: filtered,
                                                  image: isPrimary ? (filtered[0] || '') : categoryForm.image,
                                                });
                                              }}
                                            >
                                              <i className="bi bi-trash" style={{ fontSize: '0.75rem' }}></i>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mb-4">
                            <label className="form-label small fw-bold text-dark">Description</label>
                            <textarea className="form-control" rows="4" value={categoryForm.description} onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })} required></textarea>
                          </div>
                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success px-4">Save Specifications</button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary px-3">Cancel</button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* --- TAB: MANAGE PRODUCTS --- */}
                {activeTab === 'products' && (
                  <div>
                    {!showForm ? (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h3 className="science-font fs-4 fw-bold">Product Catalog ({products.length})</h3>
                          <button onClick={() => openAddForm('products')} className="btn btn-sm btn-success">
                            <i className="bi bi-plus-circle me-1"></i> Add Product
                          </button>
                        </div>
                        <div className="table-responsive">
                          <table className="table custom-table align-middle">
                            <thead>
                              <tr>
                                <th>Product Title</th>
                                <th>Category</th>
                                <th>Sub-Category</th>
                                <th>Price</th>
                                <th>In Stock</th>
                                <th>Specifications</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {products.map((p) => (
                                <tr key={p._id}>
                                  <td><span className="fw-semibold text-dark">{p.title}</span></td>
                                  <td><span className="badge bg-success bg-opacity-10 text-success">{p.category?.name || 'Unassigned'}</span></td>
                                  <td>{p.subCategory ? <span className="badge bg-light text-secondary border px-2 py-0.5 rounded">{p.subCategory}</span> : <span className="text-muted small italic">None</span>}</td>
                                  <td className="small font-monospace">{p.price}</td>
                                  <td>{p.inStock ? <span className="text-success"><i className="bi bi-check-circle-fill"></i></span> : <span className="text-danger"><i className="bi bi-x-circle-fill"></i></span>}</td>
                                  <td className="small text-muted" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(p.specifications || []).join(', ')}</td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <button onClick={() => openEditForm('products', p)} className="btn btn-xs btn-outline-primary py-1 px-2.5 small"><i className="bi bi-pencil-square"></i></button>
                                      <button onClick={() => handleDelete('/products', p._id)} className="btn btn-xs btn-outline-danger py-1 px-2.5 small"><i className="bi bi-trash"></i></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      // Add/Edit Product Form
                      <div className="card glass-card p-4 max-w-xl mx-auto text-start" style={{ maxWidth: '650px', margin: '0 auto' }}>
                        <h4 className="science-font fw-bold mb-4">{isEditMode ? 'Modify Product Specifications' : 'Add New Product to Catalog'}</h4>
                        <form onSubmit={handleProductSubmit}>
                          <div className="row mb-3">
                            <div className="col-md-4">
                              <label className="form-label small fw-bold text-dark">Product Title</label>
                              <input type="text" className="form-control" value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} required />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label small fw-bold text-dark">Associated Category</label>
                              <select className="form-select" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value, subCategory: '' })} required>
                                <option value="">-- Choose Category --</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label className="form-label small fw-bold text-dark">Sub-Category</label>
                              <select 
                                className="form-select" 
                                value={productForm.subCategory} 
                                onChange={e => setProductForm({ ...productForm, subCategory: e.target.value })} 
                                disabled={!productForm.category || (categories.find(c => c._id === productForm.category)?.subCategories || []).length === 0}
                              >
                                <option value="">-- Choose Sub-Category --</option>
                                {(categories.find(c => c._id === productForm.category)?.subCategories || []).map(sub => (
                                  <option key={sub} value={sub}>{sub}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label className="form-label small fw-bold text-dark">Price Structure (e.g. Rs./kg)</label>
                              <input type="text" className="form-control" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label small fw-bold text-dark">Stock Status</label>
                              <select className="form-select" value={productForm.inStock} onChange={e => setProductForm({ ...productForm, inStock: e.target.value === 'true' })}>
                                <option value="true">In Stock</option>
                                <option value="false">Out of Stock</option>
                              </select>
                            </div>
                          </div>
                          
                          {/* Display Image URL or upload from Device */}
                          <div className="mb-3">
                            <label className="form-label small fw-bold text-dark">Add Image by URL</label>
                            <div className="d-flex gap-2 mb-2">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="https://images.unsplash.com/..."
                                value={productImageUrlInput}
                                onChange={(e) => setProductImageUrlInput(e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-success"
                                onClick={handleAddProductImageByUrl}
                              >
                                Add URL
                              </button>
                            </div>
                            <div className="text-muted small text-center mb-2 fw-semibold">- OR -</div>
                            <label className="form-label small fw-bold text-dark">Upload Multiple Images from Device</label>
                            <input
                              type="file"
                              className="form-control mb-3"
                              accept="image/*"
                              multiple
                              onChange={handleProductImageUpload}
                            />
                            {productForm.images && productForm.images.length > 0 && (
                              <div className="mt-3">
                                <span className="small text-dark fw-bold d-block mb-2">Product Image Gallery:</span>
                                <div className="row g-2">
                                  {productForm.images.map((imgSrc, idx) => {
                                    const isPrimary = productForm.image === imgSrc;
                                    return (
                                      <div className="col-4" key={idx}>
                                        <div className="border rounded p-1 text-center bg-white position-relative" style={{ height: '110px' }}>
                                          <img
                                            src={imgSrc}
                                            alt={`Preview ${idx}`}
                                            className="img-fluid w-100 h-100 object-fit-cover rounded"
                                          />
                                          {isPrimary && (
                                            <span className="position-absolute top-0 start-0 m-1 badge bg-success text-white small" style={{ zIndex: 2 }}>
                                              Primary
                                            </span>
                                          )}
                                          <div className="position-absolute bottom-0 end-0 m-1 d-flex gap-1" style={{ zIndex: 2 }}>
                                            {!isPrimary && (
                                              <button
                                                type="button"
                                                className="btn btn-success p-1 py-0 d-flex align-items-center justify-content-center"
                                                style={{ width: '22px', height: '22px' }}
                                                title="Set as main display image"
                                                onClick={() => setProductForm({ ...productForm, image: imgSrc })}
                                              >
                                                <i className="bi bi-star-fill" style={{ fontSize: '0.75rem' }}></i>
                                              </button>
                                            )}
                                            <button
                                              type="button"
                                              className="btn btn-danger p-1 py-0 d-flex align-items-center justify-content-center"
                                              style={{ width: '22px', height: '22px' }}
                                              title="Delete image"
                                              onClick={() => {
                                                const filtered = productForm.images.filter((_, i) => i !== idx);
                                                setProductForm({
                                                  ...productForm,
                                                  images: filtered,
                                                  image: isPrimary ? (filtered[0] || '') : productForm.image,
                                                });
                                              }}
                                            >
                                              <i className="bi bi-trash" style={{ fontSize: '0.75rem' }}></i>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mb-3">
                            <label className="form-label small fw-bold text-dark">Technical Specifications (comma separated)</label>
                            <input type="text" className="form-control" placeholder="e.g. Moisture: <6%, Organic Certified, Origin: Assam" value={productForm.specifications} onChange={e => setProductForm({ ...productForm, specifications: e.target.value })} />
                          </div>
                          <div className="mb-4">
                            <label className="form-label small fw-bold text-dark">Product Description Summary</label>
                            <textarea className="form-control" rows="5" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} required></textarea>
                          </div>
                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success px-4">Save Specifications</button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary px-3">Cancel</button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* --- TAB: MANAGE ORDERS --- */}
                {activeTab === 'orders' && (
                  <div>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                      <div>
                        <h3 className="science-font fs-4 fw-bold mb-1">Customer Product Orders ({orders.length})</h3>
                        <p className="text-muted small mb-0">View invoices, track fulfillment status, and manage purchase records.</p>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Search order #, customer..."
                          style={{ maxWidth: '220px' }}
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                        />
                        <select
                          className="form-select form-select-sm"
                          style={{ maxWidth: '150px' }}
                          value={orderStatusFilter}
                          onChange={(e) => setOrderStatusFilter(e.target.value)}
                        >
                          <option value="">All Statuses</option>
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table custom-table align-middle">
                        <thead>
                          <tr>
                            <th>Order Number</th>
                            <th>Customer Info</th>
                            <th>Date Placed</th>
                            <th>Fulfillment Status</th>
                            <th>Total Amount</th>
                            <th>Payment Method</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders
                            .filter(order => {
                              const matchSearch = orderSearch.trim() === '' || 
                                order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
                                order.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
                                order.customer.email.toLowerCase().includes(orderSearch.toLowerCase());
                              const matchStatus = orderStatusFilter === '' || order.status === orderStatusFilter;
                              return matchSearch && matchStatus;
                            })
                            .map((o) => (
                              <tr key={o._id}>
                                <td>
                                  <button
                                    onClick={() => setSelectedOrder(o)}
                                    className="btn btn-link p-0 fw-bold text-success text-decoration-none science-font"
                                  >
                                    {o.orderNumber}
                                  </button>
                                </td>
                                <td>
                                  <div className="fw-semibold text-dark">{o.customer.name}</div>
                                  <div className="small text-muted">{o.customer.email}</div>
                                </td>
                                <td className="small">{new Date(o.createdAt).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}</td>
                                <td>
                                  <select
                                    value={o.status}
                                    onChange={(e) => handleOrderStatusUpdate(o._id, e.target.value)}
                                    className={`form-select form-select-sm fw-bold border-0 text-white ${
                                      o.status === 'Pending' ? 'bg-danger' : 
                                      o.status === 'Processing' ? 'bg-warning text-dark' : 
                                      o.status === 'Shipped' ? 'bg-primary' : 
                                      o.status === 'Completed' ? 'bg-success' : 'bg-secondary'
                                    }`}
                                    style={{ width: '130px' }}
                                  >
                                    <option value="Pending" className="bg-danger text-white">Pending</option>
                                    <option value="Processing" className="bg-warning text-dark">Processing</option>
                                    <option value="Shipped" className="bg-primary text-white">Shipped</option>
                                    <option value="Completed" className="bg-success text-white">Completed</option>
                                    <option value="Cancelled" className="bg-secondary text-white">Cancelled</option>
                                  </select>
                                </td>
                                <td className="font-monospace fw-semibold text-dark">Rs. {o.summary.grandTotal.toFixed(2)}</td>
                                <td className="small">{o.customer.paymentMethod}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      onClick={() => setSelectedOrder(o)}
                                      className="btn btn-xs btn-outline-success py-1 px-2.5 small"
                                      title="Inspect Invoice"
                                    >
                                      <i className="bi bi-eye"></i>
                                    </button>
                                    <button
                                      onClick={() => handleOrderDelete(o._id)}
                                      className="btn btn-xs btn-outline-danger py-1 px-2.5 small"
                                      title="Delete Order Record"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          {orders.length === 0 && (
                            <tr>
                              <td colSpan="7" className="text-center py-4 text-muted">No orders found matching parameters.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* --- TAB: MANAGE IMPORT/EXPORT --- */}
                {activeTab === 'importexport' && (
                  <div>
                    {!showForm ? (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h3 className="science-font fs-4 fw-bold">Active Logistics corridors ({importExport.length})</h3>
                          <button onClick={() => openAddForm('importexport')} className="btn btn-sm btn-success">
                            <i className="bi bi-plus-circle me-1"></i> Register Trade Route
                          </button>
                        </div>
                        <div className="table-responsive">
                          <table className="table custom-table align-middle">
                            <thead>
                              <tr>
                                <th>Route Name</th>
                                <th>Description</th>
                                <th>Destinations</th>
                                <th>Shipping Modes</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {importExport.map((ie) => (
                                <tr key={ie._id}>
                                  <td><span className="fw-semibold text-dark">{ie.title}</span></td>
                                  <td className="small text-muted" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ie.description}</td>
                                  <td>{(ie.destinationCountries || []).map(c => <span key={c} className="badge bg-secondary me-1 text-xs">{c}</span>)}</td>
                                  <td>{(ie.shippingModes || []).map(m => <span key={m} className="badge bg-success bg-opacity-10 text-success me-1 text-xs">{m}</span>)}</td>
                                  <td><span className={`badge ${ie.status === 'active' ? 'bg-success' : 'bg-warning'}`}>{ie.status}</span></td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <button onClick={() => openEditForm('importexport', ie)} className="btn btn-xs btn-outline-primary py-1 px-2.5 small"><i className="bi bi-pencil-square"></i></button>
                                      <button onClick={() => handleDelete('/importexport', ie._id)} className="btn btn-xs btn-outline-danger py-1 px-2.5 small"><i className="bi bi-trash"></i></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      // Add/Edit ImportExport Form
                      <div className="card glass-card p-4 max-w-xl mx-auto" style={{ maxWidth: '650px', margin: '0 auto' }}>
                        <h4 className="science-font fw-bold mb-4">{isEditMode ? 'Modify Trade Corridor Route' : 'Establish New Trade Corridor'}</h4>
                        <form onSubmit={handleImportExportSubmit}>
                          <div className="mb-3">
                            <label className="form-label small fw-bold">Corridor Title</label>
                            <input type="text" className="form-control" value={importExportForm.title} onChange={e => setImportExportForm({ ...importExportForm, title: e.target.value })} required />
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label className="form-label small fw-bold">Destination Countries (comma separated)</label>
                              <input type="text" className="form-control" value={importExportForm.destinationCountries} onChange={e => setImportExportForm({ ...importExportForm, destinationCountries: e.target.value })} required />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label small fw-bold">Shipping Modes (comma separated)</label>
                              <input type="text" className="form-control" value={importExportForm.shippingModes} onChange={e => setImportExportForm({ ...importExportForm, shippingModes: e.target.value })} required />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="form-label small fw-bold">Route & Regulatory Description</label>
                            <textarea className="form-control" rows="4" value={importExportForm.description} onChange={e => setImportExportForm({ ...importExportForm, description: e.target.value })} required></textarea>
                          </div>
                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-science-primary">Save Specs</button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* --- TAB: MANAGE BLOGS --- */}
                {activeTab === 'blogs' && (
                  <div>
                    {!showForm ? (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h3 className="science-font fs-4 fw-bold">Scientific Blogs ({blogs.length})</h3>
                          <button onClick={() => openAddForm('blogs')} className="btn btn-sm btn-success">
                            <i className="bi bi-plus-circle me-1"></i> Add Blog Post
                          </button>
                        </div>
                        <div className="table-responsive">
                          <table className="table custom-table align-middle">
                            <thead>
                              <tr>
                                <th>Blog Title</th>
                                <th>Author</th>
                                <th>Tags</th>
                                <th>Published</th>
                                <th>Created</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {blogs.map((b) => (
                                <tr key={b._id}>
                                  <td><span className="fw-semibold text-dark">{b.title}</span></td>
                                  <td>{b.author}</td>
                                  <td>{(b.tags || []).map(t => <span key={t} className="badge bg-secondary bg-opacity-10 text-secondary me-1 text-xs">#{t}</span>)}</td>
                                  <td>{b.published ? <span className="text-success"><i className="bi bi-check-circle-fill"></i></span> : <span className="text-warning">Draft</span>}</td>
                                  <td className="small">{new Date(b.createdAt).toLocaleDateString()}</td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <button onClick={() => openEditForm('blogs', b)} className="btn btn-xs btn-outline-primary py-1 px-2.5 small"><i className="bi bi-pencil-square"></i></button>
                                      <button onClick={() => handleDelete('/blogs', b._id)} className="btn btn-xs btn-outline-danger py-1 px-2.5 small"><i className="bi bi-trash"></i></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      // Add/Edit Blog Form
                      <div className="card glass-card p-4 max-w-xl mx-auto" style={{ maxWidth: '650px', margin: '0 auto' }}>
                        <h4 className="science-font fw-bold mb-4">{isEditMode ? 'Modify Blog Draft' : 'Publish New Blog Post'}</h4>
                        <form onSubmit={handleBlogSubmit}>
                          <div className="mb-3">
                            <label className="form-label small fw-bold">Title</label>
                            <input type="text" className="form-control" value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} required />
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label className="form-label small fw-bold">Author</label>
                              <input type="text" className="form-control" value={blogForm.author} onChange={e => setBlogForm({ ...blogForm, author: e.target.value })} required />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label small fw-bold">Tags (comma separated)</label>
                              <input type="text" className="form-control" value={blogForm.tags} onChange={e => setBlogForm({ ...blogForm, tags: e.target.value })} />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label small fw-bold">Cover Image URL</label>
                            <input type="text" className="form-control" value={blogForm.image} onChange={e => setBlogForm({ ...blogForm, image: e.target.value })} />
                          </div>
                          <div className="mb-3">
                            <label className="form-label small fw-bold">Article Content</label>
                            <textarea className="form-control" rows="8" value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} required></textarea>
                          </div>
                          <div className="form-check form-switch mb-4">
                            <input className="form-check-input" type="checkbox" role="switch" id="publishedSwitch" checked={blogForm.published} onChange={e => setBlogForm({ ...blogForm, published: e.target.checked })} />
                            <label className="form-check-label small fw-bold" htmlFor="publishedSwitch">Publish Immediately</label>
                          </div>
                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-science-primary">Publish Article</button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* --- TAB: MANAGE RESEARCH --- */}
                {activeTab === 'research' && (
                  <div>
                    {!showForm ? (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h3 className="science-font fs-4 fw-bold">Publications ({research.length})</h3>
                          <button onClick={() => openAddForm('research')} className="btn btn-sm btn-success">
                            <i className="bi bi-plus-circle me-1"></i> New Publication
                          </button>
                        </div>
                        <div className="table-responsive">
                          <table className="table custom-table align-middle">
                            <thead>
                              <tr>
                                <th>Publication Title</th>
                                <th>Authors</th>
                                <th>Category</th>
                                <th>Journal</th>
                                <th>Date</th>
                                <th>DOI</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {research.map((r) => (
                                <tr key={r._id}>
                                  <td><span className="fw-semibold text-dark">{r.title}</span></td>
                                  <td className="small">{r.authors}</td>
                                  <td><span className="badge bg-primary bg-opacity-10 text-primary">{r.category}</span></td>
                                  <td className="small">{r.journal}</td>
                                  <td className="small">{r.publishDate ? new Date(r.publishDate).toLocaleDateString() : ''}</td>
                                  <td className="small font-monospace">{r.doi || 'N/A'}</td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <button onClick={() => openEditForm('research', r)} className="btn btn-xs btn-outline-primary py-1 px-2.5 small"><i className="bi bi-pencil-square"></i></button>
                                      <button onClick={() => handleDelete('/research', r._id)} className="btn btn-xs btn-outline-danger py-1 px-2.5 small"><i className="bi bi-trash"></i></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      // Add/Edit Research Form
                      <div className="card glass-card p-4 max-w-xl mx-auto" style={{ maxWidth: '650px', margin: '0 auto' }}>
                        <h4 className="science-font fw-bold mb-4">{isEditMode ? 'Modify Paper Metadata' : 'Register New Research Paper'}</h4>
                        <form onSubmit={handleResearchSubmit}>
                          <div className="mb-3">
                            <label className="form-label small fw-bold">Paper Title</label>
                            <input type="text" className="form-control" value={researchForm.title} onChange={e => setResearchForm({ ...researchForm, title: e.target.value })} required />
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label className="form-label small fw-bold">Authors (e.g. Roy, B., Patel, M.)</label>
                              <input type="text" className="form-control" value={researchForm.authors} onChange={e => setResearchForm({ ...researchForm, authors: e.target.value })} required />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label small fw-bold">Category</label>
                              <select className="form-select" value={researchForm.category} onChange={e => setResearchForm({ ...researchForm, category: e.target.value })}>
                                <option value="Molecular Biology">Molecular Biology</option>
                                <option value="AI Diagnostics">AI Diagnostics</option>
                                <option value="Cancer Immunotherapy">Cancer Immunotherapy</option>
                                <option value="Biofuels & Sustainability">Biofuels & Sustainability</option>
                                <option value="Gene Editing & CRISPR">Gene Editing & CRISPR</option>
                              </select>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label className="form-label small fw-bold">Journal Name</label>
                              <input type="text" className="form-control" value={researchForm.journal} onChange={e => setResearchForm({ ...researchForm, journal: e.target.value })} required />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label small fw-bold">Publish Date</label>
                              <input type="date" className="form-control" value={researchForm.publishDate} onChange={e => setResearchForm({ ...researchForm, publishDate: e.target.value })} required />
                            </div>
                          </div>
                          <div className="row mb-4">
                            <div className="col-md-6">
                              <label className="form-label small fw-bold">DOI Link String</label>
                              <input type="text" className="form-control" value={researchForm.doi} onChange={e => setResearchForm({ ...researchForm, doi: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label small fw-bold">PDF Access URL</label>
                              <input type="text" className="form-control" value={researchForm.pdfUrl} onChange={e => setResearchForm({ ...researchForm, pdfUrl: e.target.value })} />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="form-label small fw-bold">Manuscript Abstract</label>
                            <textarea className="form-control" rows="6" value={researchForm.abstract} onChange={e => setResearchForm({ ...researchForm, abstract: e.target.value })} required></textarea>
                          </div>
                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-science-primary">Save Specifications</button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* --- TAB: VIEW INQUIRIES --- */}
                {activeTab === 'messages' && (
                  <div>
                    <h3 className="science-font fs-4 fw-bold mb-3">Commercial Inquiries Desk ({contacts.length})</h3>
                    <div className="table-responsive">
                      <table className="table custom-table align-middle">
                        <thead>
                          <tr>
                            <th>Buyer Details</th>
                            <th>Target Product</th>
                            <th>Subject</th>
                            <th>Inquiry Specifications</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.map((m) => (
                            <tr key={m._id} className={m.status === 'unread' ? 'table-warning' : ''}>
                              <td>
                                <div className="fw-semibold text-dark">{m.name}</div>
                                <div className="small text-muted">{m.email}</div>
                              </td>
                              <td>{m.productInquiry ? <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-10">{m.productInquiry}</span> : <span className="text-muted small">General Inquiry</span>}</td>
                              <td className="small fw-semibold">{m.subject}</td>
                              <td><p className="small text-muted mb-0" style={{ maxWidth: '350px', whiteSpace: 'normal', fontSize: '12px' }}>{m.message}</p></td>
                              <td>
                                <select
                                  value={m.status}
                                  onChange={(e) => handleContactStatusUpdate(m._id, e.target.value)}
                                  className={`form-select form-select-sm fw-bold border-0 text-white ${
                                    m.status === 'unread' ? 'bg-danger' : m.status === 'read' ? 'bg-warning text-dark' : 'bg-success'
                                  }`}
                                  style={{ width: '110px' }}
                                >
                                  <option value="unread" className="bg-danger text-white">Unread</option>
                                  <option value="read" className="bg-warning text-dark">Read</option>
                                  <option value="replied" className="bg-success text-white">Replied</option>
                                </select>
                              </td>
                              <td className="small">{new Date(m.createdAt).toLocaleDateString()}</td>
                              <td>
                                <button onClick={() => handleDelete('/contacts', m._id)} className="btn btn-xs btn-outline-danger py-1 px-2.5 small">
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* --- TAB: MANAGE OFFICES --- */}
                {activeTab === 'offices' && (
                  <div>
                    {!showForm ? (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h3 className="science-font fs-4 fw-bold">Trade Offices ({offices.length})</h3>
                          <button onClick={() => openAddForm('offices')} className="btn btn-sm btn-success">
                            <i className="bi bi-plus-circle me-1"></i> Add Office
                          </button>
                        </div>
                        <div className="table-responsive">
                          <table className="table custom-table align-middle">
                            <thead>
                              <tr>
                                <th>Name / Title</th>
                                <th>Address</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {offices.map((o) => (
                                <tr key={o._id}>
                                  <td><span className="fw-semibold text-dark">{o.title}</span></td>
                                  <td className="small text-muted" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.address}</td>
                                  <td className="small font-monospace">{o.phone}</td>
                                  <td className="small font-monospace">{o.email}</td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <button onClick={() => openEditForm('offices', o)} className="btn btn-xs btn-outline-primary py-1 px-2.5 small"><i className="bi bi-pencil-square"></i></button>
                                      <button onClick={() => handleDelete('/offices', o._id)} className="btn btn-xs btn-outline-danger py-1 px-2.5 small"><i className="bi bi-trash"></i></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      // Add/Edit Office Form
                      <div className="card glass-card p-4 max-w-xl mx-auto text-start" style={{ maxWidth: '650px', margin: '0 auto' }}>
                        <h4 className="science-font fw-bold mb-4">{isEditMode ? 'Modify Office Details' : 'Register New Trade Office'}</h4>
                        <form onSubmit={handleOfficeSubmit}>
                          <div className="mb-3">
                            <label className="form-label small fw-bold text-dark">Office Name/Title</label>
                            <input type="text" className="form-control" value={officeForm.title} onChange={e => setOfficeForm({ ...officeForm, title: e.target.value })} required placeholder="e.g. Basundhara Bio-Tech HQ" />
                          </div>
                          <div className="mb-3">
                            <label className="form-label small fw-bold text-dark">Office Address</label>
                            <input type="text" className="form-control" value={officeForm.address} onChange={e => setOfficeForm({ ...officeForm, address: e.target.value })} required placeholder="Sector V, Salt Lake..." />
                          </div>
                          <div className="row mb-4">
                            <div className="col-md-6">
                              <label className="form-label small fw-bold text-dark">Phone Number</label>
                              <input type="text" className="form-control" value={officeForm.phone} onChange={e => setOfficeForm({ ...officeForm, phone: e.target.value })} required placeholder="+91 (033) 2440-9876" />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label small fw-bold text-dark">Email Address</label>
                              <input type="email" className="form-control" value={officeForm.email} onChange={e => setOfficeForm({ ...officeForm, email: e.target.value })} required placeholder="info@basundharabiotech.com" />
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success px-4">Save Specifications</button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary px-3">Cancel</button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* --- TAB: MANAGE ABOUT SECTIONS --- */}
                {activeTab === 'about' && (
                  <div>
                    {/* Inner Sub-Tabs Navigation */}
                    <div className="d-flex gap-2 mb-4 border-bottom pb-2">
                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${aboutSubTab === 'leadership' ? 'btn-success text-white' : 'btn-light border border-secondary border-opacity-10 text-dark'}`}
                        onClick={() => { setAboutSubTab('leadership'); setShowForm(false); }}
                      >
                        <i className="bi bi-people-fill me-1.5"></i> Leadership Team
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${aboutSubTab === 'vision_values' ? 'btn-success text-white' : 'btn-light border border-secondary border-opacity-10 text-dark'}`}
                        onClick={() => { setAboutSubTab('vision_values'); setShowForm(false); }}
                      >
                        <i className="bi bi-eye-fill me-1.5"></i> Vision & Values
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${aboutSubTab === 'history' ? 'btn-success text-white' : 'btn-light border border-secondary border-opacity-10 text-dark'}`}
                        onClick={() => { setAboutSubTab('history'); setShowForm(false); }}
                      >
                        <i className="bi bi-clock-history me-1.5"></i> History Timeline
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${aboutSubTab === 'facility' ? 'btn-success text-white' : 'btn-light border border-secondary border-opacity-10 text-dark'}`}
                        onClick={() => { setAboutSubTab('facility'); setShowForm(false); }}
                      >
                        <i className="bi bi-geo-alt-fill me-1.5"></i> Operating Coordinates
                      </button>
                    </div>

                    {!showForm ? (
                      <div>
                        {aboutSubTab === 'leadership' ? (
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h4 className="science-font fs-5 fw-bold text-dark mb-0">Corporate Leadership Team ({aboutList.length})</h4>
                              <button onClick={() => openAddForm('about')} className="btn btn-sm btn-success">
                                <i className="bi bi-plus-circle me-1"></i> Add Team Member
                              </button>
                            </div>
                            <div className="table-responsive">
                              <table className="table custom-table align-middle">
                                <thead>
                                  <tr>
                                    <th>Photo / Icon</th>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Qualification</th>
                                    <th>Bio</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {aboutList.map((m) => (
                                    <tr key={m._id}>
                                      <td>
                                        <div className="d-inline-flex justify-content-center align-items-center rounded bg-success bg-opacity-10 text-success overflow-hidden" style={{ width: '45px', height: '45px' }}>
                                          {m.image ? (
                                            <img src={m.image} alt={m.name} className="w-100 h-100 object-fit-cover" />
                                          ) : (
                                            <i className={`bi ${m.icon || 'bi-person'} fs-4`}></i>
                                          )}
                                        </div>
                                      </td>
                                      <td><span className="fw-semibold text-dark">{m.name}</span></td>
                                      <td><span className="badge bg-success bg-opacity-10 text-success">{m.role}</span></td>
                                      <td className="small text-muted" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.qualification}</td>
                                      <td className="small text-muted" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.bio}</td>
                                      <td>
                                        <div className="d-flex gap-2">
                                          <button onClick={() => openEditForm('about', m)} className="btn btn-xs btn-outline-primary py-1 px-2.5 small"><i className="bi bi-pencil-square"></i></button>
                                          <button onClick={() => handleDelete('/about', m._id)} className="btn btn-xs btn-outline-danger py-1 px-2.5 small"><i className="bi bi-trash"></i></button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                  {aboutList.length === 0 && (
                                    <tr>
                                      <td colSpan="6" className="text-center py-4 text-muted">No leadership team members registered yet.</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h4 className="science-font fs-5 fw-bold text-capitalize text-dark mb-0">
                                {aboutSubTab.replace('_', ' & ')} Sections ({aboutSections.filter(s => s.type === aboutSubTab).length})
                              </h4>
                              <button onClick={() => openAddForm('about-section', aboutSubTab)} className="btn btn-sm btn-success">
                                <i className="bi bi-plus-circle me-1"></i> Add Section Item
                              </button>
                            </div>
                            <div className="table-responsive">
                              <table className="table custom-table align-middle">
                                <thead>
                                  <tr>
                                    {aboutSubTab === 'history' && <th>Year</th>}
                                    {aboutSubTab !== 'history' && <th>Icon</th>}
                                    <th>Title</th>
                                    <th>Content Details</th>
                                    <th>Theme Color</th>
                                    <th>Order</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {aboutSections
                                    .filter((s) => s.type === aboutSubTab)
                                    .map((s) => (
                                      <tr key={s._id}>
                                        {aboutSubTab === 'history' && <td className="fw-bold font-monospace">{s.year}</td>}
                                        {aboutSubTab !== 'history' && (
                                          <td>
                                            <div className="d-inline-flex justify-content-center align-items-center rounded bg-light border p-2" style={{ width: '40px', height: '40px' }}>
                                              <i className={`bi ${s.icon || 'bi-gear'} fs-5 text-${s.color || 'success'}`}></i>
                                            </div>
                                          </td>
                                        )}
                                        <td><span className="fw-semibold text-dark">{s.title}</span></td>
                                        <td className="small text-muted" style={{ maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.content}</td>
                                        <td><span className={`badge bg-${s.color || 'success'}`}>{s.color}</span></td>
                                        <td className="font-monospace">{s.order}</td>
                                        <td>
                                          <div className="d-flex gap-2">
                                            <button onClick={() => openEditForm('about-section', s)} className="btn btn-xs btn-outline-primary py-1 px-2.5 small"><i className="bi bi-pencil-square"></i></button>
                                            <button onClick={() => handleDelete('/about-sections', s._id)} className="btn btn-xs btn-outline-danger py-1 px-2.5 small"><i className="bi bi-trash"></i></button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  {aboutSections.filter(s => s.type === aboutSubTab).length === 0 && (
                                    <tr>
                                      <td colSpan="7" className="text-center py-4 text-muted">No items registered for this section yet.</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Form Modes
                      <div>
                        {aboutSubTab !== 'leadership' ? (
                          // Add/Edit AboutSection Form
                          <div className="card glass-card p-4 max-w-xl mx-auto text-start" style={{ maxWidth: '650px', margin: '0 auto' }}>
                            <h4 className="science-font fw-bold mb-4">
                              {isEditMode ? 'Modify Section Details' : 'Add New Section Item'} ({aboutSubTab.replace('_', ' & ')})
                            </h4>
                            <form onSubmit={handleAboutSectionSubmit}>
                              <div className="row mb-3">
                                <div className="col-md-6">
                                  <label className="form-label small fw-bold text-dark">Item Title</label>
                                  <input type="text" className="form-control" value={aboutSectionForm.title} onChange={e => setAboutSectionForm({ ...aboutSectionForm, title: e.target.value })} required placeholder="e.g. Our Vision, Processing Unit I..." />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label small fw-bold text-dark">Theme Color</label>
                                  <select className="form-select" value={aboutSectionForm.color} onChange={e => setAboutSectionForm({ ...aboutSectionForm, color: e.target.value })}>
                                    <option value="success">Success (Green)</option>
                                    <option value="primary">Primary (Blue)</option>
                                    <option value="warning">Warning (Yellow)</option>
                                    <option value="danger">Danger (Red)</option>
                                    <option value="secondary">Secondary (Gray)</option>
                                  </select>
                                </div>
                              </div>

                              <div className="row mb-3">
                                {aboutSubTab === 'history' ? (
                                  <div className="col-md-6">
                                    <label className="form-label small fw-bold text-dark">Timeline Year</label>
                                    <input type="text" className="form-control" value={aboutSectionForm.year} onChange={e => setAboutSectionForm({ ...aboutSectionForm, year: e.target.value })} required placeholder="e.g. 2020, 2026" />
                                  </div>
                                ) : (
                                  <div className="col-md-6">
                                    <label className="form-label small fw-bold text-dark">Bootstrap Icon Class</label>
                                    <input type="text" className="form-control" value={aboutSectionForm.icon} onChange={e => setAboutSectionForm({ ...aboutSectionForm, icon: e.target.value })} required placeholder="e.g. bi-eye, bi-recycle, bi-egg-fried" />
                                  </div>
                                )}
                                <div className="col-md-6">
                                  <label className="form-label small fw-bold text-dark">Display Order (Sorting)</label>
                                  <input type="number" className="form-control" value={aboutSectionForm.order} onChange={e => setAboutSectionForm({ ...aboutSectionForm, order: Number(e.target.value) })} required />
                                </div>
                              </div>

                              <div className="mb-4">
                                <label className="form-label small fw-bold text-dark">Section Description / Content Details</label>
                                <textarea className="form-control" rows="4" value={aboutSectionForm.content} onChange={e => setAboutSectionForm({ ...aboutSectionForm, content: e.target.value })} required placeholder="Write the detailed text description here..."></textarea>
                              </div>

                              <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-success px-4">Save Section Specs</button>
                                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary px-3">Cancel</button>
                              </div>
                            </form>
                          </div>
                        ) : (
                          // Add/Edit Member Form
                          <div className="card glass-card p-4 max-w-xl mx-auto text-start" style={{ maxWidth: '650px', margin: '0 auto' }}>
                            <h4 className="science-font fw-bold mb-4">{isEditMode ? 'Modify Member Details' : 'Register New Team Member'}</h4>
                            <form onSubmit={handleAboutSubmit}>
                              <div className="row mb-3">
                                <div className="col-md-6">
                                  <label className="form-label small fw-bold text-dark">Member Name</label>
                                  <input type="text" className="form-control" value={aboutForm.name} onChange={e => setAboutForm({ ...aboutForm, name: e.target.value })} required placeholder="e.g. Dr. Jane Doe" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label small fw-bold text-dark">Corporate Role</label>
                                  <input type="text" className="form-control" value={aboutForm.role} onChange={e => setAboutForm({ ...aboutForm, role: e.target.value })} required placeholder="e.g. Chief Scientific Officer" />
                                </div>
                              </div>
                              <div className="mb-3">
                                <label className="form-label small fw-bold text-dark">Academic Qualifications / Experience</label>
                                <input type="text" className="form-control" value={aboutForm.qualification} onChange={e => setAboutForm({ ...aboutForm, qualification: e.target.value })} required placeholder="e.g. PhD in Biochemistry (Oxford)" />
                              </div>
                              
                              <div className="row mb-3">
                                <div className="col-md-6">
                                  <label className="form-label small fw-bold text-dark">Bootstrap Icon Class (optional)</label>
                                  <input type="text" className="form-control" value={aboutForm.icon} onChange={e => setAboutForm({ ...aboutForm, icon: e.target.value })} placeholder="e.g. bi-person, bi-flower1" />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label small fw-bold text-dark">Upload Member Photo</label>
                                  <input type="file" className="form-control" accept="image/*" onChange={handleAboutImageUpload} />
                                </div>
                              </div>

                              {aboutForm.image && (
                                <div className="mb-3">
                                  <span className="small text-muted d-block mb-1">Photo Preview:</span>
                                  <img src={aboutForm.image} alt="Preview" className="img-thumbnail rounded-circle object-fit-cover" style={{ width: '90px', height: '90px' }} />
                                </div>
                              )}

                              <div className="mb-4">
                                <label className="form-label small fw-bold text-dark">Professional Bio Summary</label>
                                <textarea className="form-control" rows="4" value={aboutForm.bio} onChange={e => setAboutForm({ ...aboutForm, bio: e.target.value })} required placeholder="Write a short summary of their achievements, research background, or operations scope..."></textarea>
                              </div>
                              <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-success px-4">Save Member Specs</button>
                                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary px-3">Cancel</button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* --- TAB: GALLERY --- */}
                {activeTab === 'gallery' && (
                  <div>
                    {!showForm ? (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h3 className="science-font fs-4 fw-bold">Operational Gallery ({gallery.length})</h3>
                          <button onClick={() => openAddForm('gallery')} className="btn btn-sm btn-success">
                            <i className="bi bi-plus-circle me-1"></i> Add Gallery Item
                          </button>
                        </div>
                        <div className="table-responsive">
                          <table className="table custom-table align-middle">
                            <thead>
                              <tr>
                                <th>Thumbnail</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Images Count</th>
                                <th>Order</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {gallery.map((g) => (
                                <tr key={g._id}>
                                  <td>
                                    <div className="d-inline-flex justify-content-center align-items-center rounded bg-light border overflow-hidden" style={{ width: '55px', height: '40px' }}>
                                      {g.images && g.images.length > 0 ? (
                                        <img src={g.images[0]} alt={g.title} className="w-100 h-100 object-fit-cover" />
                                      ) : (
                                        <i className="bi bi-image text-muted fs-4"></i>
                                      )}
                                    </div>
                                  </td>
                                  <td><span className="fw-semibold text-dark">{g.title}</span></td>
                                  <td><span className="badge bg-dark bg-opacity-75">{g.category}</span></td>
                                  <td className="small text-muted" style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.description}</td>
                                  <td><span className="badge bg-info bg-opacity-10 text-info fw-bold">{g.images?.length || 0} images</span></td>
                                  <td className="font-monospace">{g.order}</td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <button onClick={() => openEditForm('gallery', g)} className="btn btn-xs btn-outline-primary py-1 px-2.5 small"><i className="bi bi-pencil-square"></i></button>
                                      <button onClick={() => handleDelete('/gallery', g._id)} className="btn btn-xs btn-outline-danger py-1 px-2.5 small"><i className="bi bi-trash"></i></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {gallery.length === 0 && (
                                <tr>
                                  <td colSpan="7" className="text-center py-4 text-muted">No gallery items registered yet.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      // Add/Edit Gallery Form
                      <div className="card glass-card p-4 max-w-xl mx-auto text-start" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        <h4 className="science-font fw-bold mb-4">{isEditMode ? 'Modify Gallery Item' : 'Add New Gallery Item'}</h4>
                        <form onSubmit={handleGallerySubmit}>
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label className="form-label small fw-bold text-dark">Item Title</label>
                              <input type="text" className="form-control" value={galleryForm.title} onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })} required placeholder="e.g. Controlled Dehydration Chamber" />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label small fw-bold text-dark">Category Filter</label>
                              <select className="form-select" value={galleryForm.category} onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })} required>
                                <option value="Farms">Farms</option>
                                <option value="Processing">Processing</option>
                                <option value="Recycling">Recycling</option>
                                <option value="Shipments">Shipments</option>
                              </select>
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label small fw-bold text-dark">Display Order (Sorting)</label>
                            <input type="number" className="form-control" value={galleryForm.order} onChange={e => setGalleryForm({ ...galleryForm, order: Number(e.target.value) })} required />
                          </div>

                          <div className="mb-3">
                            <label className="form-label small fw-bold text-dark">Description</label>
                            <textarea className="form-control" rows="3" value={galleryForm.description} onChange={e => setGalleryForm({ ...galleryForm, description: e.target.value })} required placeholder="Short summary description of operations shown in the image..."></textarea>
                          </div>

                          {/* Image Multi-Selector */}
                          <div className="mb-4 p-3 bg-light rounded-3 border">
                            <label className="form-label small fw-bold text-success mb-2"><i className="bi bi-images me-1"></i>Image Assets Manager (Supports Multi-Upload)</label>
                            
                            <div className="row g-2 mb-3">
                              <div className="col-md-6">
                                <label className="form-label small text-muted">Option A: Upload files from device</label>
                                <input type="file" className="form-control form-control-sm" accept="image/*" multiple onChange={handleGalleryImageUpload} />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label small text-muted">Option B: Load from web link/URL</label>
                                <div className="input-group input-group-sm">
                                  <input type="text" className="form-control" placeholder="https://domain.com/photo.jpg" value={galleryImageUrlInput} onChange={e => setGalleryImageUrlInput(e.target.value)} />
                                  <button className="btn btn-outline-success" type="button" onClick={handleAddGalleryImageByUrl}>Add Link</button>
                                </div>
                              </div>
                            </div>

                            {/* Images preview grid */}
                            {galleryForm.images && galleryForm.images.length > 0 ? (
                              <div>
                                <span className="small text-muted d-block mb-2">Loaded Images ({galleryForm.images.length}) - Select a star to set primary thumbnail:</span>
                                <div className="row row-cols-4 g-2">
                                  {galleryForm.images.map((img, idx) => (
                                    <div key={idx} className="col position-relative">
                                      <div className="ratio ratio-4x3 border rounded bg-white overflow-hidden">
                                        <img src={img} alt="Preview" className="w-100 h-100 object-fit-cover" />
                                      </div>
                                      {/* Star primary image toggle */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const filtered = galleryForm.images.filter(i => i !== img);
                                          const reordered = [img, ...filtered];
                                          setGalleryForm({ ...galleryForm, images: reordered });
                                        }}
                                        className={`btn btn-xs position-absolute top-2 start-2 p-1.5 rounded shadow-sm border-0 d-inline-flex justify-content-center align-items-center ${idx === 0 ? 'btn-warning' : 'btn-light bg-opacity-75'}`}
                                        title={idx === 0 ? 'Primary Image (Active)' : 'Set as Primary Image'}
                                        style={{ zIndex: 10, width: '22px', height: '22px' }}
                                      >
                                        <i className={`bi ${idx === 0 ? 'bi-star-fill text-dark' : 'bi-star'} small`}></i>
                                      </button>
                                      {/* Delete button */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = galleryForm.images.filter((_, i) => i !== idx);
                                          setGalleryForm({ ...galleryForm, images: updated });
                                        }}
                                        className="btn btn-xs btn-danger position-absolute top-2 end-2 p-1.5 rounded shadow-sm border-0 d-inline-flex justify-content-center align-items-center"
                                        style={{ zIndex: 10, width: '22px', height: '22px' }}
                                      >
                                        <i className="bi bi-trash-fill small"></i>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-3 text-muted small bg-white rounded border border-dashed">No images loaded yet. Please select files or add web links.</div>
                            )}
                          </div>

                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success px-4">Save Gallery Item</button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary px-3">Cancel</button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* --- TAB: SUSTAINABILITY --- */}
                {activeTab === 'sustainability' && (
                  <div>
                    {/* Inner Sub-Tabs Navigation */}
                    <div className="d-flex gap-2 mb-4 border-bottom pb-2">
                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${sustainabilitySubTab === 'hero' ? 'btn-success text-white' : 'btn-light border border-secondary border-opacity-10 text-dark'}`}
                        onClick={() => { setSustainabilitySubTab('hero'); setShowForm(false); }}
                      >
                        <i className="bi bi-window-sidebar me-1.5"></i> Hero Card
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${sustainabilitySubTab === 'initiative' ? 'btn-success text-white' : 'btn-light border border-secondary border-opacity-10 text-dark'}`}
                        onClick={() => { setSustainabilitySubTab('initiative'); setShowForm(false); }}
                      >
                        <i className="bi bi-recycle me-1.5"></i> Circularity Initiatives
                      </button>
                    </div>

                    {!showForm ? (
                      <div>
                        {sustainabilitySubTab === 'hero' ? (
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h4 className="science-font fs-5 fw-bold text-dark mb-0">Sustainability target (Hero) ({sustainability.filter(s => s.type === 'hero').length})</h4>
                              {sustainability.filter(s => s.type === 'hero').length === 0 && (
                                <button onClick={() => openAddForm('sustainability', 'hero')} className="btn btn-sm btn-success">
                                  <i className="bi bi-plus-circle me-1"></i> Add Hero Target
                                </button>
                              )}
                            </div>
                            <div className="table-responsive">
                              <table className="table custom-table align-middle">
                                <thead>
                                  <tr>
                                    <th>Target Title</th>
                                    <th>Main Description</th>
                                    <th>Certification</th>
                                    <th>Certification Icon</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sustainability.filter(s => s.type === 'hero').map((h) => (
                                    <tr key={h._id}>
                                      <td><span className="fw-semibold text-dark">{h.title}</span></td>
                                      <td className="small text-muted" style={{ maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.description}</td>
                                      <td><span className="badge bg-success bg-opacity-10 text-success fw-bold">{h.impact || 'Zero Waste Certified'}</span></td>
                                      <td className="font-monospace small text-dark"><i className={`bi ${h.icon || 'bi-shield-fill-check'} me-1.5`}></i>{h.icon || 'bi-shield-fill-check'}</td>
                                      <td>
                                        <div className="d-flex gap-2">
                                          <button onClick={() => openEditForm('sustainability', h)} className="btn btn-xs btn-outline-primary py-1 px-2.5 small"><i className="bi bi-pencil-square"></i></button>
                                          <button onClick={() => handleDelete('/sustainability', h._id)} className="btn btn-xs btn-outline-danger py-1 px-2.5 small"><i className="bi bi-trash"></i></button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                  {sustainability.filter(s => s.type === 'hero').length === 0 && (
                                    <tr>
                                      <td colSpan="5" className="text-center py-4 text-muted">No Hero target configured yet. Add one to customize the Sustainability Page Header Card.</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h4 className="science-font fs-5 fw-bold text-dark mb-0">Circularity Initiatives ({sustainability.filter(s => s.type === 'initiative').length})</h4>
                              <button onClick={() => openAddForm('sustainability', 'initiative')} className="btn btn-sm btn-success">
                                <i className="bi bi-plus-circle me-1"></i> Add Initiative Card
                              </button>
                            </div>
                            <div className="table-responsive">
                              <table className="table custom-table align-middle">
                                <thead>
                                  <tr>
                                    <th>Icon</th>
                                    <th>Initiative Title</th>
                                    <th>Description Details</th>
                                    <th>Impact Summary</th>
                                    <th>Order</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sustainability.filter(s => s.type === 'initiative').map((s) => (
                                    <tr key={s._id}>
                                      <td>
                                        <div className="d-inline-flex justify-content-center align-items-center rounded bg-success bg-opacity-10 text-success p-2" style={{ width: '40px', height: '40px' }}>
                                          <i className={`bi ${s.icon || 'bi-recycle'} fs-5`}></i>
                                        </div>
                                      </td>
                                      <td><span className="fw-semibold text-dark">{s.title}</span></td>
                                      <td className="small text-muted" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.description}</td>
                                      <td className="small fw-semibold text-success">{s.impact}</td>
                                      <td className="font-monospace">{s.order}</td>
                                      <td>
                                        <div className="d-flex gap-2">
                                          <button onClick={() => openEditForm('sustainability', s)} className="btn btn-xs btn-outline-primary py-1 px-2.5 small"><i className="bi bi-pencil-square"></i></button>
                                          <button onClick={() => handleDelete('/sustainability', s._id)} className="btn btn-xs btn-outline-danger py-1 px-2.5 small"><i className="bi bi-trash"></i></button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                  {sustainability.filter(s => s.type === 'initiative').length === 0 && (
                                    <tr>
                                      <td colSpan="6" className="text-center py-4 text-muted">No initiatives registered yet.</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Add/Edit Sustainability Form
                      <div className="card glass-card p-4 max-w-xl mx-auto text-start" style={{ maxWidth: '650px', margin: '0 auto' }}>
                        <h4 className="science-font fw-bold mb-4">
                          {isEditMode ? 'Modify Sustainability specs' : 'Add Sustainability item'} ({sustainabilitySubTab === 'hero' ? 'Hero Card' : 'Initiative Card'})
                        </h4>
                        <form onSubmit={handleSustainabilitySubmit}>
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label className="form-label small fw-bold text-dark">Title</label>
                              <input type="text" className="form-control" value={sustainabilityForm.title} onChange={e => setSustainabilityForm({ ...sustainabilityForm, title: e.target.value })} required placeholder={sustainabilitySubTab === 'hero' ? "e.g. Our Goal: Zero Industrial Agro-Waste" : "e.g. Agricultural Coir Upcycling"} />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label small fw-bold text-dark">Bootstrap Icon Class</label>
                              <input type="text" className="form-control" value={sustainabilityForm.icon} onChange={e => setSustainabilityForm({ ...sustainabilityForm, icon: e.target.value })} required placeholder="e.g. bi-recycle, bi-sun-fill, bi-shield-fill-check" />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label className="form-label small fw-bold text-dark">{sustainabilitySubTab === 'hero' ? "Certification text" : "Impact statement"}</label>
                              <input type="text" className="form-control" value={sustainabilityForm.impact} onChange={e => setSustainabilityForm({ ...sustainabilityForm, impact: e.target.value })} required placeholder={sustainabilitySubTab === 'hero' ? "e.g. Zero Waste Certified" : "e.g. 120 Metric Tons of husk waste diverted annually"} />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label small fw-bold text-dark">Display Order (Sorting)</label>
                              <input type="number" className="form-control" value={sustainabilityForm.order} onChange={e => setSustainabilityForm({ ...sustainabilityForm, order: Number(e.target.value) })} required />
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="form-label small fw-bold text-dark">Detailed Description content</label>
                            <textarea className="form-control" rows="4" value={sustainabilityForm.description} onChange={e => setSustainabilityForm({ ...sustainabilityForm, description: e.target.value })} required placeholder="Write the main description details here..."></textarea>
                          </div>

                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success px-4">Save Specifications</button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary px-3">Cancel</button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Modal for Order Inspection */}
            {selectedOrder && (
              <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg modal-dialog-centered animate-fade-in" role="document">
                  <div className="modal-content glass-card border border-secondary border-opacity-10 shadow-lg text-start" style={{ borderRadius: '20px' }}>
                    <div className="modal-header border-bottom border-secondary border-opacity-10 px-4 py-3">
                      <h5 className="modal-title science-font fw-bold text-gradient-bio"><i className="bi bi-receipt-cutoff me-2"></i>Order Invoice Clearance</h5>
                      <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)} aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4 overflow-auto" style={{ maxHeight: '70vh' }}>
                      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                        <div>
                          <div className="d-flex align-items-center mb-1">
                            <span className="science-font fw-bold fs-5 text-success">BASUNDHARA</span>
                            <span className="science-font fw-light fs-5 text-dark ms-1">BIO-TECH</span>
                          </div>
                          <p className="text-muted small mb-0">Invoice #: <strong>{selectedOrder.orderNumber}</strong></p>
                          <p className="text-muted small mb-0">Date Placed: {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-end">
                          <span className={`badge px-3 py-2 rounded-pill fw-bold text-white mb-2 d-inline-block ${
                            selectedOrder.status === 'Pending' ? 'bg-danger' : 
                            selectedOrder.status === 'Processing' ? 'bg-warning text-dark' : 
                            selectedOrder.status === 'Shipped' ? 'bg-primary' : 
                            selectedOrder.status === 'Completed' ? 'bg-success' : 'bg-secondary'
                          }`}>
                            {selectedOrder.status.toUpperCase()}
                          </span>
                          <div className="text-muted small">Method: <strong>{selectedOrder.customer.paymentMethod}</strong></div>
                        </div>
                      </div>

                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <h6 className="science-font fw-bold text-success mb-2"><i className="bi bi-person-fill me-1"></i>Billed To:</h6>
                          <div className="p-3 bg-light rounded-3 border h-100">
                            <p className="text-dark mb-1 fw-bold">{selectedOrder.customer.name}</p>
                            <p className="text-muted small mb-1"><i className="bi bi-envelope me-1"></i>{selectedOrder.customer.email}</p>
                            <p className="text-muted small mb-1"><i className="bi bi-telephone me-1"></i>{selectedOrder.customer.phone}</p>
                            <p className="text-muted small mb-0"><i className="bi bi-geo-alt me-1"></i>{selectedOrder.customer.address}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <h6 className="science-font fw-bold text-primary mb-2"><i className="bi bi-truck me-1"></i>Fulfillment Control:</h6>
                          <div className="p-3 bg-light rounded-3 border h-100 d-flex flex-column justify-content-between">
                            <div>
                              <p className="small text-muted mb-2">Modify order state parameters in real-time:</p>
                              <select
                                value={selectedOrder.status}
                                onChange={(e) => {
                                  handleOrderStatusUpdate(selectedOrder._id, e.target.value);
                                  setSelectedOrder({ ...selectedOrder, status: e.target.value });
                                }}
                                className="form-select form-select-sm fw-bold"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                            <div className="mt-3 pt-2 border-top text-end">
                              <button onClick={() => { window.print(); }} className="btn btn-xs btn-outline-secondary py-1 px-3 small">
                                <i className="bi bi-printer-fill me-1"></i> Print Invoice
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h6 className="science-font fw-bold text-dark mb-2"><i className="bi bi-list-check me-1"></i>Line Items Breakdown:</h6>
                      <div className="table-responsive mb-4">
                        <table className="table table-bordered align-middle">
                          <thead className="table-light">
                            <tr>
                              <th className="small fw-bold">Product Title</th>
                              <th className="text-center small fw-bold" style={{ width: '120px' }}>Unit Price</th>
                              <th className="text-center small fw-bold" style={{ width: '80px' }}>Qty</th>
                              <th className="text-end small fw-bold" style={{ width: '140px' }}>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.items.map((item, idx) => (
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

                      <div className="row justify-content-end text-end g-2">
                        <div className="col-md-6 col-lg-5">
                          <div className="d-flex justify-content-between py-1 border-bottom small">
                            <span className="text-muted">Subtotal:</span>
                            <span className="font-monospace text-dark">Rs. {selectedOrder.summary.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="d-flex justify-content-between py-1 border-bottom small">
                            <span className="text-muted">Bio-Tax (5%):</span>
                            <span className="font-monospace text-dark">Rs. {selectedOrder.summary.tax.toFixed(2)}</span>
                          </div>
                          <div className="d-flex justify-content-between py-1 border-bottom small">
                            <span className="text-muted">Logistics Shipping:</span>
                            <span className="font-monospace text-dark">
                              {selectedOrder.summary.shipping === 0 ? <span className="text-success fw-bold">FREE</span> : `Rs. ${selectedOrder.summary.shipping.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between py-2 mt-2 bg-light px-2 rounded">
                            <span className="fw-bold text-dark">Grand Total:</span>
                            <span className="font-monospace fw-bold text-success">Rs. {selectedOrder.summary.grandTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer border-top border-secondary border-opacity-10 px-4 py-2.5">
                      <button type="button" className="btn btn-sm btn-secondary px-4" onClick={() => setSelectedOrder(null)}>Close Inspection</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
