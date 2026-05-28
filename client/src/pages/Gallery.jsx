import { useState } from 'react';

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const galleryItems = [
    {
      title: 'Controlled Dehydration Chamber',
      category: 'Processing',
      image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop',
      description: 'Our biological cold dehumidification tunnels drying ginger slices.'
    },
    {
      title: 'Assam Organic Tea Gardens',
      category: 'Farms',
      image: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?q=80&w=800&auto=format&fit=crop',
      description: 'Plucking golden orthodox buds in partner cooperatives.'
    },
    {
      title: 'Coir Fiber Molding Press',
      category: 'Recycling',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop',
      description: 'Upcycling coconut husks into biodegradable pots under high hydraulic force.'
    },
    {
      title: 'Assay Lab Analysis',
      category: 'Processing',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop',
      description: 'Microbial testing of standardized Ashwagandha batches.'
    },
    {
      title: 'Organic Oyster Mushroom Beds',
      category: 'Farms',
      image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=800&auto=format&fit=crop',
      description: 'Fruiting bodies growing in temperature-controlled straw compost beds.'
    },
    {
      title: 'Container Cargo Ready for Export',
      category: 'Shipments',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
      description: 'Sealed bulk shipments prepped at Kolkata Port for Rotterdam.'
    }
  ];

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

        {/* Grid */}
        <div className="row g-4">
          {filteredItems.map((item, idx) => (
            <div className="col-lg-4 col-md-6 animate-fade-in" key={idx}>
              <div className="card glass-card h-100 overflow-hidden border border-secondary border-opacity-10">
                <div className="position-relative overflow-hidden" style={{ height: '240px' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-100 h-100 object-fit-cover transition-all"
                    style={{ transition: 'transform 0.4s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <span className="position-absolute top-3 start-3 badge bg-dark bg-opacity-75 text-white science-font small m-3">
                    {item.category}
                  </span>
                </div>
                <div className="card-body p-4">
                  <h4 className="science-font fs-6 fw-bold text-dark mb-2">{item.title}</h4>
                  <p className="text-muted small mb-0">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
