import type { NextAuthOptions } from 'next-auth';

import { getDefaultCategories } from '@/domains/training-category/lib/default-categories';
import { getDefaultEvents } from '@/domains/training-event/lib/default-events';
import { getRequiredEnv } from '@/lib/environment';
import { generateId } from '@/lib/id';
import { createServerLogger, eventTypeEnum } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { unknown } from 'valibot';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    user: {
      sub: string;
      traineeId: string;
    };
  }
}

async function createTrainee(sub: string, email: string, name: string) {
  const traineeId = generateId();
  const authUserId = generateId();

  await prisma.$transaction(async (tx) => {
    await tx.trainee.create({
      data: {
        authUser: {
          create: {
            authUserId,
            email,
            sub,
          },
        },
        name,
        traineeId,
      },
    });

    const categories = getDefaultCategories().map((category, order) => ({
      ...category,
      order,
      traineeId,
      trainingCategoryId: generateId(),
    }));

    await tx.trainingCategory.createMany({
      data: categories,
    });

    const events = categories.flatMap((category) =>
      getDefaultEvents(category.name).map(
        ({ categoryName: _, ...event }, order) => ({
          ...event,
          order,
          traineeId,
          trainingCategoryId: category.trainingCategoryId,
          trainingEventId: generateId(),
        }),
      ),
    );

    await tx.trainingEvent.createMany({
      data: events,
    });
  });

  return {
    authUserId,
    traineeId,
  };
}

export const authOptions = {
  callbacks: {
    async session({ session, token }) {
      const logger = createServerLogger();
      if (!token.sub || !token.email || !token.name) {
        const error = Error('トークンが不正です');
        logger.error('トークンに sub、 email、 name が含まれていません', {
          error,
          eventType: eventTypeEnum.APPLICATION_ERROR,
          func: { name: 'session' },
        });

        throw error;
      }

      const authUser = await prisma.authUser.findUnique({
        include: {
          trainee: true,
        },
        where: {
          sub: token.sub,
        },
      });

      let traineeId;
      if (authUser) {
        traineeId = authUser.traineeId;
      } else {
        try {
          const trainee = await createTrainee(
            token.sub,
            token.email,
            token.name,
          );
          traineeId = trainee.traineeId;
          logger.info('トレーニーを作成しました', {
            eventType: eventTypeEnum.USER_ADD,
            func: { name: 'session' },
            trainee: {
              email: token.email,
              ...trainee,
            },
          });
        } catch (e: unknown) {
          logger.error('トレーニーの作成に失敗しました', {
            error: e as Error,
            func: { name: 'session' },
            trainee: {
              email: token.email,
            },
          });
          throw e;
        }
      }

      if (authUser?.traineeId) {
        traineeId = authUser.traineeId;
      }

      session.user.traineeId = traineeId;
      session.user.sub = token.sub;

      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: getRequiredEnv('GOOGLE_CLIENT_ID'),
      clientSecret: getRequiredEnv('GOOGLE_CLIENT_SECRET'),
    }),
  ],
  secret: getRequiredEnv('NEXT_AUTH_SECRET'),
} satisfies NextAuthOptions;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
