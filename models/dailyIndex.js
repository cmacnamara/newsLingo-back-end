import mongoose from "mongoose"

const Schema = mongoose.Schema

const dailyIndexSchema = new Schema(
  {
    todaysNews: {
      type: Object
    },
    todaysNewsArr: [{type: Schema.Types.ObjectId, ref: 'Article'}],
  },
  { timestamps: true }
)

const DailyIndex = mongoose.model('DailyIndex', dailyIndexSchema)

export { DailyIndex }