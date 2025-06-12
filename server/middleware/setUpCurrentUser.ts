import express from 'express'
import { UserService } from 'server/services'
import populateCurrentUser from './populateCurrentUser'

export default function setUpCurrentUser(userService: UserService) {
  const router = express.Router()

  router.use(populateCurrentUser(userService))

  return router
}
