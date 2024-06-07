import mongoose from "mongoose"

const Schema = mongoose.Schema

const dailyIndexSchema = new Schema(
  {
    articleIds: {
      type: Array
    }
  },
  { timestamps: true }
)

const DailyIndex = mongoose.model('DailyIndex', dailyIndexSchema)

export { DailyIndex }