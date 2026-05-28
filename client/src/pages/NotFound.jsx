import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="d-flex align-items-center justify-content-center bg-gradient-science text-white" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="glass-card p-5 border border-secondary border-opacity-20 shadow-lg text-start">
              <div className="d-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle p-3 mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-radioactive fs-1 animate-pulse"></i>
              </div>
              <h1 className="science-font fw-bold text-center mb-2 text-gradient-bio">ERROR: 404</h1>
              <h4 className="science-font fw-light text-center text-secondary mb-4">CELL_PATHWAY_NOT_RESOLVED</h4>
              
              <p className="text-secondary small lh-lg mb-4 text-center">
                The molecular biological address you requested does not exist in our sequencing catalogs. The target sequence may have mutated or been deleted from our database nodes.
              </p>

              <div className="d-flex justify-content-center">
                <Link to="/" className="btn btn-science-primary btn-sm px-4">
                  <i className="bi bi-house-door-fill me-2"></i> Re-Route to Base Lab (Home)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
