import Post from '../model/post'
import Links from '../model/Links'
import { createReadStream, createWriteStream } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import moment from 'dayjs'
import config from '@/config'
import mkdir from 'make-dir'

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
   const result = await Links.find({ type: 'links' })
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
}

export default new ContentController()
