import { useEffect, useState } from 'react';
import api from '../services/api';

const GalleryCard = ({ item }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const images = item.images && item.images.length > 0 ? item.images : [item.image || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop'];

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="card glass-card h-100 overflow-hidden border border-secondary border-opacity-10 shadow-sm">
      <div className="position-relative overflow-hidden" style={{ height: '240px' }}>
        <img
          src={images[activeIdx]}
          alt={item.title}
          className="w-100 h-100 object-fit-cover"
          style={{ transition: 'opacity 0.3s ease-in-out' }}
        />
        
        {/* Navigation Arrows for multi-image */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage} 
              className="btn btn-dark btn-xs bg-opacity-60 border-0 position-absolute start-3 top-50 translate-middle-y rounded-circle d-flex align-items-center justify-content-center m-1 shadow-sm"
              style={{ width: '28px', height: '28px', zIndex: 10 }}
              type="button"
            >
              <i className="bi bi-chevron-left text-white fs-6"></i>
            </button>
            <button 
              onClick={nextImage} 
              className="btn btn-dark btn-xs bg-opacity-60 border-0 position-absolute end-3 top-50 translate-middle-y rounded-circle d-flex align-items-center justify-content-center m-1 shadow-sm"
              style={{ width: '28px', height: '28px', zIndex: 10 }}
              type="button"
            >
              <i className="bi bi-chevron-right text-white fs-6"></i>
            </button>
          </>
        )}

        <span className="position-absolute top-3 start-3 badge bg-dark bg-opacity-75 text-white science-font small m-3" style={{ zIndex: 9 }}>
          {item.category}
        </span>

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="position-absolute bottom-3 start-50 translate-middle-x d-flex gap-1.5" style={{ zIndex: 10 }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveIdx(i); }}
                className={`border-0 p-0 rounded-circle`}
                style={{ 
                  width: '6px', 
                  height: '6px', 
                  cursor: 'pointer', 
                  backgroundColor: activeIdx === i ? '#198754' : '#ffffff',
                  opacity: activeIdx === i ? 1 : 0.6 
                }}
                type="button"
              />
            ))}
          </div>
        )}
      </div>
      <div className="card-body p-4 text-start">
        <h4 className="science-font fs-6 fw-bold text-dark mb-2">{item.title}</h4>
        <p className="text-muted small mb-0">{item.description}</p>
      </div>
    </div>
  );
};

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data.success) {
          setGalleryItems(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch operational gallery items.');
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ['All', 'Farms', 'Processing', 'Recycling', 'Shipments'];

  const filteredItems = galleryItems.filter(
    item => activeFilter === 'All' || item.category === activeFilter
  );

  return (
    <div className="gallery-container py-5 text-start">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill science-font mb-2">Media Library</span>
          <h1 className="science-font fw-bold text-gradient-bio">Operational Gallery</h1>
          <p className="text-muted" style={{ maxWidth: '750px', margin: '0 auto' }}>
            A look inside our organic farms, food processing units, upcycling presses, and global container freight yards.
          </p>
        </div>

        {/* Filters */}
        <div className="d-flex flex-wrap gap-2 justify-content-center mb-5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`btn btn-sm px-3.5 py-2 rounded-pill science-font fw-semibold ${
                activeFilter === cat
                  ? 'btn-success text-white'
                  : 'btn-outline-secondary border-secondary border-opacity-25 text-dark'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading / Error / Empty States */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center max-w-lg mx-auto" style={{ maxWidth: '500px', margin: '0 auto' }}>
            {error}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-images fs-1 d-block mb-3 text-secondary opacity-50"></i>
            <p className="science-font fs-5 mb-0">No gallery items found for "{activeFilter}"</p>
          </div>
        ) : (
          /* Grid */
          <div className="row g-4">
            {filteredItems.map((item) => (
              <div className="col-lg-4 col-md-6 animate-fade-in" key={item._id}>
                <GalleryCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
