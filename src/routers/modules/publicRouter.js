import Router from 'koa-router'
import publicController from '../../api/PublicController'
import contentController from '../../api/ContentController'
import userController from '../../api/UserController'
import commentsController from '@/api/CommentsController'
const router = new Router()

router.prefix('/public')
router.get('/getCaptcha', publicController.getCaptcha)

// 获取文章列表
router.get('/list', contentController.getPostList)

// 温馨提醒
router.get('/tips', contentController.getTips)

// 友情链接
router.get('/links', contentController.getLinks)

// 回复周榜
router.get('/topWeek', contentController.getTopWeek)

// 确认修改邮件
router.get('/reset-email', userController.udateUsername)

// 获取文章详情
router.get('/content/detail', contentController.getPostDetail)

// 获取评论列表
router.get('/comments', commentsController.getComments)

export default router