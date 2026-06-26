import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // Mapping categories to nice icons
  const iconMap = {
    'Agriculture': 'bi-flower1',
    'Fishery': 'bi-water',
    'Dehydrated Vegetables': 'bi-egg-fried',
    'Dehydrated Fruits': 'bi-basket',
    'Dehydrated Leaves': 'bi-tree',
    'Roots, Barks, Flowers & Spices': 'bi-snow2',
    'Food Supplements': 'bi-capsule',
    'Ayurvedic Products': 'bi-heart-pulse',
    'Animal Husbandry': 'bi-piggy-bank',
    'Food Processing': 'bi-cup-hot',
    'Handicrafts': 'bi-gift',
    'Recycling & Waste Management': 'bi-recycle',
    'Import & Export': 'bi-globe-asia-australia'
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load industrial categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (catName) => {
    // Navigate to products catalog filtered by this category
    navigate(`/products?category=${encodeURIComponent(catName)}`);
  };

  return (
    <div className="categories-container py-5 text-start">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill science-font mb-2">Corporate Sectors</span>
          <h1 className="science-font fw-bold text-gradient-bio">Our Industry Divisions</h1>
          <p className="text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
            We coordinate operations across critical agro-industrial sectors to build a sustainable global bio-economy.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger shadow-sm text-center">{error}</div>
        ) : (
          <div className="row g-4">
            {categories.map((cat) => (
              <div className="col-lg-4 col-md-6" key={cat._id}>
                <div className="card glass-card h-100 p-4 border border-secondary border-opacity-10 d-flex flex-column">
                  {(cat.image || (cat.images && cat.images.length > 0)) && (
                    <div className="mb-4 rounded overflow-hidden" style={{ height: '200px' }}>
                      <img 
                        src={cat.image || cat.images[0]} 
                        alt={cat.name} 
                        className="w-100 h-100 object-fit-cover hover-zoom" 
                        style={{ transition: 'transform 0.3s ease' }}
                      />
                    </div>
                  )}
                  <div className="d-flex align-items-center gap-3 mb-3">
                    {!(cat.image || (cat.images && cat.images.length > 0)) && (
                      <div className="bg-success bg-opacity-10 text-success p-3 rounded">
                        <i className={`bi ${iconMap[cat.name] || 'bi-gear'} fs-3`}></i>
                      </div>
                    )}
                    <h3 className="science-font fs-5 fw-bold text-dark mb-0">{cat.name}</h3>
                  </div>
                  
                  <p className="text-muted small mb-4 flex-grow-1">{cat.description}</p>
                  
                  {/* Sub-categories details section */}
                  {cat.subCategories && cat.subCategories.length > 0 && (
                    <div className="mb-4 text-start">
                      <span className="small text-dark fw-bold d-block mb-2">Sub-categories:</span>
                      <div className="d-flex flex-wrap gap-1.5">
                        {cat.subCategories.map((sub, idx) => (
                          <span key={idx} className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-15 px-2.5 py-1.5 rounded-pill small fw-semibold">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleCategoryClick(cat.name)}
                    className="btn btn-outline-success btn-sm w-100 d-flex align-items-center justify-content-center mt-auto"
                  >
                    Browse Sector Products <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
