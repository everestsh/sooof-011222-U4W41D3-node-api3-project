const express = require('express');
const {
  validateUserId,
  validateUser,
  validatePost
} = require('../middleware/middleware')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const User = require('./users-model')
const Post = require('../posts/posts-model') 
const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  // console.log(req.user)
  User.get()
    .then( users =>{
      res.status(200).json(users)
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  // console.log(req.user)
  User.getById(req.params.id)
    .then( user =>{
      res.status(200).json(user)
    })
    .catch(next)
  
});
// TEST ERR: http post  :9000/api/users 
// TEST : http post  :9000/api/users name=aaaa
router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  // console.log(req.name)
  User.insert(req.body)
    .then( user =>{
      // console.log(user)
      // throw new Error('demons!!!!')
      res.status(201).json(user)
    })
    .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  // console.log(req.user)
  // console.log(req.name)
  // way 1
  // User.update(req.params.id, req.body)
  //   .then( user=>{
  //     // console.log(user)
  //     res.status(200).json(user)
  //   })
  //   .catch(next)

  // way 2
  User.update(req.params.id, req.body)
    .then( (result)=>{
      console.log("result = ",result)
      return User.getById(req.params.id)
    })
    .then( user=>{
      console.log(user)
      res.json(user)
    })
    .catch(next)
});

router.delete('/:id', validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  // console.log(req.user)
  User.remove(req.params.id)
    .then( user =>{
      console.log(user)
      res.status(200).json(req.user)
    })
    .catch(next)
});

router.get('/:id/posts',validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  // console.log(req.user)
  User.getUserPosts(req.params.id)
    .then( post =>{
      // console.log(post)
      res.status(200).json(post)
    } )
    .catch(next)
});

// TEST ERR: http post  :9000/api/users/1/posts
// TEST : http post  :9000/api/users/1/posts text=aaaa
router.post('/:id/posts',validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  // console.log(req.user)
  // console.log(req.text)
  Post.insert({user_id: req.params.id, text: req.body.text})
    .then( post=>{
      // console.log(post)
      res.status(200).json(post)
    })
    .catch(next)
});

router.use((err, req, res, next)=>{// eslint-disable-line
  res.status(err.status ||500).json({
    customMessage: "something tragic inside posts router happened",
    message: err.message,
    stack: err.message
  })
})
// do not forget to export the router
module.exports = router