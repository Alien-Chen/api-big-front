import mongoose from '../config/DBhelper'
import dayjs from 'dayjs'

const Schema = mongoose.Schema({
  uid: { type: String, ref: 'users' },
  created: { type: Date },
  title: { type: String },
  content: { type: String },
  catalog: { type: String },
  isEnd: { type: String, default: '0' },
  reads: { type: Number, default: 0 },
  answer: { type: Number, default: 0 },
  status: { type: String, default: '0' },
  isTop: { type: String, default: '0' },
  sort: { type: String, default: 100 },
  fav: { type: Number, default: 0 },
  tags: {
    type: Array,
    default: []
  }
})

Schema.virtual('user', {
  ref: 'users',
  localField: 'uid',
  foreignField: '_id'
})

Schema.pre('save', function (next) {
  this.created = dayjs().format('YYYY-MM-DD hh:mm:ss')
  next()
})

Schema.statics = {
  getPostList: function (options, page, limit, sort) {
    return this.find(options)
     .sort({ [sort]: -1 })
     .skip(page * limit)
     .limit(limit)
     .populate({
      path: 'uid',
      select: 'nickname isVip pic'
     })
  },
  getTopWeek: function () {
    return this.find({
      created: { $gte: dayjs().subtract(7, 'days') }
    }, {
      answer: 1,
      title: 1
    })
    .sort({ answer: -1 })
    .limit(5)
  },
  findByTid: function (id) {
    return this.findOne({ _id: id }).populate({
      path: 'uid',
      select: 'nickname pic isVip _id'
    })
  }
}

const PostModel = mongoose.model('posts', Schema)

export default PostModel
