const User = require('../models/User');
const Law = require('../models/Law');

// @desc    Toggle Bookmark (Save / Remove from savedLaws)
// @route   POST /api/users/bookmark/:lawId
// @access  Private (LoggedIn Users)
exports.toggleBookmark = async (req, res) => {
  try {
    const lawId = req.params.lawId;
    const user = await User.findById(req.user._id);

    // Check garne kanoon pahile nai save cha ki nai
    const isBookmarked = user.savedLaws.includes(lawId);

    if (isBookmarked) {
      // Save cha bhane remove garne (Unbookmark)
      user.savedLaws = user.savedLaws.filter(id => id.toString() !== lawId);
      await user.save();
      return res.json({ message: 'Law removed from bookmarks', bookmarked: false });
    } else {
      // Save chaina bhane add garne (Bookmark)
      user.savedLaws.push(lawId);
      await user.save();
      return res.json({ message: 'Law bookmarked successfully', bookmarked: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's bookmarked laws
// @route   GET /api/users/bookmarks
// @access  Private
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedLaws',
      select: 'title slug category summary createdAt views',
    });

    res.json(user.savedLaws);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin Dashboard ko lagi)
// @route   GET /api/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update User Role (Citizen bata Editor ya Admin banauna)
// @route   PUT /api/users/:id/role
// @access  Private (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role || user.role;
    await user.save();

    res.json({ message: `User role updated to ${user.role}`, user: { _id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};