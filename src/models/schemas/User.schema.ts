import { ObjectId } from 'mongodb'

import { UserVerifyStatus } from '@/constants/enums'

type UserType = {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  email_verify_token?: string // jwt hoặc '' nếu đã xác thực email
  forgot_password_token?: string // jwt hoặc '' nếu đã xác thực email
  verify?: UserVerifyStatus
  tweeter_circle?: ObjectId[] // danh sách user id mà user này add vào circle
  bio?: string // optional
  location?: string // optional
  website?: string // optional
  username?: string // optional
  avatar?: string // optional
  cover_photo?: string // optional
  created_at?: Date
  updated_at?: Date
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus
  tweeter_circle: ObjectId[]
  bio: string
  location: string
  website: string
  username: string
  avatar: string
  cover_photo: string
  created_at: Date
  updated_at: Date

  constructor(user: UserType) {
    const currentDate = new Date()

    this._id = user._id
    this.name = user.name
    this.email = user.email
    this.date_of_birth = user.date_of_birth
    this.password = user.password
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.tweeter_circle = user.tweeter_circle || []
    this.bio = user.bio || ''
    this.location = user.location || ''
    this.website = user.website || ''
    this.username = user.username || ''
    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''
    this.created_at = user.created_at || currentDate
    this.updated_at = user.updated_at || currentDate
  }
}
