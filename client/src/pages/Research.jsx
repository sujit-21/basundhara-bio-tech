import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Research = () => {
  const { isAdmin } = useContext(AuthContext);

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Collapsed abstract tracker
  const [expandedPaper, setExpandedPaper] = useState(null);

  // CRUD state
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [researchForm, setResearchForm] = useState({
    title: '',
    abstract: '',
    authors: '',
    journal: 'Basundhara Scientific Review',
    publishDate: new Date().toISOString().split('T')[0],
    doi: '',
    pdfUrl: '/sample_research.pdf',
    category: 'Molecular Biology',
  });

  const categories = [
    'Molecular Biology',
    'AI Diagnostics',
    'Cancer Immunotherapy',
    'Biofuels & Sustainability',
    'Gene Editing & CRISPR',
  ];

  const fetchResearch = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (category) queryParams.append('category', category);
      queryParams.append('page', page);
      queryParams.append('limit', 4); // Show 4 papers per page

      const response = await api.get(`/research?${queryParams.toString()}`);
      if (response.data.success) {
        setPapers(response.data.data);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (err) {
      setError('Failed to fetch research articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearch();
  }, [search, category, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // reset to page 1 on search
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat === category ? '' : cat); // toggle category
    setPage(1); // reset
  };

  const toggleAbstract = (id) => {
    setExpandedPaper(expandedPaper === id ? null : id);
  };

  const handleDownload = (paperTitle) => {
    alert(`Initiating secure simulated PDF download for: "${paperTitle}"\nIn a production environment, this triggers a direct file download stream.`);
  };

  // CRUD API Handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/research/${currentItem._id}`, researchForm);
        alert('Research publication successfully updated.');
      } else {
        await api.post('/research', researchForm);
        alert('Research publication registered successfully.');
      }
      setShowForm(false);
      fetchResearch();
    } catch (err) {
      alert(err.response?.data?.message || 'Research action failed.');
    }
  };

  const openAddForm = () => {
    setIsEditMode(false);
    setCurrentItem(null);
    setResearchForm({
      title: '',
      abstract: '',
      authors: 'Roy, B.',
      journal: 'Basundhara Scientific Review',
      publishDate: new Date().toISOString().split('T')[0],
      doi: '',
      pdfUrl: '/sample_research.pdf',
      category: category || 'Molecular Biology',
    });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setResearchForm({
      title: item.title,
      abstract: item.abstract,
      authors: item.authors,
      journal: item.journal,
      publishDate: item.publishDate ? item.publishDate.split('T')[0] : '',
      doi: item.doi || '',
      pdfUrl: item.pdfUrl || '#',
      category: item.category,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this publication permanently?')) return;
    try {
      const res = await api.delete(`/research/${id}`);
      if (res.data.success) {
        alert('Publication successfully removed.');
        // Adjust page if we deleted the last item on this page
        if (papers.length === 1 && page > 1) {
          setPage(prevPage => prevPage - 1);
        } else {
          fetchResearch();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete publication.');
    }
  };

  return (
    <div className="research-container py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill science-font mb-2">Scientific Literature</span>
          <h1 className="science-font fw-bold text-gradient-bio">Publications & Innovations</h1>
          <p className="text-muted" style={{ maxWidth: '750px', margin: '0 auto' }}>
            Browse peer-reviewed manuscripts, patents, and technical protocols generated by our research divisions.
          </p>
        </div>

        {/* Filter Layout */}
        <div className="row g-4 mb-5">
          {/* Sidebar Filters */}
          <div className="col-lg-3">
            <div className="card glass-card p-4 border border-secondary border-opacity-10 sticky-top" style={{ top: '80px', zIndex: 5 }}>
              <h5 className="science-font fs-6 fw-bold mb-3"><i className="bi bi-funnel-fill me-2 text-success"></i>Categories</h5>
              <div className="d-flex flex-column gap-2">
                <button
                  onClick={() => { setCategory(''); setPage(1); }}
                  className={`btn btn-sm text-start py-2 px-3 rounded ${!category ? 'btn-success text-white' : 'btn-light border border-secondary border-opacity-10 text-dark'}`}
                >
                  All Research
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`btn btn-sm text-start py-2 px-3 rounded ${category === cat ? 'btn-success text-white' : 'btn-light border border-secondary border-opacity-10 text-dark'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Paper Listings */}
          <div className="col-lg-9 text-start">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
              {/* Search inputs */}
              <div className="input-group shadow-sm flex-grow-1" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0 py-2.5"
                  placeholder="Search publications, DOI records, authors..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
              {isAdmin && (
                <button onClick={openAddForm} className="btn btn-success d-flex align-items-center science-font fw-semibold py-2.5">
                  <i className="bi bi-plus-circle me-2"></i>New Publication
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Scanning archives...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : papers.length === 0 ? (
              <div className="card glass-card text-center py-5">
                <i className="bi bi-file-earmark-lock-fill text-muted fs-1 mb-3"></i>
                <h4 className="science-font text-dark">No publications found</h4>
                <p className="text-muted">Adjust filters or search parameters to view other biological resources.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {papers.map((paper) => (
                  <div className="card glass-card p-4 border border-secondary border-opacity-10" key={paper._id}>
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 g-2">
                      <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill science-font small">
                        {paper.category}
                      </span>
                      <span className="text-muted small">
                        <i className="bi bi-calendar-event me-1"></i> {new Date(paper.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>

                    <h4 className="fw-bold text-dark fs-5 mb-2">{paper.title}</h4>
                    <p className="text-muted small mb-3">
                      <i className="bi bi-people-fill me-1"></i> <strong>Authors:</strong> {paper.authors} | <strong>Journal:</strong> {paper.journal}
                    </p>

                    {/* Collapsible Abstract */}
                    <div className="mb-3">
                      <button
                        onClick={() => toggleAbstract(paper._id)}
                        className="btn btn-link text-success p-0 text-decoration-none small fw-bold d-flex align-items-center"
                      >
                        {expandedPaper === paper._id ? 'Hide Abstract' : 'View Abstract'}
                        <i className={`bi ${expandedPaper === paper._id ? 'bi-chevron-up' : 'bi-chevron-down'} ms-1`}></i>
                      </button>
                      
                      {expandedPaper === paper._id && (
                        <div className="mt-3 p-3 bg-light rounded border-start border-success border-3 text-secondary small lh-lg">
                          <strong>Abstract:</strong> {paper.abstract}
                        </div>
                      )}
                    </div>

                    <div className="d-flex flex-wrap justify-content-between align-items-center border-top pt-3 g-2">
                      <span className="text-muted small">
                        <strong>DOI:</strong> <span className="font-monospace text-secondary">{paper.doi || 'N/A'}</span>
                      </span>
                      <div className="d-flex gap-2">
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => openEditForm(paper)}
                              className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                            >
                              <i className="bi bi-pencil-square me-1"></i> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(paper._id)}
                              className="btn btn-sm btn-outline-danger d-flex align-items-center"
                            >
                              <i className="bi bi-trash me-1"></i> Delete
                            </button>
                          </>
                        )}
                        <a
                          href={paper.pdfUrl && paper.pdfUrl !== '#' ? paper.pdfUrl : undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary d-flex align-items-center"
                          onClick={(e) => {
                            if (!paper.pdfUrl || paper.pdfUrl === '#') {
                              e.preventDefault();
                              alert(`No PDF file has been uploaded for "${paper.title}" yet.`);
                            }
                          }}
                        >
                          <i className="bi bi-file-earmark-arrow-down-fill me-1"></i> Download PDF
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <nav className="d-flex justify-content-center mt-4">
                    <ul className="pagination">
                      <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>
                          &laquo; Previous
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setPage(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                          Next &raquo;
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* React State-Controlled Modal Backdrop & Dialog for CRUD */}
      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content glass-card border border-secondary border-opacity-25" style={{ background: 'rgba(255, 255, 255, 0.96)', borderRadius: '16px' }}>
              <div className="modal-header border-bottom border-secondary border-opacity-10 px-4 py-3">
                <h5 className="modal-title science-font fw-bold text-success fs-5">
                  {isEditMode ? 'Modify Paper Metadata' : 'Register New Research Paper'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body text-start px-4 py-3">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark">Paper Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={researchForm.title}
                      onChange={e => setResearchForm({ ...researchForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark">Authors (e.g. Roy, B., Patel, M.)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={researchForm.authors}
                        onChange={e => setResearchForm({ ...researchForm, authors: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark">Category</label>
                      <select
                        className="form-select"
                        value={researchForm.category}
                        onChange={e => setResearchForm({ ...researchForm, category: e.target.value })}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark">Journal Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={researchForm.journal}
                        onChange={e => setResearchForm({ ...researchForm, journal: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark">Publish Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={researchForm.publishDate}
                        onChange={e => setResearchForm({ ...researchForm, publishDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark">DOI Link String</label>
                      <input
                        type="text"
                        className="form-control"
                        value={researchForm.doi}
                        onChange={e => setResearchForm({ ...researchForm, doi: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-dark">PDF Access URL</label>
                      <input
                        type="text"
                        className="form-control"
                        value={researchForm.pdfUrl}
                        onChange={e => setResearchForm({ ...researchForm, pdfUrl: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label small fw-bold text-dark">Manuscript Abstract</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      value={researchForm.abstract}
                      onChange={e => setResearchForm({ ...researchForm, abstract: e.target.value })}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top border-secondary border-opacity-10 px-4 py-3">
                  <button type="button" className="btn btn-secondary px-3" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success px-4">Save Publication</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Research;
