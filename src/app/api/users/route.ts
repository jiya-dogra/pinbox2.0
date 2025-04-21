// /app/api/users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

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

    // Get admin to find companyId
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Fetch users for this company
    const users = await prisma.user.findMany({
      where: { companyId: admin.companyId },
      select: {
        id: true,
        fullName: true,
        email: true,
        // Include other fields you need
      }
    });

    return NextResponse.json(users);

  } catch (err) {
    console.error('Fetch users error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { fullName, email, password, adminId } = await request.json();

    if (!fullName || !email || !password || !adminId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get admin to find companyId
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password, // Remember to hash in production
        companyId: admin.companyId
      }
    });

    return NextResponse.json(
      { message: 'User created successfully', user: newUser },
      { status: 201 }
    );

  } catch (err) {
    console.error('Create user error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}