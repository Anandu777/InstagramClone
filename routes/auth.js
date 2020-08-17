const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const crypto = require('crypto')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendResetPasswordMail } = require('../emails/account')
const { findOne } = require('../models/user')

// Register
router.post(
   '/signup',
   [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Email is required').not().isEmpty(),
      check(
         'password',
         'Please enter password with 6 or more characters'
      ).isLength({ min: 6 }),
   ],
   async (req, res) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }

      let { name, email, password } = req.body

      try {
         let user = await User.findOne({ email: email.toLowerCase() })
         if (user) {
            return res
               .status(400)
               .json({ errors: [{ msg: 'User already exists' }] })
         }

         // Encrypt password
         const salt = await bcrypt.genSalt(10)
         password = await bcrypt.hash(password, salt)

         user = new User({
            name,
            email: email.toLowerCase(),
            password,
         })
         await user.save()

         user = await User.findOne({ email: email.toLowerCase() })

         // Generate token
         jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
               if (err) {
                  throw err
               }
               res.json({
                  token,
                  user: { _id: user._id, name: user.name, email: user.email },
               })
            }
         )
         sendWelcomeEmail(name, email)
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error')
      }
   }
)

// Login
router.post(
   '/signin',
   [
      check('email', 'Email is required').not().isEmpty(),
      check('password', 'Password is required').not().isEmpty(),
   ],
   async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      try {
         // See if user exists
         let user = await User.findOne({ email: email.toLowerCase() })

         if (!user) {
            return res
               .status(401)
               .json({ errors: [{ msg: 'Invalid Credentials!' }] })
         }

         const isMatch = await bcrypt.compare(password, user.password)

         if (!isMatch) {
            return res
               .status(401)
               .json({ errors: [{ msg: 'Invalid Credentials!' }] })
         }

         // Generate token
         jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            {
               expiresIn: 3600,
            },
            (err, token) => {
               if (err) {
                  throw err
               }
               res.json({
                  token,
                  user: { _id: user._id, name: user.name, email: user.email },
               })
            }
         )
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error')
      }
   }
)

// Get user details
router.get('/getuser', [auth], async (req, res) => {
   try {
      const user = await User.findById(req.user._id).select('-password')
      const token = req.token
      res.json({ user, token })
   } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
   }
})

// Send reset password link to registered email
router.post('/resetpassword', async (req, res) => {
   try {
      const buffer = await crypto.randomBytes(32)
      const token = buffer.toString('hex')
      const user = await User.findOne({ email: req.body.email.toLowerCase() })
      if (!user) {
         return res
            .status(404)
            .json({ errors: [{ msg: 'Email not registered!' }] })
      }
      user.resetToken = token
      user.expireToken = Date.now() + 360000
      await user.save()
      sendResetPasswordMail(token, user.email)
      res.json({ msg: 'Link to reset the password is sent to your email!' })
   } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
   }
})

// Change password using link
router.patch(
   '/changepasswordusinglink',
   [
      check(
         'password',
         'Please enter password with 6 or more characters'
      ).isLength({ min: 6 }),
   ],
   async (req, res) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }

      try {
         let { password, token } = req.body
         const user = await User.findOne({
            resetToken: token,
            expireToken: { $gt: Date.now() },
         })
         if (!user) {
            return res
               .status(404)
               .json({ errors: [{ msg: 'Session has expired!' }] })
         }

         // Encrypt password
         const salt = await bcrypt.genSalt(10)
         password = await bcrypt.hash(password, salt)

         user.password = password
         user.resetToken = undefined
         user.expireToken = undefined

         await user.save()

         res.json({ msg: 'Password has been changed successfully!' })
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error')
      }
   }
)

// Change password
router.patch(
   '/changepassword',
   [
      auth,
      [
         check('oldPassword', 'Old password is required').not().isEmpty(),
         check(
            'password',
            'Please enter password with 6 or more characters'
         ).isLength({ min: 6 }),
      ],
   ],
   async (req, res) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }

      try {
         let { oldPassword, password } = req.body

         const user = await User.findById(req.user._id)

         const isMatch = await bcrypt.compare(oldPassword, user.password)

         if (!isMatch) {
            return res
               .status(401)
               .json({ errors: [{ msg: 'Old password does not match!' }] })
         }

         // Encrypt password
         const salt = await bcrypt.genSalt(10)
         password = await bcrypt.hash(password, salt)

         user.password = password

         await user.save()

         res.json({ msg: 'Password has been changed successfully!' })
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error')
      }
   }
)

module.exports = router
