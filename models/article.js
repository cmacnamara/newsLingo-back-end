import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema(
  {
    text: {
      type: String
    },
    author: { type: Schema.Types.ObjectId, ref: 'Profile' }
  },
  { timestamps: true }
)

const articleSchema = new Schema(
  {
    title: {
      type: String
    },
    creator: {
      type: [String],
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    pubDate: { 
      type: String,
      default: '' 
    },
    category: { 
      type: [String],
      default: '' 
    },
    language: { 
      type: String,
      default: '' 
    },
    image_url: { 
      type: String,
      default: '' 
    },
    country: { 
      type: [String],
      default: '' 
    },
    comments: [commentSchema]
  },
  { timestamps: true }
)

const Article = mongoose.model('Article', articleSchema)

export { Article }