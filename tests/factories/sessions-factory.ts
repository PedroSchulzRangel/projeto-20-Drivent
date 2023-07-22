import { Session } from '@prisma/client';
import { createUser } from './users-factory';
import { prisma } from '@/config';
import { User } from '@prisma/client';

export async function createSession(token: string, user?: User): Promise<Session> {
   const newUser = user || await createUser();

  return prisma.session.create({
    data: {
      token: token,
      userId: newUser.id,
    },
  });
}
