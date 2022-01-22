import mongoose from '../config/DBhelper'

var Schema = mongoose.Schema({ 
  username: { type: String }, 
  password: { type: String },
  nickname: { type: String }
})

const UserModel = mongoose.model('users', Schema)

export default UserModel