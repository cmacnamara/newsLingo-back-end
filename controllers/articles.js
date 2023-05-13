import { Article } from "../models/article.js";


async function create(req,res) {
  try {
    const apiResponse = await fetch(`https://newsdata.io/api/1/news?apikey=${process.env.NEWS_API_KEY}&language=en`)
    const articleData = await apiResponse.json()
    const articles = await Article.create(articleData.results.filter((article, idx) => idx < 10))
    console.log(articles);
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

// all new below this point

async function show(req, res) {
  try {
    const article = await Article.findById(req.params.articleId)
      //.populate('comments.author') 
    res.status(200).json(article)
  } catch(err) {
    console.log(err)
    res.status(500).json(err)
  }
}
async function update(req, res) {
  try {
    const xxxx = await 
    res.status.json(article)
  } catch(err) {
    console.log(err)
    res.status(500).json(err)
  }
}
async function createComment(req, res) {
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
async function createFavoriteWord(req, res) {
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
}