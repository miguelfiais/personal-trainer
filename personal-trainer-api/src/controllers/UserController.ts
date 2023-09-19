import { type Request, type Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { UserType } from '@prisma/client'
import { findUser } from '../repositorys/userRepository'

export const createPersonal = async (req: Request, res: Response): Promise<Response> => {
  try {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6)
    })
    const { name, email, password } = bodySchema.parse(req.body)

    const userExist = await findUser(email)

    if (userExist !== null) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const newPersonal = await prisma.personal.create({
      data: {
        user: {
          create: {
            email,
            name,
            password,
            tipo: UserType.PERSONAL_TRAINER
          }
        }
      }
    })

    return res.status(201).json(newPersonal)
  } catch (error) {
    return res.status(500).json({ error })
  }
}
