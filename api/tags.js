const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db')

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags;
  res.send({
    tags
  });
});

// tagsRouter.get('/:tagName/posts', async (req, res, next) => {
//   const { tagName } = req.params.tagName
  
//   try {
//    // if (tagName) {
//       const allPostTag = await getPostsByTagName(tagName)

//       if (req.user){
//         const userPosts = allPostTag.filter(post => {
//           return post.active && post.author.id === req.user.id
//         })
//         req.send({ userPosts})
//       } else {
//         const allTaggedPosts = postTag.filter(post => {
//           return post.active && post.author.active
//         })
//       }
//       res.send({ allTaggedPosts});
    
//   } catch ({ name, message }) {
//     next({ name, message});
//   }
// });

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  const tagName = req.params.tagName

  try {
    const allTaggedPosts = await getPostsByTagName(tagName)

  
    if (req.user) {
      const userPosts = allTaggedPosts.filter(post => {
        return post.active && post.author.id === req.user.id
      })
      res.send({ userPosts })
    } else { 
      const taggedPosts = allTaggedPosts.filter(post => {
        return post.active && post.author.active
      })
      res.send({ taggedPosts })
    }
  } catch ({ name, message}) {
    next({ name, message })
  }
})


module.exports = tagsRouter;