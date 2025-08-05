import mongoose from 'mongoose';

const TemplateSchema = new mongoose.Schema({
  name: String,
  layout: String,
  placeholders: [
    {
      type: {
        type: String,
        required: true,
      },
      content: mongoose.Schema.Types.Mixed, // can be string or object or array
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Template', TemplateSchema);
