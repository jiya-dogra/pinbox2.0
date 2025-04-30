// app/api/assign-room/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, roomId, adminId } = await request.json();

    // Validate input
    if (!userId || !roomId || !adminId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify admin has permission
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { companyId: true }
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Check if room belongs to admin's company
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { companyId: true }
    });

    if (!room || room.companyId !== admin.companyId) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if user belongs to admin's company
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { companyId: true, roomId: true }
    });

    if (!user || user.companyId !== admin.companyId) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove user from current room if assigned
    if (user.roomId) {
      await prisma.user.update({
        where: { id: userId },
        data: { roomId: null }
      });
    }

    // Assign to new room
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { roomId },
      include: { room: true }
    });

    return NextResponse.json({
      message: 'Room assigned successfully',
      user: updatedUser
    });

  } catch (err) {
    console.error('Assign room error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}