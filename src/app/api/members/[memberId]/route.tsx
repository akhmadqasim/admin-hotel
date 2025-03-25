// Next
import {NextRequest, NextResponse} from "next/server";

// Prisma
import {prisma} from "@/helper/prisma";

export const GET = async (req: NextRequest, {params}: { params: Promise<{ memberId: string }> }) => {
  const {memberId} = await params;

  const member = await prisma.member.findUnique({
    where: {
      id: memberId
    }
  });

  if (member) {
    return NextResponse.json({message: 'Member not found'}, {status: 404})
  }

  return NextResponse.json({member})
};

export const DELETE = async (req: NextRequest, {params}: { params: Promise<{ memberId: string }> }) => {
  const {memberId} = await params;

  await prisma.member.delete({
    where: {
      id: memberId
    }
  })

  return new NextResponse(null, {status: 204});
};

export const PUT = async (req: NextRequest, {params}: { params: Promise<{ memberId: string }> }) => {
  const {memberId} = await params;

  const body = await req.json();

  const member = await prisma.member.update({
    where: {
      id: memberId
    },
    data: {
      nik: body.nik,
      name: body.name,
      birthDate: body.birthDate,
      birthPlace: body.birthPlace
    }
  });

  return NextResponse.json({member});
}

export const PATCH = async (req: NextRequest, {params}: { params: Promise<{ memberId: string }> }) => {
  const {memberId} = await params;

  const body = await req.json();

  const member = await prisma.member.update({
    where: {
      id: memberId
    },
    data: {
      nik: body.nik.toString(),
      name: body.name,
      birthDate: new Date(body.birthDate),
      birthPlace: body.birthPlace
    }
  });

  return NextResponse.json({member});
}