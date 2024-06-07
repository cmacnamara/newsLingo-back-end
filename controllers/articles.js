import { Article } from "../models/article.js"
import { Profile } from "../models/profile.js"

import axios from "axios"

async function index(req,res) {
  try {
    const articles = await Article.find({ createdAt: { $lt: new Date("2023-11-23T00:00:00.000Z")} })
    .sort({ createdAt: 'desc' })
    res.status(200).json(articles)
  } 
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function show(req, res) {
  try {
    const article = await Article.findById(req.params.articleId)
    .populate(['comments.author'])
    res.status(200).json(article)
    
  } catch(err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function createComment(req, res) {
  try {
    req.body.author = req.user.profile
    
    const article = await Article.findById(req.params.articleId)
    article.comments.push(req.body) 
    await article.save()
    
    const newComment = article.comments[article.comments.length - 1]
    
    const profile = await Profile.findById(req.user.profile)
    newComment.author = profile
    res.status(201).json(newComment)
    
  } catch(err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function updateComment(req, res) {
  try {
    const article = await Article.findById(req.params.articleId)
    
    const comment = article.comments.id(req.params.commentId)
    comment.text = req.body.text
    await article.save()
    res.status(200).json(article)
    
  } catch(err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function deleteComment(req, res) {
  try {
    const article = await Article.findById(req.params.articleId)
    article.comments.remove({ _id: req.params.commentId})
    await article.save()
    res.status(200).json(article)
    
  } catch(err) {
    console.log(err)
    res.status(500).json(err)
    
  }
}

async function checkForValidImages(req, res) {
  let results = { validImages: 0, brokenImages: 0}
  let invalidURLs = []
  let nonImageURLs = []
  let updatedArticles = []
  async function removeArticleURL(articleId) {
    try {
      const article = await Article.findById(articleId)
      article.image_url = null
      article.save()
      updatedArticles.push(articleId)
    } catch (err) {
      console.log(err)
    }
  }
  try {
    const articles = await Article.find({ image_url: { $ne: null }})
    for(let article of articles) {
      try {
        const response = await axios.head(article.image_url)
        const contentType = response.headers['content-type']
        if(contentType.startsWith('image/')) {
          console.log(`${article._id} contains a valid image`)
          results['validImages']++ 
          console.log(results['validImages'])
        } else {
          console.log(`${article._id} contains a URL that does not return an image`)
          results['brokenImages']++
          nonImageURLs.push(article.image_url)
          removeArticleURL(article._id)
        }
      } catch (err) {
        console.log(`${article._id}: an error occured while checking that URL`)
        results['brokenImages']++
        invalidURLs.push(article.image_url)
        removeArticleURL(article._id)
      }
    }
    res.status(200).json({ results, invalidURLs, nonImageURLs, updatedArticles })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

export {
  index,
  show,
  createComment,
  updateComment,
  deleteComment,
  checkForValidImages,
}