import jwt from 'jsonwebtoken'
import mement from 'dayjs'
import config from '@/config/index'

export const getJwtPayload = (token) => {
  return jwt.verify(token.split(' ')[1], config.JWT_SECRET)
}

export const checkCodeEqual = (originCode, code) => {
  if (!originCode || !code) {
    return false
  }
  if (originCode.toLowerCase() === code.toLowerCase()) {
    return true
  } else {
    return false
  }
}