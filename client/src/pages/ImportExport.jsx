import { useEffect, useState } from 'react';
import api from '../services/api';

const ImportExport = () => {
  const [corridors, setCorridors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCorridors = async () => {
      try {
        const res = await api.get('/importexport');
        if (res.data.success) {
          setCorridors(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch global logistics records.');
      } finally {
        setLoading(false);
      }
    };
    fetchCorridors();
  }, []);

  return (
    <div className="importexport-container py-5 text-start">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill science-font mb-2">Global Logistics</span>
          <h1 className="science-font fw-bold text-gradient-bio">Import & Export Services</h1>
          <p className="text-muted" style={{ maxWidth: '750px', margin: '0 auto' }}>
            We manage high-compliance trade corridors supplying premium organic bio-materials and dehydrated products to global hubs.
          </p>
        </div>

        {/* Trade map mockup */}
        <div className="card border border-secondary border-opacity-10 p-4 mb-5 shadow-sm" style={{ background: 'linear-gradient(135deg, #0b130a, #142213)', borderRadius: '24px' }}>
          <div className="row align-items-center g-4">
            <div className="col-lg-6 text-white">
              <h3 className="science-font fw-bold mb-3"><i className="bi bi-globe2 text-success me-2"></i>Global Hub Connectivity</h3>
              <p className="text-secondary small lh-lg">
                Basundhara Bio-Tech operates out of **Kolkata Port (Haldia)** and **Kolkata International Airport**, managing direct freight lanes to major logistics centers in Rotterdam, Hamburg, Jebel Ali (Dubai), and Singapore.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <span className="badge bg-success bg-opacity-25 border border-success text-success px-3 py-2"><i className="bi bi-shield-check me-1"></i>APEDA Certified</span>
                <span className="badge bg-success bg-opacity-25 border border-success text-success px-3 py-2"><i className="bi bi-file-earmark-lock-fill me-1"></i>Customs Bonded</span>
                <span className="badge bg-success bg-opacity-25 border border-success text-success px-3 py-2"><i className="bi bi-patch-check-fill me-1"></i>Phytosanitary Approved</span>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="border border-secondary border-opacity-25 rounded-3 p-5 bg-dark bg-opacity-50 text-secondary">
                <i className="bi bi-map fs-1 text-success mb-2 pulse-element"></i>
                <h5 className="science-font fw-bold text-white small">Interactive Trade Routes Grid</h5>
                <p className="small mb-0" style={{ fontSize: '11px' }}>Kolkata &lt;====== Sea Freight (Rotterdam, Dubai, Hamburg) ======&gt; Global Partners</p>
              </div>
            </div>
          </div>
        </div>

        {/* Corridors Grid */}
        <h2 className="science-font fw-bold text-gradient-bio mb-4 text-center">Active Trade Corridors</h2>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger shadow-sm text-center">{error}</div>
        ) : (
          <div className="row g-4 mb-5">
            {corridors.map((c) => (
              <div className="col-lg-6" key={c._id}>
                <div className="card glass-card h-100 p-4 border border-secondary border-opacity-10">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="science-font fs-5 fw-bold text-dark mb-0">{c.title}</h4>
                    <span className="badge bg-success">{c.status}</span>
                  </div>
                  <p className="text-muted small mb-4">{c.description}</p>
                  
                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <strong className="small text-secondary"><i className="bi bi-geo-fill text-success me-1"></i>Destinations:</strong>
                      <div className="d-flex flex-wrap gap-1 mt-1">
                        {(c.destinationCountries || []).map((country, idx) => (
                          <span key={idx} className="badge bg-light text-dark small">{country}</span>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <strong className="small text-secondary"><i className="bi bi-truck text-success me-1"></i>Freight Modes:</strong>
                      <div className="d-flex flex-wrap gap-1 mt-1">
                        {(c.shippingModes || []).map((mode, idx) => (
                          <span key={idx} className="badge bg-light text-success border border-success border-opacity-10 small">{mode}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Global form call */}
        <div className="glass-card p-5 text-center border-0" style={{ background: '#f4f6f4', borderRadius: '24px' }}>
          <h3 className="science-font fw-bold text-dark mb-2">Initiate Trade Negotiation</h3>
          <p className="text-muted small mb-4" style={{ maxWidth: '650px', margin: '0 auto' }}>
            Our compliance desk resolves certifications and supply schedules for commercial buyers. Reach out to coordinate shipping logistics.
          </p>
          <a href="/contact?subject=Trade Corridor inquiry" className="btn btn-science-primary">
            Contact Trade Desk <i className="bi bi-envelope-open-fill ms-2"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ImportExport;
