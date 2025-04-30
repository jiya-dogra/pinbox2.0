import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    const users = await prisma.user.findMany({
        where: { roomId },
        select: { id: true, fullName: true, priority: true }
    });

    return NextResponse.json(users);
}