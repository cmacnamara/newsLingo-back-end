import { Word } from "../models/word.js"
import { Profile } from "../models/profile.js"

async function create(req, res) {
  try {
    req.body.favoritor = req.user.profile 
    const word = await Word.create(req.body)
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,
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
    const user = await Profile.findById(req.user.profile)
      .populate("dictionary")
    const dictionary = user.dictionary
    res.status(200).json(dictionary)
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
    const word = await Word.findByIdAndDelete(req.params.wordId) 
    const profile = await Profile.findById(req.user.profile)
    profile.dictionary.remove({ _id: word._id }) 
    await profile.save()
    res.status(200).json(word)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function getTranslations(req,res) {
  try {
    const apiResponse = await fetch(`https://www.dictionaryapi.com/api/v3/references/spanish/json/${req.query.query}?key=${process.env.TRANSLATION_API_KEY}`)
    const translationData = await apiResponse.json()
    return res.json(translationData)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

export {
  create,
  index,
  show,
  deleteWord as delete,
  getTranslations,
}