import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    try {
        const events = await prisma.calendarEvent.findMany({
            where: { createdById: userId },
            orderBy: { start: 'asc' }
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { title, description, start, end, allDay, type, createdById } = await request.json();

        const event = await prisma.calendarEvent.create({
            data: {
                title,
                description,
                start: new Date(start),
                end: end ? new Date(end) : null,
                type,
                createdById
            }
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}