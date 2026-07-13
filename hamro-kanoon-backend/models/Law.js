const mongoose = require('mongoose');

const LawSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Muluki Apradh Samhita, 2074 ko Dafa 47"
  slug: { type: String, required: true, unique: true }, // URL friendly: muluki-apradh-samhita-dafa-47
  category: { 
    type: String, 
    enum: ['Sanbidhan', 'Devani Kanoon', 'Faujdari Kanoon', 'Adalat ko Faisala', 'Legal News'],
    required: true 
  },
  summary: { type: String, required: true }, // Short NYT style excerpt for homepage
  content: { type: String, required: true }, // Full law text (HTML/Rich Text format)
  officialPdfUrl: { type: String }, // Nepal Rajpatra ko PDF link (Cloudinary)
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Editor who posted it
  tags: [{ type: String }], // e.g., ["Cyber Crime", "Arrest", "Bail"]
  isHeadline: { type: Boolean, default: false }, // NYT front page main story tag
  views: { type: Number, default: 0 }
}, { timestamps: true });

// Nepali aur English Full-Text Search ko lagi indexing
LawSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Law', LawSchema);