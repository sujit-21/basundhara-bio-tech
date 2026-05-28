import { useState, useEffect } from 'react';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
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
        console.error('Failed to load offices in contact page:', err);
      }
    };
    fetchOffices();
    return () => {
      isMounted = false;
    };
  }, []);

  const { name, email, subject, message } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side Validation
    if (!name || !email || !subject || !message) {
      setErrorMsg('Please populate all contact parameters.');
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please input a valid email address.');
      return;
    }

    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await api.post('/contacts', formData);
      if (response.data.success) {
        setSuccessMsg(response.data.message || 'Message forwarded successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to dispatch message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container py-5 text-start">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill science-font mb-2">Connect With Us</span>
          <h1 className="science-font fw-bold text-gradient-bio">Contact Our Laboratories</h1>
          <p className="text-muted" style={{ maxWidth: '700px', margin: '0 auto' }}>
            Have a partnership request or biological inquiry? Reach out to our technical coordinators.
          </p>
        </div>

        <div className="row g-5">
          {/* Coordinates column */}
          <div className="col-lg-5">
            <h3 className="science-font fw-bold text-dark fs-4 mb-4">Our Offices</h3>
            
            <div className="d-flex flex-column gap-5 mb-5">
              {offices.map((office) => (
                <div key={office._id} className="office-location-block pb-4 border-bottom border-secondary border-opacity-10">
                  <h4 className="science-font fw-bold text-success fs-5 mb-3">{office.title}</h4>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex gap-3">
                      <div className="bg-success bg-opacity-10 text-success rounded p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                        <i className="bi bi-geo-alt-fill fs-5"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1 small">Corporate Address</h6>
                        <p className="text-muted small mb-0">{office.address}</p>
                      </div>
                    </div>

                    <div className="d-flex gap-3">
                      <div className="bg-primary bg-opacity-10 text-primary rounded p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                        <i className="bi bi-telephone-fill fs-5"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1 small">Call Office</h6>
                        <p className="text-muted small mb-0">{office.phone}</p>
                      </div>
                    </div>

                    <div className="d-flex gap-3">
                      <div className="bg-success bg-opacity-10 text-success rounded p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                        <i className="bi bi-envelope-at-fill fs-5"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1 small">Email Correspondence</h6>
                        <p className="text-muted small mb-0">{office.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mock Map Preview Frame */}
            <div className="card border border-secondary border-opacity-10 p-2 overflow-hidden shadow-sm" style={{ background: '#f1f5f9', borderRadius: '16px', height: '220px' }}>
              <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-gradient-science text-white text-center rounded-3 p-3">
                <i className="bi bi-map-fill text-success fs-1 mb-2"></i>
                <h5 className="science-font fw-bold mb-1 small">Interactive Location Map</h5>
                <p className="text-secondary small mb-0">Salt Lake Sector V Tech Hub, West Bengal, India</p>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="col-lg-7">
            <div className="card glass-card p-4 border border-secondary border-opacity-10">
              <h3 className="science-font fw-bold text-dark fs-4 mb-4">Send A Message</h3>

              {successMsg && (
                <div className="alert alert-success d-flex align-items-center shadow-sm" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div>{successMsg}</div>
                </div>
              )}

              {errorMsg && (
                <div className="alert alert-danger d-flex align-items-center shadow-sm" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{errorMsg}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  {/* Name */}
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label small fw-bold text-secondary">Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Dr. John Doe"
                      value={name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* Email */}
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label small fw-bold text-secondary">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="johndoe@institution.edu"
                      value={email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* Subject */}
                  <div className="col-12">
                    <label htmlFor="subject" className="form-label small fw-bold text-secondary">Inquiry Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      name="subject"
                      placeholder="e.g. DNA sequencing partnership, drug docking consultation..."
                      value={subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* Message */}
                  <div className="col-12">
                    <label htmlFor="message" className="form-label small fw-bold text-secondary">Detailed Message</label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      rows="5"
                      placeholder="Please enter your request details..."
                      value={message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-science-primary w-100 py-2.5 d-flex align-items-center justify-content-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Securing Connection...
                        </>
                      ) : (
                        <>
                          Dispatch Message <i className="bi bi-send ms-2"></i>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
