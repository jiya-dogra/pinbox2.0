import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, adminId } = await request.json();

    if (!name || !adminId) {
      return NextResponse.json(
        { error: 'Room name and admin ID are required' },
        { status: 400 }
      );
    }

    // Verify admin owns this room
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

    // Check if room exists and belongs to admin's company
    const existingRoom = await prisma.room.findUnique({
      where: { id: params.id }
    });

    if (!existingRoom || existingRoom.companyId !== admin.companyId) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if new name is already taken in this company
    const nameExists = await prisma.room.findFirst({
      where: {
        name,
        companyId: admin.companyId,
        NOT: { id: params.id }
      }
    });

    if (nameExists) {
      return NextResponse.json(
        { error: 'Room with this name already exists' },
        { status: 409 }
      );
    }

    // Update room
    const updatedRoom = await prisma.room.update({
      where: { id: params.id },
      data: { name }
    });

    return NextResponse.json({
      message: 'Room updated successfully',
      room: updatedRoom
    });
  } catch (err) {
    console.error('Update error:', err);
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
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');

    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    // Verify admin owns this room
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

    // Check if room exists and belongs to admin's company
    const existingRoom = await prisma.room.findUnique({
      where: { id: params.id }
    });

    if (!existingRoom || existingRoom.companyId !== admin.companyId) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // First remove all user associations
    await prisma.user.updateMany({
      where: { roomId: params.id },
      data: { roomId: null }
    });

    // Then delete the room
    await prisma.room.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      message: 'Room deleted successfully'
    });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}