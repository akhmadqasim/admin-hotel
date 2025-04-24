// Next Imports
import {NextRequest} from "next/server";

// Prisma Imports
import {prisma} from "@/helper/prisma";

export const GET = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
  const {reservationId} = await params;

  const meals = await prisma.bookingPrice.findMany({
    where: {
      reservationId,
    }
  })

  if (!meals) {
    return Response.json({message: 'Booking not found'}, {status: 404})
  }

  return Response.json({meals})
}

export const POST = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
  const body = await req.json();
  const {reservationId} = await params;

  const meals = await prisma.bookingPrice.create({
    data: {
      reservationId,
      roomType: body.roomType,
      roomPrice: body.roomPrice,
    }
  })

  if (!meals) {
    return Response.json({message: 'Booking not found'}, {status: 404})
  }

  return Response.json({meals})
}