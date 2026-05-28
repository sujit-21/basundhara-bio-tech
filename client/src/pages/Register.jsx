import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

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

    // Basic Validations
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please populate all fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const result = await register(name, email, password);
    setSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="register-container py-5 d-flex align-items-center" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8 text-start">
            <div className="card glass-card p-4 border border-secondary border-opacity-10 shadow-lg">
              <div className="text-center mb-4">
                <div className="bg-success text-white rounded-circle p-2 d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-person-plus-fill fs-4"></i>
                </div>
                <h2 className="science-font fw-bold text-gradient-bio">Register Account</h2>
                <p className="text-muted small">Establish credentials for the Basundhara network</p>
              </div>

              {errorMsg && (
                <div className="alert alert-danger d-flex align-items-center small py-2.5 shadow-sm" role="alert">
                  <i className="bi bi-exclamation-octagon-fill me-2"></i>
                  <div>{errorMsg}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label small fw-bold text-secondary">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><i className="bi bi-person"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Dr. John Doe"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setErrorMsg(''); }}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label small fw-bold text-secondary">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><i className="bi bi-envelope"></i></span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="johndoe@institution.edu"
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
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label small fw-bold text-secondary">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><i className="bi bi-check-all"></i></span>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(''); }}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-science-primary w-100 py-2.5 d-flex align-items-center justify-content-center"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Registering Node...
                    </>
                  ) : (
                    <>
                      Create Account <i className="bi bi-person-check ms-2"></i>
                    </>
                  )}
                </button>
              </form>

              <hr className="my-4 text-secondary opacity-25" />

              <div className="text-center small">
                <span className="text-muted">Already registered? </span>
                <Link to="/login" className="text-success fw-bold text-decoration-none">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
