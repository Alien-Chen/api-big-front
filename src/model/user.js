import mongoose from '../config/DBhelper'
import dayjs from 'dayjs'
var Schema = mongoose.Schema({ 
  username: { type: String, index: { unique: true }, sparse: true },
  password: { type: String },
  nickname: { type: String },
  created: { type: Date },
  updated: { type: Date },
  favs: { type: Number, default: 100 },
  gender: { type: String, default: '' },
  roles: { type: Array, default: ['user'] },
  pic: { type: String, default: '/img/header.jpeg' },
  mobile: { type: String, match: /^1[3-9](\d{9})$/, default: '' },
  status: { type: String, default: '0' },
  regmark: { type: String, default: '' },
  location: { type: String, default: '' },
  isVip: { type: String, default: '0' },
  count: { type: Number, default: 0 }
})

Schema.pre('save', function (next) {
  this.created = dayjs().format('YYYY-MM-DD hh:mm:ss')
  next()
})

Schema.post('save', function (error, doc, next) {
  // 插入值之后的错误判断，目前是用来如果username相同抛出错误
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Error: Monngoose has a duplicate key.'))
  } else {
    next(error)
  }
})

Schema.statics = {
  findByID: function(id) {
     return this.findOne({ _id: id }, {
      password: 0,
      username: 0,
      mobile: 0
    })
  }
}

const UserModel = mongoose.model('users', Schema)

export default UserModel