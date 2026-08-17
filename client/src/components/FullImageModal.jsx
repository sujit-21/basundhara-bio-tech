import React from 'react';

const FullImageModal = ({ show, imageUrl, title, onClose }) => {
  if (!show || !imageUrl) return null;

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(5, 10, 20, 0.88)', backdropFilter: 'blur(10px)', zIndex: 1090 }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-dialog-centered modal-xl"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing
      >
        <div className="modal-content bg-dark text-white border border-secondary border-opacity-25 shadow-lg overflow-hidden" style={{ borderRadius: '18px' }}>
          {/* Header */}
          <div className="modal-header border-bottom border-secondary border-opacity-25 py-3 px-4 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-zoom-in text-info fs-4"></i>
              <h5 className="modal-title science-font fw-bold text-gradient-bio mb-0">
                {title || 'Full Product Image Preview'}
              </h5>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Image Container */}
          <div className="modal-body p-3 text-center bg-black d-flex align-items-center justify-content-center position-relative" style={{ minHeight: '60vh', maxHeight: '78vh' }}>
            <img 
              src={imageUrl} 
              alt={title || 'Full Product Spec'} 
              className="img-fluid rounded shadow-lg object-fit-contain" 
              style={{ maxHeight: '74vh', maxWidth: '100%', transition: 'all 0.3s ease' }}
            />
          </div>

          {/* Footer */}
          <div className="modal-footer border-top border-secondary border-opacity-25 py-2.5 px-4 d-flex justify-content-end">
            <button 
              type="button" 
              className="btn btn-secondary btn-sm px-4 fw-semibold" 
              onClick={onClose}
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullImageModal;
