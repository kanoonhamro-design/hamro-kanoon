const express = require('express');
const router = express.Router();
const { 
  toggleBookmark, 
  getBookmarks, 
  getAllUsers, 
  updateUserRole 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

// ==========================================
// USER BOOKMARK ROUTES (Any Logged-in User)
// ==========================================

// @route   POST /api/users/bookmark/:lawId
// @desc    Kanoon save ya unsave (bookmark/unbookmark) garne
// @access  Private (Citizen, Editor, Admin sabai le paune)
router.post('/bookmark/:lawId', protect, toggleBookmark);

// @route   GET /api/users/bookmarks
// @desc    User le save gareko sabai kanoon haru herne
// @access  Private
router.get('/bookmarks', protect, getBookmarks);

// ==========================================
// ADMIN DASHBOARD ROUTES (Admin Only)
// ==========================================

// @route   GET /api/users
// @desc    System ko sabai users ko list nikalne
// @access  Private (Admin Only)
router.get('/', protect, isAdmin, getAllUsers);

// @route   PUT /api/users/:id/role
// @desc    User ko role update garne (Citizen bata Editor ya Admin banaune)
// @access  Private (Admin Only)
router.put('/:id/role', protect, isAdmin, updateUserRole);

module.exports = router;