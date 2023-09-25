import { Router } from 'express'
import { changeUserPassword, createAluno, createPersonal, getAlunos } from './controllers/UserController'
import { signIn } from './controllers/AuthController'
import { authMiddlewares } from './middlewares/auth'
import { createWorkout, updateWorkout } from './controllers/WorkoutController'
import { createExercise, deleteExercise, updateExercise } from './controllers/ExerciseController'

export const router = Router()

router.post('/register/personal', createPersonal)
router.post('/login', signIn)
router.post('/register/aluno', authMiddlewares, createAluno)
router.post('/create/workout/:alunoId', authMiddlewares, createWorkout)
router.post('/create/exercise/:workoutId', authMiddlewares, createExercise)
router.put('/user', authMiddlewares, changeUserPassword)
router.get('/personal/alunos', authMiddlewares, getAlunos)
router.put('/exercise/:exerciseId', authMiddlewares, updateExercise)
router.delete('/exercise/:exerciseId', authMiddlewares, deleteExercise)
router.put('/workout/:workoutId', authMiddlewares, updateWorkout)
