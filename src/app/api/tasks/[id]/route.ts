import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

type TaskStatus = 'pending' | 'completed';
type TaskUpdateData = {
    status?: TaskStatus;
    title?: string;
    description?: string;
    dueDate?: string;
    assignedToId?: string;
};

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const updateData: TaskUpdateData = await request.json();

        // Handle status updates (your existing functionality)
        if (updateData.status) {
            if (!['pending', 'completed'].includes(updateData.status)) {
                return NextResponse.json(
                    { error: 'Invalid status value' },
                    { status: 400 }
                );
            }

            const updatedTask = await prisma.task.update({
                where: { id: params.id },
                data: { status: updateData.status }
            });

            return NextResponse.json(updatedTask);
        }

        // Handle full task updates (new functionality)
        const { title, description, dueDate, assignedToId } = updateData;

        // Verify priority rules if assignment is being changed
        if (assignedToId) {
            const task = await prisma.task.findUnique({
                where: { id: params.id },
                select: { assignedById: true }
            });

            if (!task) {
                return NextResponse.json(
                    { error: 'Task not found' },
                    { status: 404 }
                );
            }

            const [assigner, assignee] = await Promise.all([
                prisma.user.findUnique({
                    where: { id: task.assignedById },
                    select: { priority: true }
                }),
                prisma.user.findUnique({
                    where: { id: assignedToId },
                    select: { priority: true }
                })
            ]);

            if (!assigner || !assignee || (assigner.priority || 1) > (assignee.priority || 1)) {
                return NextResponse.json(
                    { error: 'You can only assign tasks to lower priority users' },
                    { status: 403 }
                );
            }
        }

        const updatedTask = await prisma.task.update({
            where: { id: params.id },
            data: {
                title,
                description,
                ...(dueDate && { dueDate: new Date(dueDate) }),
                ...(assignedToId && { assignedToId })
            },
            include: {
                assignedBy: { select: { fullName: true } },
                assignedTo: { select: { fullName: true } }
            }
        });

        return NextResponse.json(updatedTask);
    } catch (err) {
        console.error('Update task error:', err);
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
        // Get the task ID from params
        const taskId = params.id;

        // Verify the task exists
        const task = await prisma.task.findUnique({
            where: { id: taskId }
        });

        if (!task) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        // Delete the task
        await prisma.task.delete({
            where: { id: taskId }
        });

        return new NextResponse(null, { status: 204 });
    } catch (err) {
        console.error('Delete task error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}