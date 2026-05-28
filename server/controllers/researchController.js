const Research = require('../models/Research');

// @desc    Get all research papers (with search, category and pagination)
// @route   GET /api/research
// @access  Public
const getResearch = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const query = {};

    // Search query
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { abstract: { $regex: req.query.search, $options: 'i' } },
        { authors: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    const total = await Research.countDocuments(query);
    const research = await Research.find(query)
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: research,
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

// @desc    Get single research article by id
// @route   GET /api/research/:id
// @access  Public
const getResearchById = async (req, res, next) => {
  try {
    const paper = await Research.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Research publication not found' });
    }

    res.json({ success: true, data: paper });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new research article
// @route   POST /api/research
// @access  Private/Admin
const createResearch = async (req, res, next) => {
  try {
    const { title, abstract, authors, journal, publishDate, doi, pdfUrl, category } = req.body;

    const paper = new Research({
      title,
      abstract,
      authors,
      journal,
      publishDate,
      doi,
      pdfUrl,
      category,
    });

    const createdPaper = await paper.save();
    res.status(201).json({ success: true, data: createdPaper });
  } catch (error) {
    next(error);
  }
};

// @desc    Update research article
// @route   PUT /api/research/:id
// @access  Private/Admin
const updateResearch = async (req, res, next) => {
  try {
    const { title, abstract, authors, journal, publishDate, doi, pdfUrl, category } = req.body;

    const paper = await Research.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Research publication not found' });
    }

    paper.title = title !== undefined ? title : paper.title;
    paper.abstract = abstract !== undefined ? abstract : paper.abstract;
    paper.authors = authors !== undefined ? authors : paper.authors;
    paper.journal = journal !== undefined ? journal : paper.journal;
    paper.publishDate = publishDate !== undefined ? publishDate : paper.publishDate;
    paper.doi = doi !== undefined ? doi : paper.doi;
    paper.pdfUrl = pdfUrl !== undefined ? pdfUrl : paper.pdfUrl;
    paper.category = category !== undefined ? category : paper.category;

    const updatedPaper = await paper.save();
    res.json({ success: true, data: updatedPaper });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete research article
// @route   DELETE /api/research/:id
// @access  Private/Admin
const deleteResearch = async (req, res, next) => {
  try {
    const paper = await Research.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Research publication not found' });
    }

    await Research.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Research publication removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResearch,
  getResearchById,
  createResearch,
  updateResearch,
  deleteResearch,
};
