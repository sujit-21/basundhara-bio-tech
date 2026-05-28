const Blog = require('../models/Blog');

// @desc    Get all blogs (with optional pagination, tags, and search query)
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const query = {};
    
    // Only show published articles to normal users. 
    // Admins can see unpublished drafts if they specify req.query.all
    if (!req.query.all) {
      query.published = true;
    }

    // Search query
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Tag filter
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog article not found' });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res, next) => {
  try {
    const { title, content, author, tags, image, published } = req.body;

    const blog = new Blog({
      title,
      content,
      author,
      tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
      image,
      published,
    });

    const createdBlog = await blog.save();
    res.status(201).json({ success: true, data: createdBlog });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res, next) => {
  try {
    const { title, content, author, tags, image, published } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog.title = title !== undefined ? title : blog.title;
    blog.content = content !== undefined ? content : blog.content;
    blog.author = author !== undefined ? author : blog.author;
    if (tags !== undefined) {
      blog.tags = typeof tags === 'string' ? tags.split(',').map((tag) => tag.trim()) : tags;
    }
    blog.image = image !== undefined ? image : blog.image;
    blog.published = published !== undefined ? published : blog.published;

    const updatedBlog = await blog.save();
    res.json({ success: true, data: updatedBlog });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    await Blog.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Blog article removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};
