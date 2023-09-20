import { type Request, type Response } from 'express'
import { findUser } from '../repositorys/userRepository'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export const createExercise = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.userId
    const isPersonal = await findUser({ id: userId })
    if (isPersonal?.tipo === 'ALUNO') {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const paramsSchema = z.object({
      workoutId: z.string()
    })
    const { workoutId } = paramsSchema.parse(req.params)
    const isValidWorkout = await prisma.workout.findUnique({
      where: {
        id: workoutId,
        Aluno: {
          personal: {
            userId
          }
        }
      }
    })
    if (!isValidWorkout) {
      return res.status(400).json({ error: 'Unable to create exercise for this workout' })
    }
    const bodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      sets: z.number().optional(),
      repetitions: z.number().optional()
    })
    const { name, description, sets, repetitions } = bodySchema.parse(req.body)
    const newExercise = await prisma.exercise.create({
      data: {
        name,
        description,
        repetitions,
        sets,
        workoutId
      }
    })
    return res.status(201).json(newExercise)
  } catch (error) {
    return res.status(500).json({ error })
  }
}
