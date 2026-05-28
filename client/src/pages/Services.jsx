import { useEffect, useState } from 'react';
import api from '../services/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Modal State
  const [selectedService, setSelectedService] = useState(null);

  const categories = [
    'All',
    'Genomics & Sequencing',
    'Bioinformatics & AI',
    'Therapeutics & Vaccine Development',
    'Agricultural Biotech',
    'Industrial Enzymes',
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        if (response.data.success) {
          setServices(response.data.data);
        }
      } catch (err) {
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter Logic
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory =
      categoryFilter === 'All' || service.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="services-container py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill science-font mb-2">Our Capabilities</span>
          <h1 className="science-font fw-bold text-gradient-bio">Biotechnology Services</h1>
          <p className="text-muted" style={{ maxWidth: '700px', margin: '0 auto' }}>
            We provide world-class molecular assay, sequence scanning, and bioinformatics pipelines for global biotechnology and scientific organizations.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="row g-3 mb-5 align-items-center">
          {/* Search bar */}
          <div className="col-lg-4">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search assay, genomics, platforms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {/* Category Pill Buttons */}
          <div className="col-lg-8">
            <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`btn btn-sm px-3 py-2 rounded-pill science-font fw-semibold ${
                    categoryFilter === cat
                      ? 'btn-success text-white'
                      : 'btn-outline-secondary border-secondary border-opacity-25'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading biological pipeline...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger shadow-sm text-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-5 glass-card">
            <i className="bi bi-funnel-fill text-muted fs-1 mb-3"></i>
            <h4 className="science-font text-dark">No services found matching filters</h4>
            <p className="text-muted">Try updating your search query or selecting a different category.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredServices.map((service) => (
              <div className="col-lg-4 col-md-6" key={service._id}>
                <div className="card glass-card h-100 p-4 border border-secondary border-opacity-10 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="bg-success bg-opacity-10 text-success p-3 rounded-3">
                      <i className={`bi ${service.icon} fs-3`}></i>
                    </div>
                    <span className="badge bg-secondary bg-opacity-10 text-secondary px-2.5 py-1 rounded small science-font">
                      {service.category.split(' ')[0]}
                    </span>
                  </div>
                  <h4 className="science-font fs-5 fw-bold text-dark card-title mb-2">{service.title}</h4>
                  <p className="card-text text-muted small mb-4">{service.description}</p>
                  
                  <button
                    onClick={() => setSelectedService(service)}
                    className="btn btn-outline-success mt-auto align-self-start btn-sm px-3"
                    data-bs-toggle="modal"
                    data-bs-target="#serviceDetailsModal"
                  >
                    View Specifications <i className="bi bi-file-earmark-medical ms-1"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Dynamic Details Modal */}
      {selectedService && (
        <div className="modal fade" id="serviceDetailsModal" tabIndex="-1" aria-labelledby="serviceDetailsModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow border-0" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-bottom-0 pb-0">
                <span className="badge bg-success bg-opacity-10 text-success px-3 py-1.5 rounded-pill science-font">
                  {selectedService.category}
                </span>
                <button type="button" className="btn-close" data-bs-disconnect="modal" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body p-4 pt-3">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 text-success p-2 rounded me-3">
                    <i className={`bi ${selectedService.icon} fs-2`}></i>
                  </div>
                  <h3 className="modal-title science-font fw-bold text-dark" id="serviceDetailsModalLabel">
                    {selectedService.title}
                  </h3>
                </div>
                <hr className="my-3 text-muted" />
                <h5 className="science-font fs-6 fw-bold text-success mb-2">Technical Overview</h5>
                <p className="lead fs-6 text-muted mb-4">{selectedService.description}</p>
                
                <h5 className="science-font fs-6 fw-bold text-primary mb-2">Platform Specifications & Deliverables</h5>
                <p className="text-secondary small lh-lg" style={{ whiteSpace: 'pre-line' }}>{selectedService.details}</p>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close Specs</button>
                <a href="/contact" className="btn btn-science-primary btn-sm" data-bs-dismiss="modal">
                  Request Service Consultation <i className="bi bi-send ms-1"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
