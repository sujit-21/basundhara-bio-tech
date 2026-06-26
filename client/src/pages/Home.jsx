import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import img1 from '../homepage_image/moringa leaves.jpg';
import img2 from '../homepage_image/moringa leaves2.jpg';
import img3 from '../homepage_image/moringa leaves3.jpeg';
import api from '../services/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companyStats, setCompanyStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [img1, img2, img3];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsRes, categoriesRes, statsRes] = await Promise.all([
          api.get('/products?limit=3'),
          api.get('/categories'),
          api.get('/company-stats'),
        ]);

        if (productsRes.data.success && Array.isArray(productsRes.data.data)) {
          setFeaturedProducts(productsRes.data.data.slice(0, 3));
        }
        if (categoriesRes.data.success && Array.isArray(categoriesRes.data.data)) {
          setCategories(categoriesRes.data.data.slice(0, 4)); // Show top 4 categories
        }
        if (statsRes.data.success && Array.isArray(statsRes.data.data)) {
          setCompanyStats(statsRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="home-container">
      {/* 1. Hero Section */}
      <section className="bg-hero-science position-relative overflow-hidden py-5 d-flex align-items-center" style={{ minHeight: '85vh' }}>
        <div className="hero-slider-container" style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
          {slides.map((slide, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url('${slide}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out, transform 4.5s ease-out',
                transform: currentSlide === index ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          ))}
          {/* Overlay to ensure text readability against images */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(242, 240, 231, 0.4)' }}></div>
        </div>
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-start">

              <h1 className="display-4 fw-bold mb-3 science-font lh-base">
                Cultivating <span className="text-gradient-bio">Green Innovations</span> For Global Trade
              </h1>
              <p className="lead mb-4">
                Basundhara Bio-Tech blends biological engineering with ecological agriculture, high-efficiency cold food processing, natural health supplements, circular recycling, and compliant import-export supply lines.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/products" className="btn btn-science-primary btn-lg">
                  Explore Products <i className="bi bi-basket3 ms-1"></i>
                </Link>
                <Link to="/categories" className="btn btn-outline-success btn-lg">
                  Industry Sectors
                </Link>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block position-relative">
              {/* Floating stats card removed */}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Counter Stats */}
      {companyStats.length > 0 && (
        <section className="bg-light border-bottom border-top py-4">
          <div className="container">
            <div className="row g-4 text-center justify-content-center">
              {companyStats.map((stat) => (
                <div key={stat._id} className="col-md-3 col-6">
                  <h3 className={`science-font fw-bold text-${stat.color}`}>{stat.value}</h3>
                  <p className="text-muted small mb-0">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Industry Sectors Teaser */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="science-font fw-bold text-gradient-bio">Core Business Fields</h2>
            <p className="text-muted">Pioneering sustainable growth from organic farms to clean processing facilities</p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {categories.map((cat) => (
                <div className="col-lg-3 col-md-6" key={cat._id}>
                  <div className="card glass-card h-100 p-4 border border-secondary border-opacity-10 text-start">
                    <h4 className="science-font fs-5 fw-bold text-dark mb-2">{cat.name}</h4>
                    <p className="text-muted small mb-4">{cat.description}</p>
                    <Link to={`/categories`} className="text-success text-decoration-none mt-auto fw-bold small">
                      Read Specs <i className="bi bi-chevron-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Featured Products Slider */}
      <section className="py-5 bg-gradient-science text-white">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div className="text-start">
              <h2 className="science-font fw-bold text-white mb-2">Featured Premium Catalog</h2>
              <p className="text-secondary mb-0">Pure organic supplements, cold-dehydrated flakes, and Ayurvedic extracts</p>
            </div>
            <Link to="/products" className="btn btn-outline-success d-none d-md-inline-block">View Full Catalog</Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredProducts.map((prod) => (
                <div className="col-lg-4 col-md-6" key={prod._id}>
                  <div className="card h-100 p-3 border border-secondary border-opacity-20 text-start" style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px' }}>
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="img-fluid rounded mb-3 object-fit-cover"
                      style={{ height: '200px', width: '100%' }}
                    />
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-success bg-opacity-20 text-success text-xs px-2.5 py-1">{prod.category?.name}</span>
                      <span className="text-secondary small font-monospace">{prod.price}</span>
                    </div>
                    <h4 className="fs-5 fw-bold text-white mb-2">{prod.title}</h4>
                    <p className="text-secondary small mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {prod.description}
                    </p>
                    <Link to="/products" className="btn btn-sm btn-outline-light w-100 mt-auto">
                      Inquire Specs
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>



      {/* 6. Import/Export Route Teaser */}
      <section className="py-5 bg-gradient-light">
        <div className="container">
          <div className="glass-card p-5 border-0 text-center" style={{ background: 'rgba(255,255,255,0.9)' }}>
            <h3 className="science-font fw-bold text-gradient-bio mb-3">Global Supply Chain Compliance</h3>
            <p className="text-muted max-w-2xl mx-auto mb-4" style={{ maxWidth: '750px' }}>
              We manage trade corridors supplying organic botanical items, Ayurvedic bases, and upcycled materials to North America, Europe, and the Middle East under standard customs regulations.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/importexport" className="btn btn-science-primary">Supply Corridors</Link>
              <Link to="/contact" className="btn btn-outline-secondary">Contact Trade Desk</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
