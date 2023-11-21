import type { NextAuthOptions } from 'next-auth';

import { DomainEventPublisher } from '@/domains/lib/domain-event-publisher';
import { TraineePrismaRepository } from '@/domains/trainee/infrastructures/prisma.repository';
import { TraineeCreateUsecase } from '@/domains/trainee/usecases/create.usecase';
import { TrainingCategoryPrismaRepository } from '@/domains/training-category/infrastructures/prisma.repository';
import { TrainingCategoryEventListener } from '@/domains/training-category/usecases/event-listener';
import { TrainingEventPrismaRepository } from '@/domains/training-event/infrastructures/prisma.repository';
import { TrainingEventEventListener } from '@/domains/training-event/usecases/event-listener';
import { env } from '@/lib/env';
import { generateId } from '@/lib/id';
import { prisma } from '@/lib/prisma';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

declare module 'next-auth' {
  interface Session {
    user: {
      sub: string;
      traineeId: string;
    };
  }
}

const trainingCategoryEventListener = new TrainingCategoryEventListener(
  new TrainingCategoryPrismaRepository(new DomainEventPublisher()),
);
trainingCategoryEventListener.listen();
const trainingEventEventListener = new TrainingEventEventListener(
  new TrainingEventPrismaRepository(),
);
trainingEventEventListener.listen();

async function createTrainee(sub: string, email: string, name: string) {
  const authUserId = generateId();
  // TODO: ドメインイベントで対応する
  await prisma.authUser.create({
    data: {
      authUserId,
      email,
      sub,
    },
  });

  const usecase = new TraineeCreateUsecase(
    new TraineePrismaRepository(new DomainEventPublisher()),
  );
  return await usecase.execute({ authUserId, name });
}

export const authOptions = {
  callbacks: {
    async session({ session, token }) {
      if (!token.sub || !token.email || !token.name) {
        throw new Error('token is invalid');
      }

      const authUser = await prisma.authUser.findUnique({
        include: {
          trainee: true,
        },
        where: {
          sub: token.sub,
        },
      });

      session.user.traineeId =
        authUser?.trainee?.traineeId ??
        (await createTrainee(token.sub, token.email, token.name)).traineeId;
      session.user.sub = token.sub;
      return session;
    },
  },
  jwt:
    env.NODE_ENV !== 'production' && env.NEXT_AUTH_JWT_NO_ENCRYPTION
      ? {
          async decode(params) {
            return JSON.parse(params.token!.toString());
          },
          async encode(params) {
            return JSON.stringify(params.token);
          },
        }
      : undefined,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: env.NEXT_AUTH_SECRET,
} satisfies NextAuthOptions;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
