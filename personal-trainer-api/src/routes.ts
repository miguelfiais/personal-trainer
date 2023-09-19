import { Router } from 'express'
import { createPersonal } from './controllers/UserController'
import { signIn } from './controllers/AuthController'

export const router = Router()

router.post('/register/personal', createPersonal)
router.post('/login', signIn)
