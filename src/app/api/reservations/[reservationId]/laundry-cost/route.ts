// Next Imports
import {NextRequest} from "next/server";

// Prisma Imports
import {prisma} from "@/helper/prisma";

export const GET = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
  const {reservationId} = await params;

  const laundry = await prisma.laundryCost.findMany({
    where: {
      reservationId
    }
  })

  if (!laundry) {
    return Response.json({message: 'Laundry not found'}, {status: 404})
  }

  return Response.json({laundry})
}

export const POST = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
  const body = await req.json();
  const {reservationId} = await params;

  const laundry = await prisma.laundryCost.create({
    data: {
      reservationId,
      laundryType: body.laundryType,
      laundryCost: body.laundryCost,
    }
  })

  if (!laundry) {
    return Response.json({message: 'Laundry not found'}, {status: 404})
  }

  return Response.json({laundry})
}