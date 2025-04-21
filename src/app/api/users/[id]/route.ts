// /app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { fullName, email, password } = await request.json();
    
    // Validate input
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed to an existing email
    if (email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });
      
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 409 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        fullName,
        email,
        password // Remember to hash in production
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