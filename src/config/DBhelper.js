import mongoose from 'mongoose'
import config from './index'

mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
var db = mongoose.connection;
db.on('open', () => {
  console.log('connection success')
})

db.on('error', () => {
  console.log('connection error')
})

export default mongoose