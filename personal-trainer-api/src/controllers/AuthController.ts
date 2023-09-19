import { type Request, type Response } from 'express'
import { z } from 'zod'
import { findUser } from '../repositorys/userRepository'
import { compare } from 'bcrypt'

export const signIn = async (req: Request, res: Response): Promise<Response> => {
  try {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6)
    })
    const { email, password } = bodySchema.parse(req.body)

    const user = await findUser(email)

    if (user === null) {
      return res.status(400).json({ error: 'Check your email and password' })
    }

    const validPassword = await compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ error: 'Check your email and password' })
    }

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ error })
  }
}
