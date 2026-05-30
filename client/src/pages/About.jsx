import { useEffect, useState } from 'react';
import api from '../services/api';

const About = () => {
  const [leadership, setLeadership] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeadership = async () => {
      try {
        const res = await api.get('/about');
        if (res.data.success) {
          setLeadership(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load corporate leadership details.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeadership();
  }, []);

  return (
    <div className="about-container py-5 text-start">
      <div className="container">
        {/* Title */}
        <div className="text-center mb-5">
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill science-font mb-2">Our Foundation</span>
          <h1 className="science-font fw-bold text-gradient-bio">Rooted In Organic Growth</h1>
          <p className="text-muted" style={{ maxWidth: '800px', margin: '0 auto' }}>
            Basundhara Bio-Tech coordinates biological engineering, zero-chemical crop cultivation, natural dehydration preservation, circular recycling, and global trade corridors.
          </p>
        </div>

        {/* Mission / Vision Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="card glass-card p-4 h-100 border border-secondary border-opacity-10">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-eye text-success fs-3 me-3"></i>
                <h3 className="science-font fs-4 fw-bold mb-0">Our Vision</h3>
              </div>
              <p className="text-muted mb-0">
                To create a global agro-ecosystem where agricultural yields are optimized bio-metagenomically, waste is entirely upcycled into biodegradable items, and clean food supplements are accessible worldwide.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card glass-card p-4 h-100 border border-secondary border-opacity-10">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-shield-check text-primary fs-3 me-3"></i>
                <h3 className="science-font fs-4 fw-bold mb-0">Our Values</h3>
              </div>
              <p className="text-muted mb-0">
                Farmer empowerment, certified organic purity, circular zero-waste upcycling, strict phytosanitary compliance, and transparent international supply corridors define our day-to-day operations.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="my-5 py-4 bg-light rounded-4 px-4 shadow-sm border border-secondary border-opacity-10">
          <h2 className="science-font text-center fw-bold text-gradient-bio mb-5">Our Trade & Biotech History</h2>
          <div className="row position-relative">
            <div className="col-md-4 mb-4 mb-md-0 text-center">
              <div className="bg-success text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '50px', height: '50px' }}>2020</div>
              <h5 className="fw-bold science-font text-dark">Agro-Start</h5>
              <p className="text-muted small">Founded as a local seed and organic compost advisory group, coordinating with 200 farmers in Bengal.</p>
            </div>
            <div className="col-md-4 mb-4 mb-md-0 text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '50px', height: '50px' }}>2023</div>
              <h5 className="fw-bold science-font text-dark">Food Dehydration</h5>
              <p className="text-muted small">Commissioned our state-of-the-art cold-dehydration and spice CTC processing units, launching local food processing.</p>
            </div>
            <div className="col-md-4 text-center">
              <div className="bg-success text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '50px', height: '50px' }}>2026</div>
              <h5 className="fw-bold science-font text-dark">Global Upcycling</h5>
              <p className="text-muted small">Began recycling agricultural husks into biodegradable coir pots and established regular export corridors to Rotterdam and the Gulf.</p>
            </div>
          </div>
        </div>

        {/* Processing Facilities */}
        <div className="my-5 py-3">
          <div className="text-center mb-4">
            <h2 className="science-font fw-bold text-gradient-bio">Operating Coordinates</h2>
            <p className="text-muted">Our core processing plants and farming cooperatives</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card glass-card h-100 border-0 p-4">
                <h4 className="science-font fs-5 text-success mb-3"><i className="bi bi-egg-fried me-2"></i>Processing Unit I: Dehydration</h4>
                <p className="text-muted small">Equipped with low-temperature moisture extractor tunnels drying ginger, moringa leaves, and fruits under absolute dust-free guidelines.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card glass-card h-100 border-0 p-4">
                <h4 className="science-font fs-5 text-primary mb-3"><i className="bi bi-recycle me-2"></i>Processing Unit II: Upcycling</h4>
                <p className="text-muted small">Hydraulic fiber press filters converting coconut coir husks and stalks into high-density biodegradable pots and livestock feeding blocks.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card glass-card h-100 border-0 p-4">
                <h4 className="science-font fs-5 text-success mb-3"><i className="bi bi-patch-check me-2"></i>Organic Cooperatives</h4>
                <p className="text-muted small">Collaborating directly with 10,000+ organic farmers across North-East India to harvest spices, leaves, and medicinal barks.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Advisory / Scientific Leadership */}
        <div className="my-5 py-3">
          <h2 className="science-font text-center fw-bold text-gradient-bio mb-5">Corporate Leadership</h2>
          <div className="row g-4">
            {leadership.map((leader, i) => (
              <div className="col-lg-4 col-md-6" key={i}>
                <div className="card glass-card h-100 p-4 border border-secondary border-opacity-10 text-center">
                  <div className="bg-success bg-opacity-10 text-success rounded-circle p-0 d-inline-flex justify-content-center align-items-center mx-auto mb-3 overflow-hidden" style={{ width: '70px', height: '70px' }}>
                    {leader.image ? (
                      <img src={leader.image} alt={leader.name} className="w-100 h-100 object-fit-cover" />
                    ) : (
                      <i className={`bi ${leader.icon || 'bi-person'} fs-2`}></i>
                    )}
                  </div>
                  <h4 className="science-font fs-5 fw-bold text-dark">{leader.name}</h4>
                  <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 mb-3 small science-font">{leader.role}</span>
                  <p className="text-muted small fw-bold mb-2">{leader.qualification}</p>
                  <p className="text-muted small mb-0">{leader.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
