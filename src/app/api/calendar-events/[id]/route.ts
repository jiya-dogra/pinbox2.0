import { NextResponse } from "next/server";
import prisma from '@/src/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { title, description, start, end, type } = await request.json();

        const updatedEvent = await prisma.calendarEvent.update({
            where: { id: params.id },
            data: {
                title,
                description,
                start: new Date(start),
                end: end ? new Date(end) : null,
                type
            }
        });

        return NextResponse.json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}