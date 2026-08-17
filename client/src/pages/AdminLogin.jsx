import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, user, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Load remembered credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedAdminEmail');
    const savedPassword = localStorage.getItem('rememberedAdminPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // If already logged in as admin, redirect to admin dashboard
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      }
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both admin email and passcode.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      // Handle Remember Me persistence
      if (rememberMe) {
        localStorage.setItem('rememberedAdminEmail', email);
        localStorage.setItem('rememberedAdminPassword', password);
      } else {
        localStorage.removeItem('rememberedAdminEmail');
        localStorage.removeItem('rememberedAdminPassword');
      }

      // Verify admin role
      const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (currentUser?.role !== 'admin') {
        logout();
        setErrorMsg('Access Denied: Administrator clearance required for this portal.');
      } else {
        navigate('/admin');
      }
    } else {
      setErrorMsg(result.message || 'Invalid administrator credentials.');
    }
  };

  return (
    <div className="admin-login-container py-5 d-flex align-items-center bg-dark text-light" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8 text-start">
            <div className="card glass-card bg-dark text-white p-4 border border-secondary border-opacity-25 shadow-lg" style={{ borderRadius: '16px' }}>
              
              {/* Header Badge & Title */}
              <div className="text-center mb-4">
                <div className="btn-science-primary text-white rounded-circle p-3 d-inline-flex justify-content-center align-items-center mb-3 shadow" style={{ width: '56px', height: '56px' }}>
                  <i className="bi bi-shield-lock-fill fs-3"></i>
                </div>
                <h3 className="science-font fw-bold text-gradient-bio mb-1">Restricted Admin Access</h3>
                <p className="small fw-medium mb-0" style={{ color: '#CBD5E1' }}>
                  Basundhara Bio-Tech Security Clearance Required
                </p>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="alert alert-danger border-0 d-flex align-items-center small py-2.5 shadow-sm mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                  <div>{errorMsg}</div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="adminEmail" className="form-label small fw-bold text-light">Admin ID / Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-light">
                      <i className="bi bi-person-badge"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control bg-dark text-white border-secondary"
                      id="adminEmail"
                      placeholder="basundharabiotech@gmail.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="adminPassword" className="form-label small fw-bold text-light">Passcode</label>
                  <div className="input-group">
                    <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-light">
                      <i className="bi bi-key-fill"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control bg-dark text-white border-secondary"
                      id="adminPassword"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                      required
                    />
                    <button 
                      className="btn btn-outline-secondary border-secondary text-light" 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="form-check text-start mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMeCheck"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label className="form-check-label small text-light fw-medium" htmlFor="rememberMeCheck" style={{ cursor: 'pointer' }}>
                    Remember me on this device
                  </label>
                </div>

                {/* Action Button */}
                <button
                  type="submit"
                  className="btn btn-science-primary w-100 py-2.5 fw-bold d-flex align-items-center justify-content-center shadow-sm"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Authenticating Clearance...
                    </>
                  ) : (
                    <>
                      Authenticate & Access Portal <i className="bi bi-shield-check ms-2 fs-5"></i>
                    </>
                  )}
                </button>
              </form>

              {/* Security Footer Notice */}
              <div className="mt-4 p-3 bg-secondary bg-opacity-20 border border-secondary border-opacity-25 rounded text-center" style={{ fontSize: '11.5px', color: '#CBD5E1' }}>
                <i className="bi bi-info-circle me-1 text-primary"></i> Unauthorized access attempts are monitored and logged.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
