import { useEffect, useState } from 'react';
import api from '../services/api';

const About = () => {
  const [leadership, setLeadership] = useState([]);
  const [aboutSections, setAboutSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const [leadersRes, sectionsRes] = await Promise.all([
          api.get('/about'),
          api.get('/about-sections'),
        ]);
        if (leadersRes.data.success) {
          setLeadership(leadersRes.data.data);
        }
        if (sectionsRes.data.success) {
          setAboutSections(sectionsRes.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load About page details.');
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
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
          {aboutSections.filter(s => s.type === 'vision_values').map((s) => (
            <div className="col-md-6" key={s._id}>
              <div className="card glass-card p-4 h-100 border border-secondary border-opacity-10">
                <div className="d-flex align-items-center mb-3">
                  <i className={`bi ${s.icon || 'bi-eye'} text-${s.color || 'success'} fs-3 me-3`}></i>
                  <h3 className="science-font fs-4 fw-bold mb-0">{s.title}</h3>
                </div>
                <p className="text-muted mb-0">{s.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="my-5 py-4 bg-light rounded-4 px-4 shadow-sm border border-secondary border-opacity-10">
          <h2 className="science-font text-center fw-bold text-gradient-bio mb-5">Our Trade & Biotech History</h2>
          <div className="row position-relative">
            {aboutSections.filter(s => s.type === 'history').map((s) => (
              <div className="col-md-4 mb-4 mb-md-0 text-center" key={s._id}>
                <div className={`bg-${s.color || 'success'} text-white rounded-circle d-inline-flex justify-content-center align-items-center mb-3`} style={{ width: '50px', height: '50px' }}>
                  {s.year}
                </div>
                <h5 className="fw-bold science-font text-dark">{s.title}</h5>
                <p className="text-muted small">{s.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Facilities */}
        <div className="my-5 py-3">
          <div className="text-center mb-4">
            <h2 className="science-font fw-bold text-gradient-bio">Operating Coordinates</h2>
            <p className="text-muted">Our core processing plants and farming cooperatives</p>
          </div>
          <div className="row g-4">
            {aboutSections.filter(s => s.type === 'facility').map((s) => (
              <div className="col-md-4" key={s._id}>
                <div className="card glass-card h-100 border-0 p-4">
                  <h4 className="science-font fs-5 mb-3">
                    <i className={`bi ${s.icon || 'bi-gear'} text-${s.color || 'success'} me-2`}></i>
                    {s.title}
                  </h4>
                  <p className="text-muted small">{s.content}</p>
                </div>
              </div>
            ))}
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
