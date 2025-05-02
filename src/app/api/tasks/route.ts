import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// In your tasks route.ts
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const tasks = await prisma.task.findMany({
            where: {
                OR: [
                    { assignedToId: userId },
                    { assignedById: userId }
                ]
            },
            orderBy: { dueDate: 'asc' },
            include: {
                assignedBy: { select: { fullName: true } },
                assignedTo: { select: { fullName: true } }
            }
        });

        return NextResponse.json(tasks || []);
    } catch (err) {
        console.error('Fetch tasks error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { title, description, dueDate, assignedById, assignedToId } = await request.json();

        // Verify priority rules
        const [assigner, assignee] = await Promise.all([
            prisma.user.findUnique({
                where: { id: assignedById },
                select: {
                    id: true,
                    priority: true // Explicitly select priority
                }
            }),
            prisma.user.findUnique({
                where: { id: assignedToId },
                select: {
                    id: true,
                    priority: true // Explicitly select priority
                }
            })
        ]);

        if (!assigner || !assignee || (assigner.priority || 1) > (assignee.priority || 1)) {
            return NextResponse.json(
                { error: 'You can only assign tasks to lower priority users' },
                { status: 403 }
            );
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                dueDate: new Date(dueDate),
                assignedById,
                assignedToId,
                status: 'pending'
            },
            include: {  // Add this to include relations in response
                assignedBy: { select: { fullName: true } },
                assignedTo: { select: { fullName: true } }
            }
        });

        return NextResponse.json(task, { status: 201 });
    } catch (err) {
        console.error('Create task error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}