import { Router } from 'express'
import { createPersonal } from './controllers/UserController'

export const router = Router()

router.post('/register/personal', createPersonal)
