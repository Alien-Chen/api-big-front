import mongoose from "../config/DBhelper"
import moment from 'dayjs'

var Schema = mongoose.Schema({
  uid: { type: String, ref: 'users' },
  created: { type: Date },
  favs: { type: Number }
})

Schema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD hh:mm:ss')
  next()
})

Schema.statics = {
  findByUid: function (uid) {
    return this.findOne({ uid: uid }).sort({ created: -1 })
  }
}

const SignRecordModel = mongoose.model('sign_record', Schema)

export default SignRecordModel