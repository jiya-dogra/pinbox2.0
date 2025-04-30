// /app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // First await the request.json()
    const input = await request.json();

    // Priority update
    if (input.priority !== undefined) {
      const priority = Number(input.priority);

      if (isNaN(priority) || priority < 1) {
        return NextResponse.json(
          { error: 'Priority must be a positive integer' },
          { status: 400 }
        );
      }

      // Update only the priority field
      const updatedUser = await prisma.user.update({
        where: { id }, // Now using the properly destructured id
        data: { priority }
      });

      return NextResponse.json({
        message: 'Priority updated successfully',
        priority: updatedUser.priority
      });
    }

    // Regular user update (existing code)
    if (!input.fullName || !input.email || !input.password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (input.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: input.email }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 409 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        fullName: input.fullName,
        email: input.email,
        password: input.password
      }
    });

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
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
    // First delete all tasks assigned by this user
    await prisma.task.deleteMany({
      where: { assignedById: params.id }
    });

    // Then delete all tasks assigned to this user
    await prisma.task.deleteMany({
      where: { assignedToId: params.id }
    });

    // Finally delete the user
    await prisma.user.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}