import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Load remembered credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please input both email and password.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="login-container py-5 d-flex align-items-center" style={{ minHeight: '75vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8 text-start">
            <div className="card glass-card p-4 border border-secondary border-opacity-10 shadow-lg">
              <div className="text-center mb-4">
                <div className="bg-success text-white rounded-circle p-2 d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-shield-lock-fill fs-4"></i>
                </div>
                <h2 className="science-font fw-bold text-gradient-bio">Secure Login</h2>
                <p className="text-muted small">Enter credentials to access Basundhara platforms</p>
              </div>

              {errorMsg && (
                <div className="alert alert-danger d-flex align-items-center small py-2.5 shadow-sm" role="alert">
                  <i className="bi bi-exclamation-octagon-fill me-2"></i>
                  <div>{errorMsg}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label small fw-bold text-secondary">User Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><i className="bi bi-envelope"></i></span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="name@basundharabiotech.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label small fw-bold text-secondary">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><i className="bi bi-key"></i></span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                      required
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="mb-4 form-check text-start">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label small text-muted" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-science-primary w-100 py-2.5 d-flex align-items-center justify-content-center"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Verifying Node...
                    </>
                  ) : (
                    <>
                      Login <i className="bi bi-box-arrow-in-right ms-2"></i>
                    </>
                  )}
                </button>
              </form>

              <hr className="my-4 text-secondary opacity-25" />

              <div className="text-center small">
                <span className="text-muted">New researcher? </span>
                <Link to="/register" className="text-success fw-bold text-decoration-none">Create an Account</Link>
              </div>

              {/* Seed note details */}
              <div className="mt-4 p-3 bg-light rounded text-secondary" style={{ fontSize: '11px' }}>
                <strong>Demo Credentials:</strong><br />
                • Admin: <span className="font-monospace">admin@basundharabiotech.com</span> / <span className="font-monospace">admin12345</span><br />
                • User: <span className="font-monospace">user@basundharabiotech.com</span> / <span className="font-monospace">user12345</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
