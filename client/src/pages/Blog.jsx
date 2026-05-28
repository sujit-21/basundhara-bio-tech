import { useEffect, useState } from 'react';
import api from '../services/api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Active Reader View
  const [activeBlog, setActiveBlog] = useState(null);

  // Aggregated Tags for sidebar
  const allTags = ['Dehydration', 'Food Processing', 'Agro-Tech', 'Recycling', 'Sustainability', 'Circular Economy', 'Organic', 'Spices', 'Supplements'];

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (tagFilter) queryParams.append('tag', tagFilter);
        queryParams.append('page', page);
        queryParams.append('limit', 6);

        const response = await api.get(`/blogs?${queryParams.toString()}`);
        if (response.data.success) {
          setBlogs(response.data.data);
          setTotalPages(response.data.pagination.pages);
        }
      } catch (err) {
        setError('Failed to fetch blog articles. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [search, tagFilter, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleTagSelect = (tag) => {
    setTagFilter(tag === tagFilter ? '' : tag);
    setPage(1);
  };

  if (activeBlog) {
    // Premium Detailed Blog Reader View
    return (
      <div className="blog-reader-container py-5 text-start">
        <div className="container">
          <button
            onClick={() => setActiveBlog(null)}
            className="btn btn-outline-secondary btn-sm mb-4 d-inline-flex align-items-center"
          >
            <i className="bi bi-arrow-left-short fs-5"></i> Back to Articles
          </button>
          
          <article className="max-w-4xl mx-auto" style={{ maxWidth: '850px', margin: '0 auto' }}>
            <img
              src={activeBlog.image}
              alt={activeBlog.title}
              className="img-fluid w-100 object-fit-cover mb-4 rounded-4 shadow"
              style={{ maxHeight: '420px' }}
            />
            
            <div className="d-flex flex-wrap gap-2 mb-3">
              {activeBlog.tags.map((tag) => (
                <span key={tag} className="badge bg-success bg-opacity-10 text-success rounded-pill science-font small">
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="science-font fw-bold text-dark display-5 mb-3">{activeBlog.title}</h1>
            
            <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-3 border border-secondary border-opacity-10">
              <div className="bg-success text-white rounded-circle p-2 d-flex justify-content-center align-items-center me-3" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-person-fill fs-4"></i>
              </div>
              <div>
                <h6 className="mb-0 fw-bold text-dark">{activeBlog.author}</h6>
                <small className="text-muted">Published: {new Date(activeBlog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</small>
              </div>
            </div>

            <div className="lh-lg text-secondary fs-6 mb-5" style={{ whiteSpace: 'pre-line' }}>
              {activeBlog.content}
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-container py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill science-font mb-2">Scientific Blog</span>
          <h1 className="science-font fw-bold text-gradient-bio">Insights & Research Logs</h1>
          <p className="text-muted" style={{ maxWidth: '700px', margin: '0 auto' }}>
            Discover updates on biotech breakthroughs, therapeutic advances, and scientific analysis from our laboratories.
          </p>
        </div>

        {/* Content Layout */}
        <div className="row g-4">
          {/* Main blogs grid */}
          <div className="col-lg-9 order-lg-1 order-2 text-start">
            {/* Search Input */}
            <div className="input-group mb-4 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
              <span className="input-group-text bg-white border-end-0 text-muted"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control border-start-0 ps-0 py-2.5"
                placeholder="Search publications, tech digests, write-ups..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status"></div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : blogs.length === 0 ? (
              <div className="card glass-card text-center py-5">
                <i className="bi bi-journal-x text-muted fs-1 mb-3"></i>
                <h4 className="science-font text-dark">No articles found</h4>
                <p className="text-muted">Try removing tag filters or searching other queries.</p>
              </div>
            ) : (
              <div>
                <div className="row g-4">
                  {blogs.map((blog) => (
                    <div className="col-md-6" key={blog._id}>
                      <div className="card glass-card h-100 border border-secondary border-opacity-10 overflow-hidden d-flex flex-column">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="card-img-top object-fit-cover"
                          style={{ height: '200px' }}
                        />
                        <div className="card-body p-4 d-flex flex-column">
                          <div className="d-flex gap-2 mb-2 flex-wrap">
                            {blog.tags.slice(0, 2).map((t) => (
                              <span key={t} className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill small science-font">
                                #{t}
                              </span>
                            ))}
                          </div>
                          <h4 className="science-font card-title fs-5 fw-bold text-dark mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '48px' }}>
                            {blog.title}
                          </h4>
                          <p className="card-text text-muted small mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {blog.content}
                          </p>
                          <button
                            onClick={() => setActiveBlog(blog)}
                            className="btn btn-outline-success mt-auto align-self-start btn-sm px-3"
                          >
                            Read Full Article <i className="bi bi-arrow-right ms-1"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <nav className="d-flex justify-content-center mt-5">
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

          {/* Sidebar tags panel */}
          <div className="col-lg-3 order-lg-2 order-1 text-start">
            <div className="card glass-card p-4 border border-secondary border-opacity-10 sticky-top" style={{ top: '80px', zIndex: 5 }}>
              <h5 className="science-font fs-6 fw-bold mb-3"><i className="bi bi-tags-fill me-2 text-success"></i>Popular Tags</h5>
              <div className="d-flex flex-wrap gap-2">
                <button
                  onClick={() => { setTagFilter(''); setPage(1); }}
                  className={`btn btn-xs px-2.5 py-1.5 rounded-pill small science-font ${!tagFilter ? 'btn-success text-white' : 'btn-light text-dark'}`}
                >
                  All Tags
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagSelect(tag)}
                    className={`btn btn-xs px-2.5 py-1.5 rounded-pill small science-font ${tagFilter === tag ? 'btn-success text-white' : 'btn-light text-dark'}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
