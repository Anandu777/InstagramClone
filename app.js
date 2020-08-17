const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const { MONGOURI } = require('./config/keys')

mongoose.connect(MONGOURI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
})

mongoose.connection.on('connected', () => {
   console.log('MongoDB connected!')
})

mongoose.connection.on('error', (err) => {
   console.log(`Connection error ${err}`)
})

app.use(express.json()) // Parse incoming request

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if (process.env.NODE_ENV === 'production') {
   app.use(express.static('client/build'))
   const path = require('path')
   app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
   })
}

app.listen(PORT, () => {
   console.log(`Server is running on ${PORT}`)
})
