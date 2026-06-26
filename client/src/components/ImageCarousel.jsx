import { useState } from 'react';

const ImageCarousel = ({ images, altText, height = '150px' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="rounded overflow-hidden position-relative" style={{ height, marginBottom: '1rem' }}>
        <img 
          src={images[0]} 
          alt={altText} 
          className="w-100 h-100 object-fit-cover hover-zoom" 
          style={{ transition: 'transform 0.3s ease' }} 
        />
      </div>
    );
  }

  const nextSlide = (e) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="rounded overflow-hidden position-relative" style={{ height, marginBottom: '1rem' }}>
      <img 
        src={images[currentIndex]} 
        alt={`${altText} - slide ${currentIndex + 1}`} 
        className="w-100 h-100 object-fit-cover hover-zoom" 
        style={{ transition: 'transform 0.3s ease' }} 
      />
      
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
            className={`rounded-circle ${idx === currentIndex ? 'bg-success' : 'bg-light'}`}
            style={{ width: '8px', height: '8px', cursor: 'pointer', opacity: idx === currentIndex ? 1 : 0.6 }}
            onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
