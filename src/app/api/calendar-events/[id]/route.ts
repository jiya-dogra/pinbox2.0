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

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // First verify the event exists
        const event = await prisma.calendarEvent.findUnique({
            where: { id: params.id }
        });

        if (!event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        // Delete the event
        await prisma.calendarEvent.delete({
            where: { id: params.id }
        });

        return NextResponse.json(
            { message: 'Event deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}