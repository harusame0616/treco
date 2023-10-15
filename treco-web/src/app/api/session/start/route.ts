import { getDefaultCategories } from '@/domains/training-category/lib/default-categories';
import { getDefaultEvents } from '@/domains/training-event/lib/default-events';
import { auth } from '@/lib/firebase/admin'; // 上記で実装したファイル
import { generateId } from '@/lib/id';
import { prisma } from '@/lib/prisma';
import { SESSION_ID_COOKIE_NAME } from '@/lib/session';
import { SIGNED_IN_TRAINEE_ID_COOKIE_NAME } from '@/lib/trainee';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json(
      { message: 'The id is required.' },
      { status: 400 },
    );
  }

  let sessionCookie;
  try {
    sessionCookie = await auth.createSessionCookie(id, { expiresIn });
  } catch (e) {
    return NextResponse.json(
      { message: 'The id is invalid.' },
      { status: 400 },
    );
  }
  const session = await auth.verifyIdToken(id);
  const { traineeId } =
    (await prisma.trainee.findUnique({
      where: {
        authId: session.uid,
      },
    })) ||
    (await prisma.$transaction(async (tx) => {
      const traineeId = generateId();

      await tx.trainee.create({
        data: {
          authId: session.uid,
          name: session.name,
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

      return {
        traineeId,
      };
    }));

  const options = {
    httpOnly: true,
    maxAge: expiresIn,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  };

  const response = new NextResponse();
  response.cookies.set(SESSION_ID_COOKIE_NAME, sessionCookie, options);
  response.cookies.set(SIGNED_IN_TRAINEE_ID_COOKIE_NAME, traineeId, options);

  return response;
}
