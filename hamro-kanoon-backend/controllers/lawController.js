const Law = require('../models/Law');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2; // Naya

exports.createLaw = asyncHandler(async (req, res) => {
  const { title, slug, category, summary, content, tags, isHeadline } = req.body;

  const slugExists = await Law.findOne({ slug });
  if (slugExists) {
    res.status(400);
    throw new Error('Slug already exists. Please use a unique URL slug.');
  }

  const officialPdfUrl = req.file ? req.file.path : null;

  const law = await Law.create({
    title, slug, category, summary, content, officialPdfUrl,
    author: req.user._id,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    isHeadline: isHeadline || false,
  });

  res.status(201).json(law);
});

exports.getLaws = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.category ? { category: req.query.category } : {};

  const count = await Law.countDocuments({ ...keyword });
  // .lean() le query fast garcha kinaki yesle Mongoose document ko satta plain JS object return garcha
  const laws = await Law.find({ ...keyword })
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .lean(); 

  res.json({ laws, page, pages: Math.ceil(count / pageSize) });
});

exports.getHeadlines = asyncHandler(async (req, res) => {
  const headlines = await Law.find({ isHeadline: true })
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean(); // Performance boost

  res.json(headlines);
});

exports.getLawBySlug = asyncHandler(async (req, res) => {
  const law = await Law.findOne({ slug: req.params.slug }).populate('author', 'name email');

  if (!law) {
    res.status(404);
    throw new Error('Law not found');
  }

  law.views += 1;
  await law.save();
  res.json(law);
});

exports.searchLaws = asyncHandler(async (req, res) => {
  const searchQuery = req.query.q;
  if (!searchQuery) {
    res.status(400);
    throw new Error('Please provide a search query');
  }

  const results = await Law.find(
    { $text: { $search: searchQuery } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(20)
    .lean();

  res.json(results);
});

exports.deleteLaw = asyncHandler(async (req, res) => {
  const law = await Law.findById(req.params.id);
  
  if (!law) {
    res.status(404);
    throw new Error('Law not found');
  }

  // Cloudinary bata PDF delete garne logic
  if (law.officialPdfUrl) {
    // URL bata public_id nikalne (e.g., https://res.cloudinary.com/.../upload/v1234/folder/filename.pdf)
    const urlParts = law.officialPdfUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = filename.split('.')[0]; 
    const folder = urlParts[urlParts.length - 2]; 
    
    // Yadi tapailay Cloudinary config ma folder set garnu bhayeko cha bhane:
    await cloudinary.uploader.destroy(`${folder}/${publicId}`); 
  }

  await law.deleteOne();
  res.json({ message: 'Law and associated files removed successfully' });
});