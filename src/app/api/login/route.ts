import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password, userType } = await req.json();

    if (!email || !password || !userType) {
      return NextResponse.json(
        { error: 'Email, password and user type are required' },
        { status: 400 }
      );
    }

    if (userType === 'admin') {
      const admin = await prisma.admin.findUnique({ where: { email } });
      if (!admin || admin.password !== password) {
        return NextResponse.json(
          { error: 'Invalid admin credentials' },
          { status: 401 }
        );
      }
      return NextResponse.json({ 
        message: 'Admin login successful',
        userType: 'admin',
        userId: admin.id
      });
    } 
    else if (userType === 'employee') {
      const employee = await prisma.user.findUnique({ where: { email } });
      if (!employee || employee.password !== password) {
        return NextResponse.json(
          { error: 'Invalid employee credentials' },
          { status: 401 }
        );
      }
      return NextResponse.json({ 
        message: 'Employee login successful',
        userType: 'employee',
        userId: employee.id
      });
    }

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}