import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    author: { type: Schema.Types.ObjectId, ref: 'Profile' }
  },
  { timestamps: true }
)

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
      default: ''
    },
    content: {
      type: String,
      required: true,
      default: ''
    },
    date: { 
      type: String,
      required: true,
      default: '' 
    },
    category: { 
      type: String,
      required: true,
      default: '' 
    },
    language: { 
      type: String,
      required: true,
      default: '' 
    },
    image: { 
      type: String,
      required: true,
      default: '' 
    },
    comments: [commentSchema]
  },
  { timestamps: true }
)

const Article = mongoose.model('Article', articleSchema)

export { Article }