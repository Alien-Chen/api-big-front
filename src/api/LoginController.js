import send from '@/config/mailierConfig'
import moment from 'moment'
import { getValue } from '@/config/REDIShelper'
import { checkCodeEqual } from '@/utils'
import UserModel from '@/model/user'
import jwt from 'jsonwebtoken'
import config from '@/config/index'
import bcrypt from 'bcrypt'
class LoginController {
  constructor() {

  }
  async forget(ctx) {
    const { body } = ctx.request
    console.log(body)
    try {
      let result = await send({
        code: body.code,
        expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        email: body.username,
        user: body.user
      })
      ctx.body = {
        code: 200,
        data: result,
        msg: '邮箱发送成功'
      }
    } catch (e) {
      console.log(e)
    }
  }
  async login(ctx) {
    // 接收用户数据
    // 判断验证码是否过期 或 有效
    // 判断用户名密码是否符合校验
    const { sid, username, password, code } = ctx.request.body
    const originCode = await getValue(sid)
    const msg = {}
    const isEqual = checkCodeEqual(originCode, code)
    if (isEqual) {// 如果找得到sid对应的code 并且 code和redis中的相等
      // 查找mongodb数据库 查看是否存在用户名 并且密码是否相等
      const user = await UserModel.find({username: username})
      const match = user[0] && await bcrypt.compare(password, user[0].password)
      if (match) {
        // 密码验证通过，开始生产token
        const token = jwt.sign({
          _id: 'chen',
          exp: Math.floor(Date.now() / 1000) + (60 * 60)
        }, config.JWT_SECRET)
        ctx.body = {
          code: 200,
          token: token,
          message: '登录成功'
        }
      } else {
        // 密码验证不通过
        msg.password = ['密码或用户名错误，请重新输入']
        ctx.body = {
          code: 400,
          message: msg
        }
      }
    } else {
      msg.authCode = ['图片验证码错误或过期']
      ctx.body = {
        code: 400,
        message: msg
      }
    }
  }
  async reg(ctx) {
    // 获取requset.body 的值
    const { sid, username, nickname, confirmPassword, password, code } = ctx.request.body
    const originCode = await getValue(sid)
    const isEqual = checkCodeEqual(originCode, code)
    const msg = {}
    if (isEqual) {
      // 判断用户名和昵称是否已经被注册
      const usernameUser = await UserModel.find({ username: username })
      if (usernameUser && usernameUser[0]) {
        msg.username = ['用户名已经被注册']
        ctx.body = {
          code: 400,
          message: msg
        }
        return
      }
      const nicknameUser = await UserModel.find({ nickname: nickname })
      if (nicknameUser && nicknameUser[0]) {
        msg.nickname = ['昵称已重复，请重新输入']
        ctx.body = {
          code: 400,
          message: msg
        }
        return
      }
      // 写入数据库
      // 密码加密
      const salt = bcrypt.genSaltSync(10)
      const pswHash = bcrypt.hashSync(password, salt)
      const result = new UserModel({
        nickname,
        username,
        password: pswHash
      })
      result.save(function (err) {
        if (err) console.log(err)
       
      })
       ctx.body = {
        code: 200,
        message: '注册成功'
      }
      
    } else {
      // 验证码过期或错误
      msg.authCode = ['图片验证码错误或过期']
      ctx.body = {
        code: 400,
        message: msg
      }
    }
  }
}

export default new LoginController()