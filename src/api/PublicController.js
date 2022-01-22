import svgCaptcha from 'svg-captcha'
import { add } from '@/config/REDIShelper'

class PublicController {
  constructor() {}
  async getCaptcha (ctx) {
    const uuid = ctx.query.uuid
    
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1i',
      noise: Math.floor(Math.random() * 5),
      height: 40,
      width: 170,
      color: true
    })
    add(uuid, captcha.text, 60 * 10)
    ctx.body = { 
      'code': 200,
      data: captcha.data
    }
  }
}

export default new PublicController()