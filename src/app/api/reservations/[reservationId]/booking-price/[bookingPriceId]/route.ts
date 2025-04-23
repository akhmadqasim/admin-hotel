// Next Import
import {NextRequest} from "next/server";

// Prisma Imports
import {prisma} from "@/helper/prisma";

export const GET = async (req: NextRequest, {params}: { params: Promise<{ bookingPriceId: string, reservationId: string }> }) => {
  const {bookingPriceId, reservationId} = await params;

  const bookingPrice = await prisma.bookingPrice.findUnique({
    where: {
      id: bookingPriceId,
      reservationId
    }
  })

  if (!bookingPrice) {
    return Response.json({message: 'Booking not found'}, {status: 404})
  }

  return Response.json({bookingPrice})
}

export const DELETE = async (req: NextRequest, {params}: { params: Promise<{ bookingPriceId: string, reservationId: string }> }) => {
  const {bookingPriceId, reservationId} = await params;

  const bookingPrice = await prisma.bookingPrice.delete({
    where: {
      id: bookingPriceId,
      reservationId
    }
  })

  if (!bookingPrice) {
    return Response.json({message: 'Booking not found'}, {status: 404})
  }

  return Response.json({bookingPrice})
}

export const PATCH = async (req: NextRequest, {params}: { params: Promise<{ bookingPriceId: string, reservationId: string }> }) => {
  const {bookingPriceId, reservationId} = await params;

  const body = await req.json();

  const bookingPrice = await prisma.bookingPrice.update({
    where: {
      id: bookingPriceId,
      reservationId
    },
    data: {
      roomType: body.roomType,
      roomPrice: body.roomPrice,
    }
  })

  if (!bookingPrice) {
    return Response.json({message: 'Booking not found'}, {status: 404})
  }

  return Response.json({bookingPrice})
}