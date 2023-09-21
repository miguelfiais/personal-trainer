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

export const updateExercise = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.userId
    const isPersonal = await findUser({ id: userId })
    if (isPersonal?.tipo === 'ALUNO') {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const paramsSchema = z.object({
      exerciseId: z.string()
    })
    const { exerciseId } = paramsSchema.parse(req.params)

    const exerciseExist = await prisma.exercise.findUnique({
      where: {
        id: exerciseId,
        Workout: {
          Aluno: {
            personal: {
              userId
            }
          }
        }
      }

    })
    if (!exerciseExist) {
      return res.status(404).json({ error: 'Exercise not found' })
    }
    const bodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      sets: z.number().optional(),
      repetitions: z.number().optional()
    })
    const { name, description, sets, repetitions } = bodySchema.parse(req.body)

    const newExercise = await prisma.exercise.update({
      where: {
        id: exerciseId
      },
      data: {
        name,
        description,
        repetitions,
        sets
      }
    })
    return res.status(201).json(newExercise)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const deleteExercise = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.userId
    const isPersonal = await findUser({ id: userId })
    if (isPersonal?.tipo === 'ALUNO') {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const paramsSchema = z.object({
      exerciseId: z.string()
    })
    const { exerciseId } = paramsSchema.parse(req.params)

    const exerciseExist = await prisma.exercise.findUnique({
      where: {
        id: exerciseId,
        Workout: {
          Aluno: {
            personal: {
              userId
            }
          }
        }
      }
    })
    if (!exerciseExist) {
      return res.status(404).json({ error: 'Exercise not found' })
    }
    await prisma.exercise.delete({
      where: {
        id: exerciseId
      }
    })
    return res.status(200).json()
  } catch (error) {
    return res.status(500).json({ error })
  }
}
