import qs from 'qs'
import config from '@/config'
const nodemailer = require("nodemailer");
/**
 * @param {email: string, user: string, expire: string, code: string} data 
 * @returns 
 */
// async..await is not allowed in global scope, must use a wrapper
async function send(data) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.qq.com", // 记得修改
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'lm4czq@qq.com', // generated ethereal user
      // pass: 'bkqiwhalvismcaab', // generated ethereal password
      pass: 'jbafewxasjdtbibh'
    },
  });

  const baseUrl = config.frontBaseUrl
  const route = data.type === 'email' ? '/confirm' : '/reset'
  const url = `${baseUrl}/#${route}${data.data ? '?' +qs.stringify(data.data) : ''}`
  console.log(baseUrl)
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"邮箱验证" <lm4czq@qq.com>', // sender address
    to: `${data.email}`, // list of receivers
    // to: 'lm4czq@qq.com',
    subject: data.type !=='email' ? `修改密码` : '确认修改邮箱', // Subject line
    text: `邀请码过期时间为${data.expire}`, // plain text body
    html: `
          <div style="border: 1px solid #dcdcdc;color: #000;width: 600px; margin: 0 auto; padding-bottom: 50px;position: relative;">
          <div style="height: 60px; background: #b6cd59; line-height: 60px; color: #fff; font-size: 18px;padding-left: 10px;">小强社区——欢迎来到小强社区</div>
          <div style="padding: 25px">
            <div>您好，${data.user} 童鞋，重置链接有效时间30分钟，请在${
        data.expire
      }之前重置您的密码：</div>
            <a href="${url}" style="padding: 10px 20px; color: #fff; background: #b6cd59; display: inline-block;margin: 15px 0;">${data.code ? '重置您的密码' : '修改您的邮箱为：' + data.data.username}</a>
            <div style="padding: 5px; background: #f2f2f2;">如果该邮件不是由你本人操作，请勿进行激活！否则你的邮箱将会被他人绑定。</div>
          </div>
          <div style="background: #fafafa; color: #b4b4b4;text-align: center; line-height: 45px; height: 45px; position: absolute; left: 0; bottom: 0;width: 100%;">系统邮件，请勿直接回复</div>
      </div>
      `, // html body
  });

  // console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  return info
}

export default send

// main().catch(console.error);