import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            priority: true,
            roomId: true,
            room: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    if (!userData) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userData);
}
