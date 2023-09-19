import { type Request, type Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { UserType } from '@prisma/client'
import { findUser } from '../repositorys/userRepository'
import { hash } from 'bcrypt'

export const createPersonal = async (req: Request, res: Response): Promise<Response> => {
  try {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6)
    })
    const { name, email, password } = bodySchema.parse(req.body)

    const userExist = await findUser({ email })

    if (userExist !== null) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const passwordHash = await hash(password, 10)

    const newPersonal = await prisma.personal.create({
      data: {
        user: {
          create: {
            email,
            name,
            password: passwordHash,
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

export const createAluno = async (req: Request, res: Response): Promise<Response> => {
  try {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email()
    })
    const { name, email } = bodySchema.parse(req.body)
    const userId = req.userId

    const userExist = await findUser({ email })
    if (userExist) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const isPersonal = await findUser({ id: userId })
    if (isPersonal?.tipo === 'ALUNO') {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const password = await hash(name + '123', 10)
    const newAluno = await prisma.aluno.create({
      data: {
        personal: {
          connect: {
            userId
          }
        },
        user: {
          create: {
            email,
            name,
            password,
            tipo: UserType.ALUNO
          }
        }
      }
    })
    return res.status(201).json(newAluno)
  } catch (error) {
    return res.status(500).json({ error })
  }
}
