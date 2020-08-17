const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Post = require('../models/post')

// Get a particular user
router.get('/user/:id', [auth], async (req, res) => {
   try {
      const user = await User.findById(req.params.id).select('-password')
      if (!user) {
         return res.status(404).json({ msg: 'User not found!' })
      }
      let posts = await Post.find({
         postedBy: req.params.id,
      }).populate('postedBy', ['_id', 'name'])

      const postsCount = posts.length

      const autheticatedUser = await User.findById(req.user._id)

      posts = posts.filter((post) =>
         autheticatedUser.following.includes(post.postedBy._id)
      )

      res.json({ user, posts, postsCount })
   } catch (err) {
      console.error(err.message)
      res.status(500).send()
   }
})

// Update profile image
router.patch(
   '/updatepicture',
   [auth, [check('url', 'Image is required').not().isEmpty()]],
   async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }
      try {
         const user = await User.findById(req.user._id)
         user.photo = req.body.url
         await user.save()
         res.json({ msg: 'Profile picture updated!' })
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error!')
      }
   }
)

// Search users
router.post('/searchusers', [auth], async (req, res) => {
   try {
      let search = req.body.name

      let users = await User.find().select('_id name')

      if (search === '') {
         return res.json([])
      }

      // Remove authenticated user
      users = users.filter(
         (user) => req.user._id.toString() !== user._id.toString()
      )

      // Search users
      users = users.filter((user) =>
         user.name.toLowerCase().includes(search.toLowerCase())
      )

      res.json(users)
   } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error!')
   }
})

module.exports = router
