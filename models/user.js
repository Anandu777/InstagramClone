const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
   },
   resetToken: {
      type: String,
   },
   expireToken: {
      type: Date,
   },
   photo: {
      type: String,
      default:
         'https://res.cloudinary.com/anandu777/image/upload/v1597513341/assets/blank_image_uv134b.jpg',
   },
   followers: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'user',
      },
   ],
   following: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'user',
      },
   ],
   date: {
      type: Date,
      default: Date.now,
   },
})

const User = mongoose.model('user', userSchema)

module.exports = User
