import { useState } from 'react';
import FullImageModal from './FullImageModal';

const ImageCarousel = ({ images, altText, height = '160px' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');

  if (!images || images.length === 0) return null;

  const openZoom = (e, src) => {
    e.preventDefault();
    e.stopPropagation();
    setModalImageSrc(src);
    setShowFullImageModal(true);
  };

  const currentImg = images[currentIndex] || images[0];

  if (images.length === 1) {
    return (
      <>
        <div className="overflow-hidden position-relative group-hover-container shadow-sm mb-3" style={{ height, borderRadius: '14px', cursor: 'pointer' }}>
          <img 
            src={images[0]} 
            alt={altText} 
            className="w-100 h-100 object-fit-cover hover-zoom" 
            style={{ transition: 'transform 0.3s ease' }} 
            onClick={(e) => openZoom(e, images[0])}
          />
          {/* Zoom Floating Action Button */}
          <button 
            onClick={(e) => openZoom(e, images[0])}
            className="position-absolute top-0 end-0 m-2 btn btn-dark btn-sm rounded-circle bg-opacity-75 text-white border-0 shadow d-flex align-items-center justify-content-center"
            style={{ zIndex: 10, width: '30px', height: '30px', backdropFilter: 'blur(4px)' }}
            title="Click to view full image"
          >
            <i className="bi bi-zoom-in fs-6"></i>
          </button>
        </div>

        {/* Full Image Preview Modal */}
        <FullImageModal
          show={showFullImageModal}
          imageUrl={modalImageSrc}
          title={altText}
          onClose={() => setShowFullImageModal(false)}
        />
      </>
    );
  }

  const nextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      <div className="overflow-hidden position-relative group-hover-container shadow-sm mb-3" style={{ height, borderRadius: '14px', cursor: 'pointer' }}>
        <img 
          src={currentImg} 
          alt={`${altText} - slide ${currentIndex + 1}`} 
          className="w-100 h-100 object-fit-cover hover-zoom" 
          style={{ transition: 'transform 0.3s ease' }} 
          onClick={(e) => openZoom(e, currentImg)}
        />

        {/* Zoom Floating Action Button */}
        <button 
          onClick={(e) => openZoom(e, currentImg)}
          className="position-absolute top-0 end-0 m-2 btn btn-dark btn-sm rounded-circle bg-opacity-75 text-white border-0 shadow d-flex align-items-center justify-content-center"
          style={{ zIndex: 10, width: '32px', height: '32px', backdropFilter: 'blur(4px)' }}
          title="Click to view full image"
        >
          <i className="bi bi-zoom-in"></i>
        </button>
        
        {/* Controls */}
        <button 
          onClick={prevSlide}
          className="position-absolute top-50 start-0 translate-middle-y btn btn-sm btn-dark bg-opacity-50 text-white border-0 ms-1 rounded-circle d-flex align-items-center justify-content-center p-0"
          style={{ zIndex: 2, width: '28px', height: '28px' }}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <button 
          onClick={nextSlide}
          className="position-absolute top-50 end-0 translate-middle-y btn btn-sm btn-dark bg-opacity-50 text-white border-0 me-1 rounded-circle d-flex align-items-center justify-content-center p-0"
          style={{ zIndex: 2, width: '28px', height: '28px' }}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
        
        {/* Indicators */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-1 mb-2" style={{ zIndex: 2 }}>
          {images.map((_, idx) => (
            <div 
              key={idx} 
              className={`rounded-circle ${idx === currentIndex ? 'bg-primary' : 'bg-light'}`}
              style={{ width: '8px', height: '8px', cursor: 'pointer', opacity: idx === currentIndex ? 1 : 0.6 }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(idx); }}
            ></div>
          ))}
        </div>
      </div>

      {/* Full Image Preview Modal */}
      <FullImageModal
        show={showFullImageModal}
        imageUrl={modalImageSrc}
        title={`${altText} (Image ${currentIndex + 1} of ${images.length})`}
        onClose={() => setShowFullImageModal(false)}
      />
    </>
  );
};

export default ImageCarousel;
