import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Footer = () => {
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchOffices = async () => {
      try {
        const res = await api.get('/offices');
        if (res.data.success && isMounted) {
          setOffices(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load offices in footer:', err);
      }
    };

    fetchOffices();

    const handleOfficesUpdated = () => {
      fetchOffices();
    };

    window.addEventListener('offices-updated', handleOfficesUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('offices-updated', handleOfficesUpdated);
    };
  }, []);

  return (
    <footer className="bg-gradient-science text-light py-5 mt-auto border-top border-secondary border-opacity-25">
      <div className="container">
        <div className="row g-4">
          {/* Logo & About */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <span className="science-font fw-bold fs-5 text-gradient-bio">BASUNDHARA</span>
              <span className="science-font fw-light fs-5 text-light ms-1">BIO-TECH</span>
            </div>
            <p className="text-secondary small">
              Basundhara Bio-Tech is a modern enterprise integrating biotechnology with sustainable agriculture, clean food processing (dehydration), wellness extracts, circular recycling, and global trade supply logistics.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="#" className="text-secondary hover-text-success"><i className="bi bi-linkedin fs-5"></i></a>
              <a href="#" className="text-secondary hover-text-success"><i className="bi bi-twitter-x fs-5"></i></a>
              <a href="#" className="text-secondary hover-text-success"><i className="bi bi-github fs-5"></i></a>
              <a href="#" className="text-secondary hover-text-success"><i className="bi bi-youtube fs-5"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5 className="science-font fs-6 mb-3 text-gradient-bio">Navigation</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/" className="text-secondary text-decoration-none hover-text-success">Home</Link></li>
              <li><Link to="/about" className="text-secondary text-decoration-none hover-text-success">About Us</Link></li>
              <li><Link to="/categories" className="text-secondary text-decoration-none hover-text-success">Industry Sectors</Link></li>
              <li><Link to="/products" className="text-secondary text-decoration-none hover-text-success">Product Catalog</Link></li>
              <li><Link to="/sustainability" className="text-secondary text-decoration-none hover-text-success">Recycling & Green Projects</Link></li>
              <li><Link to="/importexport" className="text-secondary text-decoration-none hover-text-success">Import-Export Services</Link></li>
            </ul>
          </div>

          {/* Specialities */}
          <div className="col-lg-3 col-md-6">
            <h5 className="science-font fs-6 mb-3 text-gradient-bio">Business Sectors</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary">
              <li><i className="bi bi-chevron-right me-1 text-success small"></i> Bio-Stimulants & Seeds</li>
              <li><i className="bi bi-chevron-right me-1 text-success small"></i> Cold-Dehydrated Products</li>
              <li><i className="bi bi-chevron-right me-1 text-success small"></i> Ayurvedic Wellness Extracts</li>
              <li><i className="bi bi-chevron-right me-1 text-success small"></i> Waste Upcycling (Coir Pots)</li>
              <li><i className="bi bi-chevron-right me-1 text-success small"></i> Multi-National Cargo Supply</li>
            </ul>
          </div>

          {/* Address */}
          <div className="col-lg-3 col-md-6">
            <h5 className="science-font fs-6 mb-3 text-gradient-bio">Trade Offices</h5>
            {offices.map((office) => (
              <div key={office._id} className="mb-3">
                <div className="fw-semibold text-light small mb-1">{office.title}</div>
                <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary mb-0">
                  <li className="d-flex align-items-start gap-2">
                    <i className="bi bi-geo-alt-fill text-success mt-1"></i>
                    <span>{office.address}</span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <i className="bi bi-telephone-fill text-success"></i>
                    <span>{office.phone}</span>
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <i className="bi bi-envelope-at-fill text-success"></i>
                    <span>{office.email}</span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>

        <hr className="my-4 border-secondary border-opacity-25" />

        <div className="row small text-secondary">
          <div className="col-md-6 text-center text-md-start">
            <p>&copy; {new Date().getFullYear()} Basundhara Bio-Tech Private Limited. All Rights Reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <a href="#" className="text-secondary text-decoration-none me-3 hover-text-success">Privacy Policy</a>
            <a href="#" className="text-secondary text-decoration-none hover-text-success">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
