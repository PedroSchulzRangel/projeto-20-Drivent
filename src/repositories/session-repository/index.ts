import { Prisma } from "@prisma/client";
import { prisma } from '@/config';

async function create(data: Prisma.SessionUncheckedCreateInput) {
  return prisma.session.create({
    data,
  });
}
async function getSessionByToken(token: string){
return await prisma.session.findFirst({
  where:{
    token
  }
});
}

const sessionRepository = {
  create,
  getSessionByToken
};

export default sessionRepository;
