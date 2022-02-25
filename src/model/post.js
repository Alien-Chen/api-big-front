import mongoose from '../config/DBhelper'
import dayjs from 'dayjs'

var Schema = mongoose.Schema({
  uid: { type: String, ref: 'users' },
  created: { type: Date },
  title: { type: String },
  content: { type: String },
  catalog: { type: String },
  fav: { type: String },
  isEnd: { type: String },
  reads: { type: Number },
  answer: { type: Number },
  status: { type: String },
  isTop: { type: String },
  sort: { type: String },
  tags: { type: Array },
  tags: {
    type: Array,
    default: [{
      name: '',
      class: ''
    }]
  }
})

Schema.pre('save', function (next) {
  this.created = dayjs().format('YYYY-MM-DD hh:mm:ss')
  next()
})

Schema.statics = {
  getPostList: function (options, page, limit, sort) {
    console.log(limit*page)
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
  }
}

const PostModel = mongoose.model('posts', Schema)

export default PostModel
