import Post from '../model/post'
import Links from '../model/Links'
import { createReadStream, createWriteStream } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import moment from 'dayjs'
import config from '@/config'
import mkdir from 'make-dir'
import { checkCodeEqual, getJwtPayload } from '@/utils'
import User from '@/model/user'
import { getValue } from '@/config/REDIShelper'

class ContentController {
  // 获取文章列表
  async getPostList (ctx) {

    const query = ctx.query
    const sort = query.sort ? query.sort : 'created'
    const page = query.page ? query.page : 0
    const limit = query.limit ? query.limit : 5
    const options = {}

    if (typeof query.catalog !== 'undefined' && query.catalog !== '') {
      options.catalog = query.catalog
    }
    if (typeof query.type !== 'undefined') {
      options.isTop = query.type   
    }
    if (typeof query.status !== 'undefined' && query.status !== '') {
      options.status = query.status
    }
    if (typeof query.tag !== 'undefined' && query.tag !== '') {
      options.tags = { $elemMatch: { name: query.tag } }
    }
    const result = await Post.getPostList(options, page, limit, sort)
    ctx.body = {
     code: 200,
     data: result,
     msg: '获取文章列表成功'
    }
  }
 
 // 获取友联
 async getLinks (ctx) {
   const result = await Links.find({ type: 'link' })
   ctx.body = {
     code: 200,
     data: result
   }
 }

 // 查询温馨提醒
 async getTips (ctx) {
   const result = await Links.find({ type: 'tips' })
   ctx.body = {
     code: 200,
     data: result
   }
 }

 // 本周热议
  async getTopWeek (ctx) {
    const result = await Post.getTopWeek()
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 上传图片
  async uploadImg (ctx) {
    const file = ctx.request.files.file
    // 图片名称、图片格式、存储地址，返回前台可以读取的路径
    // console.log(ctx.request.files, file)
    const ext = file.name.split('.').pop()
    const dir = `${config.uploadPath}/${moment().format('YYYYMMDD')}`
    // 判断路径是否存在，不存在则创建
    await mkdir(dir)
    // 存储文件到指定路径
    // 给文件一个唯一的名称
    const picname = uuidv4()
    const destPath = `${dir}/${picname}.${ext}`
    const reader = createReadStream(file.path)
    const upStream = createWriteStream(destPath)
    const filePath = `/${moment().format('YYYYMMDD')}/${picname}.${ext}`
    reader.pipe(upStream)

    ctx.body = {
      code: 200,
      msg: '图片上传成功',
      data: filePath
    }
  }

  // 添加新贴
  async addPost (ctx) {
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    const originCode = await getValue(sid)
    // 验证图片验证码的时效性、正确性
    const result = await checkCodeEqual(originCode, code)
    if (result) {
      const obj = await getJwtPayload(ctx.header.authorization)
      // 判断用户的积分数是否 > fav，否则，提示用户积分不足发贴
      // 用户积分足够的时候，新建Post，减除用户对应的积分
      const user = await User.findByID({ _id: obj._id })
      if (user.favs < body.fav) {
        ctx.body = {
          code: 501,
          msg: '积分不足'
        }
        return
      } else {
        await User.updateOne({ _id: obj._id }, { $inc: { favs: -body.fav } })
      }
      const newPost = new Post(body)
      newPost.uid = obj._id
      const result = await newPost.save()
      ctx.body = {
        code: 200,
        msg: '成功的保存的文章',
        data: result
      }
    } else {
      // 图片验证码验证失败
      ctx.body = {
        code: 500,
        msg: '图片验证码验证失败'
      }
    }
  }

  // 获取文章详情
  async getPostDetail (ctx) {
    const params = ctx.query
    if (!params.tid) {
      ctx.body = {
        code: 500,
        msg: '文章id为空'
      }
      return
    }
    const post = await Post.findByTid(params.tid)
    // 更新文章阅读记数
    const result = await Post.updateOne({ _id: params.tid }, { $inc: { reads: 1 } })
    if (post._id && result.modifiedCount === 1) {
      ctx.body = {
        code: 200,
        data: post,
        msg: '查询文章详情成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '获取文章详情失败'
      }
    }
  }
}

export default new ContentController()
