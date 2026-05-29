import { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, theme, toggleTheme } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
      setCartCount(count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cart-updated', updateCartCount);
    return () => {
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-xl sticky-top glass-nav navbar-light py-2">
      <div className="container-fluid px-3 px-xl-4">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="science-font fw-bold fs-4 text-gradient-bio">BASUNDHARA</span><span className="science-font fw-light fs-4 text-secondary ms-1">BIO-TECH</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-3 mb-xl-0 align-items-center">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-success' : ''}`} to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-success' : ''}`} to="/about">About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-success' : ''}`} to="/categories">Categories</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-success' : ''}`} to="/products">Products</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-success' : ''}`} to="/research">Research</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-success' : ''}`} to="/sustainability">Sustainability</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-success' : ''}`} to="/importexport">Import-Export</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-success' : ''}`} to="/gallery">Gallery</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-success' : ''}`} to="/blog">Blog</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-success' : ''}`} to="/contact">Contact</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link fw-semibold d-flex align-items-center ${isActive ? 'text-success' : ''}`} to="/cart">
                <i className="bi bi-cart3 me-1"></i> Cart
                {cartCount > 0 && <span className="badge bg-danger ms-1 rounded-pill">{cartCount}</span>}
              </NavLink>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link fw-bold text-primary ${isActive ? 'text-decoration-underline' : ''}`} to="/admin"><i className="bi bi-shield-lock-fill me-1"></i>Admin</NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3 justify-content-center mt-3 mt-xl-0">
            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-outline-secondary border-0 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px' }}
              title="Toggle Scientific Theme Color"
            >
              {theme === 'light' ? (
                <i className="bi bi-moon-stars-fill fs-5 text-indigo"></i>
              ) : (
                <i className="bi bi-sun-fill fs-5 text-warning"></i>
              )}
            </button>

            {/* Auth Actions */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-success dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-2"></i>{(user?.name || 'User').split(' ')[0]}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="userDropdown">
                  <li>
                    <span className="dropdown-item-text text-muted small">Role: {(user?.role || 'user').toUpperCase()}</span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item text-danger d-flex align-items-center" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-science-secondary px-3 btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-science-primary px-3 btn-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
