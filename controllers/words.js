import { Word } from "../models/word.js"
import { Profile } from "../models/profile.js"


async function create(req, res) {
  try {
    req.body.favoritor = req.user.profile //<------- need to reexamine this function together with the frontend desing to see how we take the word + translation into req.body.  populate a form in the Show Article sidebar with an undeditable inputs (1. from the article and 2. from the translation API?)  and make the favorite button a 'submit' form button?  
    const word = await Word.create(req.body)
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,   //need to add several field to the profile model before 'create word' function can be fully tested.  Waiting for Eunice's pull request to be approved before proceeding
      { $push: { dictionary: word }},
      { new: true }
    )
    word.favoritor = profile
    res.status(201).json(word)
  } catch(err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function index(req, res) {
  try {
    const words = await Word.find({})
      // .populate('favoritor') //do we want to add this to the word model?  need to track who favorited the word for any reason?
      .sort({ createdAt: 'desc' })
      res.status(200).json(words)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function show(req, res) {
  try {
    const word = await Word.findById(req.params.wordId)
    res.status(200).json(word)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function deleteWord(req, res) {
  try {
    const word = await Word.findByIdAndDelete(req.params.wordId) //do we want to protect this from deletion by unauthorized users?  or handle that on frontend only?
    const profile = await Profile.findById(req.user.profile)
    // profile.dictionary.remove({ _id: word._id }) //waiting to test this until pull request #5 is approved
    await profile.save()
    res.status(200).json(word)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

export {
  create,
  index,
  show,
  deleteWord as delete,
}