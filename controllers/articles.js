import { Article } from "../models/article.js"
import { Profile } from "../models/profile.js"
import { DailyIndex } from "../models/dailyIndex.js"

import axios from "axios"

async function index(req, res) {
  try {
    let articleIds 
    //check to see if a daily index exists for todays date
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)
    const dailyIndex = await DailyIndex.findOne({ createdAt: { $gte: startOfDay, $lt: endOfDay}
    })
    //if no dailyIndex exists create one by calling the createIndex helper function and store the articleIds
    if(!dailyIndex) {
      articleIds = await createDailyIndex()
    //if a dailyIndex already exists store the articleIds 
    } else {
      articleIds = dailyIndex.todaysNewsArr
    }
    //lookup full article document and respond with same
    const articles = await Article.find({ _id: { $in: articleIds } })
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
    article.comments.remove({ _id: req.params.commentId })
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
    const articles = await Article.find({ image_url: { $ne: null },
      createdAt: { $lt: new Date("2023-11-23T00:00:00.000Z")}
    })
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

// helper functions

async function createDailyIndex() {
  try {
    const articles = await Article.find({ image_url: { $ne: null },
      createdAt: { $lt: new Date("2023-11-23T00:00:00.000Z")}
    })
    //push all of article IDs to an object with category-specific arrays
    const categorizedArticles = {}
    const todaysNews = {}
    const todaysNewsArr = []
    articles.forEach(a => {
      categorizedArticles[a.category[0]] ? categorizedArticles[a.category[0]].push(a._id) : categorizedArticles[a.category[0]] = [a._id] 
    })
    //run a loop on each array to randomly select 4 articles IDs in categores with more than 4 articles
    for(let key in categorizedArticles) {
        if(categorizedArticles[key].length > 4) {
          todaysNews[key] = []
          while(todaysNews[key].length < 4) {
            const randomIdx = Math.floor(Math.random()*categorizedArticles[key].length)
            if(todaysNews[key].includes(categorizedArticles[key][randomIdx])) continue
            else {
              todaysNews[key].push(categorizedArticles[key][randomIdx])
              todaysNewsArr.push(categorizedArticles[key][randomIdx])
            }
          }
        }
      }
    //push those article IDs to a new resource called DailyIndex
    DailyIndex.create({ todaysNews, todaysNewsArr })
    return todaysNewsArr
  } catch (err) {
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