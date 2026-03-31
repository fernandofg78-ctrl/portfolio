import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    subject: { type: String, trim: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
    replied: { type: Boolean, default: false },
    ip: { type: String },                    // Para rate limiting manual si hace falta
  },
  { timestamps: true }
);

messageSchema.index({ read: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
