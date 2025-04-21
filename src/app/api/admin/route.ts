import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function POST(req: Request) {
  try {
    const { fullName, email, password, companyId } = await req.json();

    if (!fullName || !email || !password || !companyId) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      return NextResponse.json({ error: 'Invalid company ID.' }, { status: 404 });
    }

    const existing = await prisma.admin.findUnique({ where: { companyId } });
    if (existing) {
      return NextResponse.json({ error: 'Admin already exists for this company.' }, { status: 409 });
    }

    await prisma.admin.create({
      data: {
        fullName,
        email,
        password,
        companyId,
      },
    });

    return NextResponse.json({ message: 'Admin created successfully!' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
