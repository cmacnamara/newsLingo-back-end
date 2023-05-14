import mongoose from 'mongoose'

const Schema = mongoose.Schema

const profileSchema = new Schema({
  name: String,
  photo: String,
  preferredLanguage: {
    type: String,
    default: 'spanish',
    // required: true,
  },
  dictionary: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Word',
  }],
  favoriteArticles: [{
    type: Schema.Types.ObjectId,
    ref: "Article",
  }]
},{
  timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema)

export { Profile }
