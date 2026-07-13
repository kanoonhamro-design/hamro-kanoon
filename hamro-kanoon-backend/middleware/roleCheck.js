const Law = require('../models/Law');

// 1. Admin matra ho ki nai check garne
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin privileges required.' });
  }
};

// 2. Editor ya Admin ho ki nai check garne (Law post garna ko lagi)
exports.isEditorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'editor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Editor or Admin privileges required.' });
  }
};

// 3. Advanced Check: Editor le AAPHNO post matra delete/update garna paune, Admin le SABAI ko paune
exports.canModifyLaw = async (req, res, next) => {
  try {
    const lawId = req.params.id;
    const law = await Law.findById(lawId);

    if (!law) {
      return res.status(404).json({ message: 'Law not found' });
    }

    // Yadi user Admin ho bhane sidhai allow garne
    if (req.user.role === 'admin') {
      return next();
    }

    // Yadi user Editor ho bhane, usle nai yo law post gareko ho ki nai check garne
    // Note: Law model ma 'author' field cha jasma user ko ID baseko huncha[cite: 8]
    if (req.user.role === 'editor' && law.author.toString() === req.user._id.toString()) {
      return next();
    }

    // Aaru kasailai paidaiana
    res.status(403).json({ message: 'You are not authorized to modify or delete this specific law.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};