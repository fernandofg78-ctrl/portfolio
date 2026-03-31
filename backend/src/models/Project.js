import mongoose from 'mongoose';

/**
 * THEME KEYS — one per project, matches frontend ThemeContext
 * Each key maps to a full visual identity: colors, fonts, transitions, cursor behaviour
 */
const THEMES = [
  'default',
  'ahorcado',    // Ahorcado bilingüe — retro terminal, monocromo verde
  'mazarife',    // Mazarife.es — tierra, ocre, tipografía serif clásica
  'rfg',         // RFG Construcción — industrial, acero, sans-serif bold
  'nextapa',     // Nextapa — vibrante, neón, futurista
  'camino',      // CaminoSantiago.app — natural, pergamino, handwritten
  'portfolio',   // El propio portfolio — meta, oscuro, elegante
];

const projectSchema = new mongoose.Schema(
  {
    // ── Identity ────────────────────────────────────────────────────────────
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tagline: { type: String, required: true, trim: true }, // Una línea, la esencia
    description: { type: String, required: true },        // Markdown o HTML

    // ── Visual theme ────────────────────────────────────────────────────────
    theme: { type: String, enum: THEMES, default: 'default' },
    coverImage: { type: String },             // Cloudinary URL — imagen principal
    images: [{ type: String }],              // Cloudinary URLs adicionales
    youtubeId: { type: String },             // ID del vídeo de YouTube (si aplica)

    // ── Links ───────────────────────────────────────────────────────────────
    liveUrl: { type: String },
    githubUrl: { type: String },
    githubRepo: { type: String },            // "usuario/repo" para leer README

    // ── Tech stack ──────────────────────────────────────────────────────────
    stack: [{ type: String }],               // ["React", "Node", "MongoDB", ...]
    tags: [{ type: String }],                // ["fullstack", "web", "app", ...]

    // ── Display ─────────────────────────────────────────────────────────────
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },     // Orden manual en el grid
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },

    // ── Dates ───────────────────────────────────────────────────────────────
    startDate: { type: Date },
    endDate: { type: Date },                 // null = en curso
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtuals ─────────────────────────────────────────────────────────────────
projectSchema.virtual('isOngoing').get(function () {
  return !this.endDate;
});

// ── Indexes ──────────────────────────────────────────────────────────────────
projectSchema.index({ slug: 1 });
projectSchema.index({ status: 1, order: 1 });
projectSchema.index({ featured: 1 });

export default mongoose.model('Project', projectSchema);
