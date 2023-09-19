import { type User } from '@prisma/client'
import { prisma } from '../lib/prisma'

export const findUser = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })
  return user
}
