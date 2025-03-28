// Next
import {NextResponse, NextRequest} from "next/server";

// Prisma
import {prisma} from "@/helper/prisma";

// Third-party
import * as v from "valibot";

const reservationSchema = v.object({
  memberId: v.string(),
  date: v.date(),
  price: v.number(),
});

export const GET = async () => {
  const reservations = await prisma.reservation.findMany();

  return NextResponse.json({
    reservations
  });
}

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const data = v.parse(reservationSchema, {
      memberId: body.memberId,
      date: new Date(body.date),
      price: body.price
    });

    const reservation = await prisma.reservation.create({
      data
    });

    return NextResponse.json({
      reservation
    });
  } catch (e) {
    return NextResponse.json({message: "Invalid data"}, {status: 400});
  }
}