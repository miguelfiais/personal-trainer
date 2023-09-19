import { Router } from 'express'
import { createAluno, createPersonal } from './controllers/UserController'
import { signIn } from './controllers/AuthController'
import { authMiddlewares } from './middlewares/auth'

export const router = Router()

router.post('/register/personal', createPersonal)
router.post('/login', signIn)
router.post('/register/aluno', authMiddlewares, createAluno)
