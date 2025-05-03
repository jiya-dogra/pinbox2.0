import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    try {
        // Get all tasks for the user
        const tasks = await prisma.task.findMany({
            where: {
                OR: [
                    { assignedToId: userId },
                    { assignedById: userId }
                ]
            },
            select: {
                id: true,
                status: true,
                dueDate: true
            }
        });

        const now = new Date();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const pendingTasks = tasks.filter(t => t.status === 'pending').length;
        const overdueTasks = tasks.filter(t =>
            t.status === 'pending' &&
            t.dueDate &&
            new Date(t.dueDate) < now
        ).length;

        // Task status distribution
        const taskStatusDistribution = [
            { name: 'Completed', value: completedTasks },
            { name: 'Pending', value: pendingTasks },
            { name: 'Overdue', value: overdueTasks }
        ];

        // Tasks by due date (group by week)
        const tasksByDueDate = tasks.reduce((acc: any, task) => {
            if (!task.dueDate) return acc;

            const date = new Date(task.dueDate);
            const week = getWeekNumber(date);
            const year = date.getFullYear();
            const key = `${year}-W${week}`;

            if (!acc[key]) {
                acc[key] = {
                    week: key,
                    count: 0
                };
            }

            acc[key].count += 1;
            return acc;
        }, {});

        return NextResponse.json({
            totalTasks,
            completedTasks,
            pendingTasks,
            overdueTasks,
            taskStatusDistribution,
            tasksByDueDate: Object.values(tasksByDueDate)
        });
    } catch (error) {
        console.error('Error fetching employee dashboard data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

function getWeekNumber(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}