const express = require('express');
const postsRouter = express.Router();
const { getAllPosts, client, createTags, createPost, updatePost, getPostById } = require('../db')
const { requireUser, requireActiveUser } = require('./utils');

postsRouter.get('/', async (req, res, next) => {
  try {
    const allPosts = await getAllPosts()

    let userId 
    req.user ? userId = req.user.id:null


      const posts = allPosts.filter(post => {
        return post.active || (req.user && post.author.id === req.user.id);
      });
   
    res.send({
      posts
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});


// postsRouter.use((req, res, next) => {
//   console.log("A request is being made to /posts");

//   next(); 
// });



postsRouter.post('/', requireUser, requireActiveUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/)
  const postData = {};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    if (title && content) {
      postData.authorId = req.user.id;
      postData.title = title
      postData.content = content
    } 
    const post = await createPost(postData);
    if (post) {
      res.send({ post })
    } else {
      next({name:"creating post error", 
    message: "creating message error"})
    }

  } catch ({ name, message }) {
    next({ name, message });
  }
});



postsRouter.patch('/:postId', requireUser, requireActiveUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }
  
  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatedPost(postId, updateFields);
      res.send({ post: updatedPost })
    } else {
      next({
        name: 'UnauthorizedUserError',
        message: ' -___-  You cannot update a post that is not yours quit trying that plsssss'
      })
    }
  } catch ({ name, message }) {
    next({ name, 
      message });
  }
});




postsRouter.delete('/:postId', requireUser, requireActiveUser, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.postId);

    if (post && post.author.id === req.user.id) {
      const updatedPost = await updatePost(post.id, { active: false });
      res.send({ post: updatedPost });
    } else {
      // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
      next(post ? { 
        name: "UnauthorizedUserError",
        message: "You cannot delete a post which is not yours"
      } : {
        name: "PostNotFoundError",
        message: "That post does not exist"
      });
    }

  } catch ({ name, message }) {
    next({ name, message })
  }
});


module.exports = postsRouter;