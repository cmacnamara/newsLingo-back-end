import mongoose from 'mongoose'

const Schema = mongoose.Schema

const wordSchema = new Schema(
  {
    word: {
      type: String,
      required: true,
    },
    translation: {
      type: [String],
      required: true,
      default: ['']
    },
    partOfSpeech: {
      type: [String],
      required: true,
      default: ['']
    },
  },
  { timestamps: true }
)

const Word = mongoose.model('Word', wordSchema)

export { Word }