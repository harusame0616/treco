import type { NextAuthOptions } from 'next-auth';

import { getDefaultCategories } from '@/domains/training-category/lib/default-categories';
import { getDefaultEvents } from '@/domains/training-event/lib/default-events';
import { getRequiredEnv } from '@/lib/environment';
import { generateId } from '@/lib/id';
import { prisma } from '@/lib/prisma';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

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
  await prisma.$transaction(async (tx) => {
    await tx.trainee.create({
      data: {
        authUser: {
          create: {
            authUserId: generateId(),
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
    traineeId,
  };
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

      let traineeId;
      if (authUser) {
        traineeId = authUser.traineeId;
      } else {
        const trainee = await createTrainee(token.sub, token.email, token.name);
        traineeId = trainee.traineeId;
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
