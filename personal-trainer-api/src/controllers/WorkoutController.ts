import { type Response, type Request } from 'express'
import { findUser } from '../repositorys/userRepository'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export const createWorkout = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.userId
    const isPersonal = await findUser({ id: userId })
    if (isPersonal?.tipo === 'ALUNO') {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const paramsSchema = z.object({
      alunoId: z.string()
    })
    const { alunoId } = paramsSchema.parse(req.params)
    const isValidAluno = await prisma.aluno.findUnique({
      where: {
        id: alunoId,
        personal: {
          userId
        }
      }
    })
    if (!isValidAluno) {
      return res.status(400).json({ error: 'Unable to create training for this student' })
    }
    const bodySchema = z.object({
      name: z.string(),
      description: z.string().optional()
    })
    const { name, description } = bodySchema.parse(req.body)
    const newWorkout = await prisma.workout.create({
      data: {
        name,
        description,
        alunoId
      }
    })
    return res.status(201).json(newWorkout)
  } catch (error) {
    return res.status(500).json({ error })
  }
}
