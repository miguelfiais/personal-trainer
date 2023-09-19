import { type Request, type Response } from 'express'
import { z } from 'zod'
import { findUser } from '../repositorys/userRepository'
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'

export const signIn = async (req: Request, res: Response): Promise<Response> => {
  try {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6)
    })
    const { email, password } = bodySchema.parse(req.body)

    const user = await findUser({ email })

    if (user === null) {
      return res.status(400).json({ error: 'Check your email and password' })
    }

    const validPassword = await compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ error: 'Check your email and password' })
    }
    const userSession = { ...user, token: sign({ id: user.id }, 'secret', { expiresIn: '2d' }) }

    return res.status(200).json(userSession)
  } catch (error) {
    return res.status(500).json({ error })
  }
}
