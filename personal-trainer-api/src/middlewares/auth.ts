import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'

interface TokenPayload {
  id: string
}

export const authMiddlewares = (req: Request, res: Response, next: NextFunction): Response | undefined => {
  const authToken = req.headers.authorization
  if (!authToken) {
    return res.status(401).json({ error: 'Token not provided' })
  }
  const token = authToken.split(' ')[1]
  try {
    jwt.verify(token, 'secret', (error, decoded) => {
      if (error) {
        throw new Error()
      }
      const { id } = decoded as TokenPayload
      req.userId = id
      next()
    })
  } catch (error) {
    return res.status(401).json({ error: 'Token is invalid' })
  }
}
