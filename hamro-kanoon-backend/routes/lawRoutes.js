const express = require('express');
const router = express.Router();
const { 
  createLaw, 
  getLaws, 
  getHeadlines, 
  getLawBySlug, 
  searchLaws, 
  deleteLaw 
} = require('../controllers/lawController');
const { protect } = require('../middleware/auth');
const { isEditorOrAdmin, canModifyLaw } = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

// ==========================================
// PUBLIC ROUTES (Sabai citizen le access paune)
// ==========================================
router.get('/', getLaws);
router.get('/headlines', getHeadlines);
router.get('/search', searchLaws);
router.get('/:slug', getLawBySlug);

// ==========================================
// PRIVATE ROUTES (Editor aur Admin ko lagi matra)
// ==========================================

// @route   POST /api/laws
// @desc    Naya kanoon ya article post garne (With PDF upload support)
// @access  Private (Editor & Admin Only)
router.post(
  '/', 
  protect, 
  isEditorOrAdmin, 
  upload.single('officialPdf'),
  createLaw
);

// @route   DELETE /api/laws/:id
// @desc    Kanoon delete garne (Admin le sabai paune, Editor le aaphno matra paune)
// @access  Private (Admin or Law Author)
router.delete(
  '/:id', 
  protect, 
  canModifyLaw, 
  deleteLaw
);

module.exports = router;