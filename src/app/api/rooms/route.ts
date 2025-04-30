import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');

    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    // Get admin's company
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

    // Get rooms for this company with user count
    const rooms = await prisma.room.findMany({
      where: { companyId: admin.companyId },
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(rooms);
  } catch (err) {
    console.error('Fetch rooms error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, adminId } = await request.json();

    if (!name || !adminId) {
      return NextResponse.json(
        { error: 'Room name and admin ID are required' },
        { status: 400 }
      );
    }

    // Get admin's company
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

    // Check if room already exists for this company
    const existingRoom = await prisma.room.findFirst({
      where: {
        name,
        companyId: admin.companyId
      }
    });

    if (existingRoom) {
      return NextResponse.json(
        { error: 'Room with this name already exists' },
        { status: 409 }
      );
    }

    // Create new room
    const newRoom = await prisma.room.create({
      data: {
        name,
        companyId: admin.companyId
      }
    });

    return NextResponse.json(
      { message: 'Room created successfully', room: newRoom },
      { status: 201 }
    );
  } catch (err) {
    console.error('Create room error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}