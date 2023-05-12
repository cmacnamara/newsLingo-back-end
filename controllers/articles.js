import { Article } from "../models/article.js";

async function create(req,res) {
  try {
    const apiResponse = await fetch(`https://newsdata.io/api/1/news?apikey=pub_2194866bedaf40ef75320ad01a9fbe6bc84c0&language=es`)
    const articleData = await apiResponse.json()
    console.log(articleData);
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