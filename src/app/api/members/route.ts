// Next
import {NextResponse, NextRequest} from "next/server";

// Prisma
import {prisma} from "@/helper/prisma";

// Third-party
import * as v from "valibot";

const memberSchema = v.object({
  nik: v.string(),
  name: v.string(),
  birthDate: v.date(),
  birthPlace: v.string()
});

export const GET = async () => {
  const members = await prisma.member.findMany();

  return NextResponse.json({
    members
  })
}

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const data = v.parse(memberSchema, {
      nik: body.nik,
      name: body.name,
      birthDate: new Date(body.birthDate),
      birthPlace: body.birthPlace
    })

    const member = await prisma.member.create({
      data
    });

    return NextResponse.json({
      member
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({message: "Invalid data"}, {status: 400})
  }
}