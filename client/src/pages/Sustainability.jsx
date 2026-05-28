import { Link } from 'react-router-dom';

const Sustainability = () => {
  const projects = [
    {
      title: 'Agricultural Coir Upcycling',
      description: 'We process raw discarded coconut husks from local farms, carding the fibers to manufacture organic biodegradable pots that substitute plastic starter trays in global greenhouse nurseries.',
      impact: '120 Metric Tons of husk waste diverted annually',
      icon: 'bi-recycle',
    },
    {
      title: 'Metagenomic Solid Composting',
      description: 'Utilizing biological bacterial inoculums in our compost chambers, we digest vegetable residues and food processing waste into nutrient-rich humus compost distributed back to our farming partners.',
      impact: '100% recycling of factory organic residues',
      icon: 'bi-flower1',
    },
    {
      title: 'Cold-Chain Energy Optimization',
      description: 'Our food processing facilities utilize solar power grids and thermal heat exchangers to minimize carbon footprints in agricultural cold storage and dehydration systems.',
      impact: '40% reduction in electricity dependency',
      icon: 'bi-sun-fill',
    },
  ];

  return (
    <div className="sustainability-container py-5 text-start">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill science-font mb-2">Eco-Conscious R&D</span>
          <h1 className="science-font fw-bold text-gradient-bio">Sustainability & Circularity</h1>
          <p className="text-muted" style={{ maxWidth: '750px', margin: '0 auto' }}>
            We engineering agricultural workflows to ensure that waste residues are fully captured, processed, and returned as high-value bio-inputs.
          </p>
        </div>

        {/* Hero Card */}
        <div className="card glass-card p-5 border border-secondary border-opacity-10 mb-5" style={{ background: 'linear-gradient(135deg, rgba(46,125,50,0.03), rgba(217,119,6,0.03))' }}>
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <h3 className="science-font fw-bold text-dark mb-3">Our Goal: Zero Industrial Agro-Waste</h3>
              <p className="text-muted small lh-lg">
                Agriculture and food processing generate substantial quantities of plant fibers, husks, and organic residues. Instead of combustion which releases carbon, Basundhara Bio-Tech runs a recovery network. We gather residues and transform them into soil stimulators, biodegradable planting shells, or fuel pallets, keeping the carbon bound in the circular system.
              </p>
            </div>
            <div className="col-lg-4 text-center">
              <div className="bg-success text-white rounded-circle p-4 d-inline-flex justify-content-center align-items-center mb-2" style={{ width: '100px', height: '100px' }}>
                <i className="bi bi-shield-fill-check fs-1"></i>
              </div>
              <h5 className="science-font fw-bold text-dark mt-2 small">Zero Waste Certified</h5>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <h2 className="science-font fw-bold text-gradient-bio mb-4 text-center">Circularity Initiatives</h2>
        <div className="row g-4 mb-5">
          {projects.map((proj, idx) => (
            <div className="col-lg-4 col-md-6" key={idx}>
              <div className="card glass-card h-100 p-4 border border-secondary border-opacity-10 d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-success bg-opacity-10 text-success p-2.5 rounded">
                    <i className={`bi ${proj.icon} fs-3`}></i>
                  </div>
                  <h4 className="science-font fs-6 fw-bold text-dark mb-0">{proj.title}</h4>
                </div>
                
                <p className="text-muted small mb-4 flex-grow-1">{proj.description}</p>
                
                <div className="mt-auto border-top pt-3">
                  <span className="text-success small fw-bold"><i className="bi bi-activity me-1"></i>Impact:</span>
                  <p className="text-muted small mb-0 mt-1">{proj.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="glass-card p-5 text-center border-0" style={{ background: '#e2e8f0', borderRadius: '24px' }}>
          <h3 className="science-font fw-bold text-dark mb-3">Upcycled Products Catalog</h3>
          <p className="text-muted small mb-4" style={{ maxWidth: '650px', margin: '0 auto' }}>
            Check out our inventory of organic compost formulations and plant pots made entirely from agricultural residues.
          </p>
          <Link to="/products?category=Recycling%20%26%20Waste%20Management" className="btn btn-science-primary">
            View Recycled Catalog <i className="bi bi-arrow-right-short ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;
