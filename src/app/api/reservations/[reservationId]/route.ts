// Next
import {NextRequest, NextResponse} from "next/server";

// Prisma
import {prisma} from "@/helper/prisma";

// Third-party
import * as v from "valibot";

const reservationSchema = v.object({
  memberId: v.string(),
  date: v.date(),
  price: v.number(),
});

const reservationSchemaPatch = v.object({
  memberId: v.optional(v.string()),
  date: v.optional(v.date()),
  price: v.optional(v.number()),
});

export const GET = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
  const {reservationId} = await params;

  const reservation = await prisma.reservation.findUnique({
    where: {
      id: reservationId
    }
  });

  if (!reservation) {
    return NextResponse.json({message: 'Reservation not found'}, {status: 404})
  }

  return NextResponse.json({reservation})
}

export const DELETE = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
  const {reservationId} = await params;

  const result = await prisma.reservation.delete({
    where: {
      id: reservationId
    }
  })

  if (!result) {
    return NextResponse.json({message: 'Reservation not found'}, {status: 404})
  }

  return new NextResponse(null, {status: 204});
};

export const PUT = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
  try {
    const {reservationId} = await params;

    const body = await req.json();

    const data = v.parse(reservationSchema, {
      memberId: body.memberId,
      date: new Date(body.date),
      price: body.price
    });

    const reservation = await prisma.reservation.update({
      where: {
        id: reservationId
      },
      data
    });

    return NextResponse.json({reservation});
  } catch (e) {
    return NextResponse.json({message: "Invalid data"}, {status: 400});
  }
}

export const PATCH = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
  try {
    const {reservationId} = await params;

    const body = await req.json();

    const data = v.parse(reservationSchemaPatch, {
      memberId: body.memberId,
      date: new Date(body.date),
      price: body.price
    });

    const reservation = await prisma.reservation.update({
      where: {
        id: reservationId
      },
      data
    });

    return NextResponse.json({reservation});
  } catch (e) {
    return NextResponse.json({message: "Invalid data"}, {status: 400});
  }
}