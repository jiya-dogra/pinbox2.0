import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function GET() {
  try {
    // Example implementation - adjust based on your actual database structure
    const [totalEmployees, totalRooms, rooms] = await Promise.all([
      prisma.user.count(),
      prisma.room.count(),
      prisma.room.findMany({
        include: {
          _count: {
            select: { users: true }
          }
        }
      })
    ]);

    return NextResponse.json({
      totalEmployees,
      totalRooms,
      roomOccupancy: rooms.map(room => ({
        name: room.name,
        count: room._count.users
      })),
      employeesPerRoom: rooms.map(room => ({
        name: room.name,
        count: room._count.users
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}