const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth')
const Post = require('../models/post')
const User = require('../models/user')

// Create post
router.post(
   '/createpost',
   [
      auth,
      [
         check('title', 'Title is required').not().isEmpty(),
         check('body', 'Body is required').not().isEmpty(),
         check('url', 'Image is required').not().isEmpty(),
      ],
   ],
   async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }

      try {
         const { title, body, url } = req.body
         const post = new Post({
            title,
            body,
            photo: url,
            postedBy: req.user,
         })
         await post.save()
         res.json({ post: post })
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error!')
      }
   }
)

// Get all posts of following users
router.get('/allpost', [auth], async (req, res) => {
   try {
      let posts = await Post.find()
         .sort({ date: -1 })
         .populate('postedBy', ['_id', 'name'])
         .populate('comments.postedBy', ['_id', 'name'])

      const user = await User.findById(req.user._id)

      posts = posts.filter(
         (post) =>
            user.following.includes(post.postedBy._id) ||
            post.postedBy._id.toString() === req.user._id.toString()
      )

      res.json({ posts })
   } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error!')
   }
})

// Get all post of authenticated user
router.get('/mypost', [auth], async (req, res) => {
   try {
      const myPost = await Post.find({
         postedBy: req.user._id,
      })
         .sort({ date: -1 })
         .populate('postedBy', ['_id', 'name'])
         .populate('comments.postedBy', ['_id', 'name'])
      res.json({ myPost })
   } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error!')
   }
})

// Like post
router.put('/like', [auth], async (req, res) => {
   try {
      let post = await Post.findById(req.body.postId)

      // Check if the post has alreadty been liked

      if (post.likes.includes(req.user._id)) {
         return res.status(400).json({ msg: 'Post already liked' })
      }

      // post.likes.unshift(req.user._id)
      // await post.save()

      post = await Post.findByIdAndUpdate(
         req.body.postId,
         { $push: { likes: req.user._id } },
         { new: true }
      )
         .populate('postedBy', ['_id', 'name'])
         .populate('comments.postedBy', ['_id', 'name'])

      res.json(post)
   } catch (err) {
      console.error(err.message)
      res.status(500).send()
   }
})

// Unlike post
router.put('/unlike', [auth], async (req, res) => {
   try {
      let post = await Post.findById(req.body.postId)

      // Check if the post has already been liked
      if (!post.likes.includes(req.user._id)) {
         return res.status(400).json({ msg: 'Post not liked' })
      }

      // post.likes = post.likes.filter(
      //    (like) => like.toString() !== req.user._id.toString()
      // )
      // await post.save()

      post = await Post.findByIdAndUpdate(
         req.body.postId,
         { $pull: { likes: req.user._id } },
         { new: true }
      )
         .populate('postedBy', ['_id', 'name'])
         .populate('comments.postedBy', ['_id', 'name'])

      res.json(post)
   } catch (err) {
      console.error(err.message)
      res.status(500).send()
   }
})

// Add a comment
router.put('/comment', [auth], async (req, res) => {
   try {
      const comment = {
         text: req.body.text,
         postedBy: req.user._id,
      }
      // let post = await Post.findById(req.body.postId)

      // post.comments.push(comment)
      // await post.save()

      const post = await Post.findByIdAndUpdate(
         req.body.postId,
         { $push: { comments: comment } },
         { new: true }
      )
         .populate('postedBy', ['_id', 'name'])
         .populate('comments.postedBy', ['_id', 'name'])

      res.json(post)
   } catch (err) {
      console.error(err.message)
      res.status(500).send()
   }
})

// Delete post
router.delete('/deletepost/:postId', [auth], async (req, res) => {
   try {
      let post = await Post.findById(req.params.postId)

      if (!post) {
         return res.status(404).json({ msg: 'Post not found' })
      }

      if (post.postedBy._id.toString() !== req.user._id.toString()) {
         return res.status(401).json({ msg: 'User not authorized' })
      }
      await post.remove()

      res.json(post)
   } catch (err) {
      console.error(err.message)
      res.status(500).send()
   }
})

// Delete comment
router.delete('/deletecomment/:postId/:commentId', [auth], async (req, res) => {
   try {
      let post = await Post.findById(req.params.postId)

      if (!post) {
         return res.status(404).json({ msg: 'Post not found' })
      }

      // Pull out comment
      const comment = post.comments.find(
         (comment) => comment._id.toString() === req.params.commentId
      )

      // Make sure comment exists
      if (!comment) {
         return res.status(404).json({ msg: 'Comment does not exist' })
      }

      // Check user
      if (
         comment.postedBy.toString() !== req.user._id.toString() &&
         req.user._id.toString() !== post.postedBy.toString()
      ) {
         return res.status(404).json({ msg: 'User not authorized' })
      }

      // post.comments = post.comments.filter(
      //    ({ _id }) => _id.toString() !== req.params.commentId.toString()
      // )

      // await post.save()

      post = await Post.findByIdAndUpdate(
         req.params.postId,
         { $pull: { comments: comment } },
         { new: true }
      )
         .populate('postedBy', ['_id', 'name'])
         .populate('comments.postedBy', ['_id', 'name'])

      res.json(post)
   } catch (err) {
      console.error(err.message)
      res.status(500).send()
   }
})

// Follow
router.patch('/follow', [auth], async (req, res) => {
   try {
      let user = await User.findById(req.user._id)

      // Check if the user is already a follower

      if (user.following.includes(req.body.followId)) {
         return res.status(400).json({ msg: 'User is already a follower' })
      }

      user.following.unshift(req.body.followId)
      await user.save()

      user = await User.findById(req.body.followId)

      // Check if the user has already been followed

      if (user.followers.includes(req.user._id)) {
         return res.status(400).json({ msg: 'User has already been followed' })
      }

      user.followers.unshift(req.user._id)
      await user.save()

      res.json(user)
   } catch (err) {
      console.error(err.message)
      res.status(500).send()
   }
})

// Unfollow
router.patch('/unfollow', [auth], async (req, res) => {
   try {
      let user = await User.findById(req.user._id)

      // Check if the user is already a follower

      if (!user.following.includes(req.body.unfollowId)) {
         return res.status(400).json({ msg: 'User is not a follower' })
      }
      user.following = user.following.filter(
         (f) => f.toString() !== req.body.unfollowId.toString()
      )

      await user.save()

      user = await User.findById(req.body.unfollowId)

      // Check if the user has already been followed

      if (!user.followers.includes(req.user._id)) {
         return res.status(400).json({ msg: 'User has not been followed' })
      }

      user.followers = user.followers.filter(
         (follower) => follower.toString() !== req.user._id.toString()
      )

      await user.save()
      res.json(user)
   } catch (err) {
      console.error(err.message)
      res.status(500).send()
   }
})

module.exports = router
