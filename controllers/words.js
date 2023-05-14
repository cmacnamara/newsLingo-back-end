import { Word } from "../models/word.js"


async function create(req, res) {
  try {
    res.status(201).json(word)
  } catch {
    console.log(err)
    res.status(500).json(err)
  }
}

async function index(req, res) {
  try {
    const word = await Word.find({})
      // .populate('author')
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
      // .populate(['author', 'comments.author'])
    res.status(200).json(word)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function deleteWord(req, res) {
  try {
    const word = await Word.findByIdAndDelete(req.params.wordId)
    const profile = await Profile.findById(req.user.profile)
    profile.dictionary.remove({ _id: word._id })
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