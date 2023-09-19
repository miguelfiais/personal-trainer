import { type User } from '@prisma/client'
import { prisma } from '../lib/prisma'

interface dataProps {
  email?: string
  id?: string
}

export const findUser = async (data: dataProps): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      email: data?.email,
      id: data?.id
    }
  })
  return user
}
