const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
   title: {
      type: String,
      required: true,
   },
   body: {
      type: String,
      required: true,
   },
   photo: {
      type: String,
      required: true,
   },
   likes: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'user',
      },
   ],
   comments: [
      {
         text: {
            type: String,
         },
         postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
         },
      },
   ],
   postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
   },
   date: {
      type: Date,
      default: Date.now,
   },
})

const Post = mongoose.model('post', postSchema)

module.exports = Post
