import { Article } from "../models/article.js"
import { Profile } from "../models/profile.js"

import axios from "axios"

// async function create(req,res) {
//   try {
//     let filteredArticles =[]
//     let nextPage=''
//     for (let i=0; i<10; i++){
//       const apiResponse = await fetch(`https://newsdata.io/api/1/news?apikey=${process.env.NEWS_API_KEY}&language=es${nextPage !== '' ? '&page=' + nextPage : ''}`)
//       const articleData = await apiResponse.json()
//       console.log("DATA", articleData);

//       //Filter response with only articles that have required data attributes: creator, image, content
//       const newArray= (articleData.results.filter(article => (
//         article.creator && article.content)
//       ))
//       filteredArticles= [...filteredArticles, ...newArray]
//       nextPage= articleData.nextPage
//     }

//     const articles = await Article.create(filteredArticles)
//     res.status(200).json(articles)

//   } catch (error) {
//     console.log(error);
//     res.json(error)
//   }
// }

async function index(req,res) {
  try {
    const articles = await Article.find({ createdAt: { $lt: new Date("2023-11-23T00:00:00.000Z")} })
    .sort({ createdAt: 'desc' })
    res.status(200).json(articles)
  } 
  catch (error) {
    console.log(error)
    res.status(500).json(error)
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
  async function isValidImageUrl(url, articleId) {
    try {
      const response = await axios.head(url)
      const contentType = response.headers['content-type']
      return contentType.startsWith('image/')
    } catch (err) {
      // console.log("An error occurred while checking the URL:", err)
      console.log("An error occurred while checking the URL:", articleId)
      return false
    }
  }
  try {
    //find all articles where imageURL is not null
    const articles = await Article.find({ image_url: { $ne: null }})
      // .sort({ createdAt: 'desc' })
      // res.status(200).json(articles)
      // console.log(articles)
    // const articleData = await articles.json()
    //create a loop to send an http request to each imageURL
    // articles.forEach(a => {
    //   console.log(a.image_url)
    // })

    async function getStatusAndUpdateDB() {
      //somehow we need our response to await the final tally of valid/invalid counts
      // const responseObject
      let validCount = 0
      let invalidCount = 0
      for(let article of articles) {
        try {
          const isValid = await isValidImageUrl(article.image_url, article._id)
          isValid ? validCount++ : invalidCount++
          console.log(`Article ID: ${article._id} contains a ${isValid ? 'valid' : 'broken'} image`)
        } catch (err) {
          // console.log("An error occurred while checking the URL: ", err)
          console.log("An error occurred while checking the URL: ", article._id)
        }
        // const imgStatus = await fetch(article.image_url)
        // console.log(imgStatus)
      }
      return {validCount, invalidCount}
    }
    getStatusAndUpdateDB()
    res.status(200).json({validCount, invalidCount})
    //
  } catch (err) {
    // console.log(err)
    console.log('an error occurred')
    res.status(500).json(err)
  }
}

export {
  index,
  // create,
  show,
  createComment,
  updateComment,
  deleteComment,
  checkForValidImages,
}

//database has 1400 articles with full content up until 2023-11-22 (pubdate & createdAt date)
