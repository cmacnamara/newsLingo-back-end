import { Article } from "../models/article.js";


async function create(req,res) {
  try {
    const apiResponse = await fetch(`https://newsdata.io/api/1/news?apikey=${process.env.NEWS_API_KEY}&language=en`)
    const articleData = await apiResponse.json()
    // console.log(articleData);
    const articles = await Article.create(articleData.results.filter((article, idx) => idx < 10))
    console.log(articles);
    res.json(articleData)
  } catch (error) {
    console.log(error);
  }
}

async function index(req,res) {
  try {
    
  } catch (error) {
    console.log(error);
  }
}

export {
  index,
  create,
}