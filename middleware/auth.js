const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const User = require('../models/user')

const auth = async (req, res, next) => {
   // Get token
   const token = req.header('x-auth-token')

   // Check if token exists
   if (!token) {
      return res
         .status(401)
         .json({ errors: [{ msg: 'No token, authorization denied' }] })
   }
   try {
      jwt.verify(token, JWT_SECRET, async (error, decoded) => {
         if (error) {
            return res
               .status(401)
               .json({ errors: [{ msg: 'Token is not valid' }] })
         }
         const { _id } = decoded
         const user = await User.findById(_id).select('-password')
         req.user = user
         req.token = token
         next()
      })
   } catch (err) {
      console.error('Something wrong with auth middleware')
      res.status(500).json({ msg: 'Server Error' })
   }
}

module.exports = auth
