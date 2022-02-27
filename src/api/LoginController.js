import send from '@/config/mailierConfig'
import moment from 'moment'
import { getValue, add } from '@/config/REDIShelper'
import { checkCodeEqual } from '@/utils'
import UserModel from '@/model/user'
import jwt from 'jsonwebtoken'
import config from '@/config/index'
import { getJwtPayload } from '@/utils'
import bcrypt from 'bcrypt'
import SignRecord from '../model/SignRecord'
import { v4 as uuidv4 } from 'uuid'
class LoginController {
  constructor() {

  }
  // 忘记密码， 发送邮箱
  async forget(ctx) {
    const { code, sid, username } = ctx.request.body
    const originCode = await getValue(sid)
    const isEqual = checkCodeEqual(originCode, code)
    if (isEqual) {
      const user = await UserModel.findOne({ username })
      if (!user) {
        ctx.body = {
          code: 400,
          msg: '查无此人，请验证邮箱是否有误'
        }
      }
      const key = uuidv4()
      add(key, jwt.sign({ _id: user._id }, config.JWT_SECRET, { expiresIn: '30m' }))
      try {

        let result = await send({
          code: code,
          data: {
            key: key
          },
          expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
          email: username,
          user: user.nickname
        })
        ctx.body = {
          code: 200,
          msg: '邮箱发送成功'
        }
      } catch (e) {
        ctx.body = {
          code: 400,
          data: result,
          msg: '邮箱发送失败'
        }
      }
    } else {
      ctx.body = {
        code: 400,
        msg: '图片验证码错误或过期'
      }
    }
  }

  // 用户登录
  async login (ctx) {
    // 接收用户数据
    // 判断验证码是否过期 或 有效
    // 判断用户名密码是否符合校验
    const { sid, username, password, code } = ctx.request.body
    const originCode = await getValue(sid)
    const msg = {}
    const isEqual = checkCodeEqual(originCode, code)
    // console.log('登录功能测试', username)
    if (isEqual) {// 如果找得到sid对应的code 并且 code和redis中的相等
      // 查找mongodb数据库 查看是否存在用户名 并且密码是否相等

      const user = await UserModel.findOne({ username: username })
      if (user === null) {
        ctx.body = {
          code: 404,
          msg: '用户名或者密码错误'
        }
        return
      }
      const match = await bcrypt.compare(password, user.password)
      if (match) {
        // 密码验证通过，开始生产token
        const token = jwt.sign({
          _id: user._id,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
        }, config.JWT_SECRET)
        const userObj = user.toJSON()
        const arr = ['password', 'username', 'roles']
        arr.map((item) => {
          delete userObj[item]
        })
        const signRecord = await SignRecord.findByUid(userObj._id)
        if (signRecord !== null) {
          if (moment(signRecord.created).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            userObj.isSign = true
          } else {
            userObj.isSign = false
          }
          userObj.lastSign = signRecord.created
        } else {
          // 用户无签到记录
          userObj.isSign = false
        }
        ctx.body = {
          code: 200,
          data: userObj,
          token: token,
          msg: '登录成功'
        }
      } else {
        // 密码验证不通过
        msg.password = []
        ctx.body = {
          code: 400,
          msg: '密码或用户名错误，请重新输入'
        }
      }
    } else {
      // msg.authCode = ['图片验证码错误或过期']
      ctx.body = {
        code: 400,
        msg: '图片验证码错误或过期'
      }
    }
  }

  // 注册
  async reg(ctx) {
    // 获取requset.body 的值
    const { sid, username, nickname, password, code } = ctx.request.body
    const originCode = await getValue(sid)
    const isEqual = checkCodeEqual(originCode, code)
    if (isEqual) {
      // 判断用户名和昵称是否已经被注册
      const usernameUser = await UserModel.find({ username: username })
      if (usernameUser && usernameUser[0]) {
        ctx.body = {
          code: 400,
          msg: '用户名已经被注册'
        }
        return
      }
      const nicknameUser = await UserModel.find({ nickname: nickname })
      if (nicknameUser && nicknameUser[0]) {
        ctx.body = {
          code: 400,
          msg: '昵称已重复，请重新输入'
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
        msg: '注册成功'
      }
      
    } else {
      // 验证码过期或错误
      ctx.body = {
        code: 400,
        msg: '图片验证码错误或过期'
      }
    }
  }

  // 重置密码
  // 密码重置
  async reset (ctx) {
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    // 验证图片验证码的时效性、正确性
    const originCode = await getValue(sid)
    const result = checkCodeEqual(originCode, code)
    if (!body.key) {
      ctx.body = {
        code: 500,
        msg: '请求参数异常，请重新获取链接'
      }
      return
    }
    if (!result) {
      // msg.code = []
      ctx.body = {
        code: 500,
        msg: '验证码已经失效，请重新获取！'
      }
      return
    }
    const token = await getValue(body.key)
    if (token) {
      const obj = getJwtPayload('Bearer ' + token)
      body.password = await bcrypt.hash(body.password, 5)
      await UserModel.updateOne(
        { _id: obj._id },
        {
          password: body.password
        }
      )
      ctx.body = {
        code: 200,
        msg: '更新用户密码成功！'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '链接已经失效'
      }
    }
  }
}

export default new LoginController()