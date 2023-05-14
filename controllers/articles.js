import { Article } from "../models/article.js"
import { Profile } from "../models/profile.js"


async function create(req,res) {
  try {
    const apiResponse = await fetch(`https://newsdata.io/api/1/news?apikey=${process.env.NEWS_API_KEY}&language=en`)
    console.log("api response: ", apiResponse);
    const articleData = await apiResponse.json()
    console.log('articleData ', apiResponse);
    const articles = await Article.create(articleData.results.filter((article, idx) => idx < 20))
    res.status(200).json(articles)
  } catch (error) {
    console.log(error);
    res.json(error)
  }
}

async function index(req,res) {
  try {
    //first check to see if any articles exist that were created with recent mongodb timestamp
    const sixteenHoursAgo = new Date()
    sixteenHoursAgo.setHours(sixteenHoursAgo.getHours() - 16)
  
    const articles = await Article.find({ createdAt: { $gte: sixteenHoursAgo} })
      articles.length >= 10
      //if yes, 
        /// are there at least 100 (10 for testing)?  if yes, index
        ? res.status(200).json(articles)
        //if no call create
        : create(req, res)
      } 
  catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function show(req, res) {
  try {
    const article = await Article.findById(req.params.articleId)
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
    console.log(newComment);
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
    const xxxx = await 
    res.status.json(article)
  } catch(err) {
    console.log(err)
    res.status(500).json(err)
  }
}
async function deleteComment(req, res) {
  try {
    const xxxx = await 
    res.status.json(article)
  } catch(err) {
    console.log(err)
    res.status(500).json(err)
  }
}


export {
  index,
  create,
  show,
  createComment,
  updateComment,
  deleteComment,
}