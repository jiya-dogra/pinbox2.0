import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      name,
      email,
      phone,
      industryType,
      address,
      website,
    } = data;

    if (!name || !email || !phone || !industryType || !address) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const existing = await prisma.company.findFirst({
      where: {
        OR: [
          { email },
          { name, address }
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Company already registered.' }, { status: 409 });
    }

    const company = await prisma.company.create({
      data: {
        name,
        email,
        phone,
        industryType,
        address,
        website: website || null,
      },
    });

    return NextResponse.json({
      message: 'Company registered successfully!',
      companyId: company.id
    });
  } catch (err) {
    console.error('Error registering company:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
