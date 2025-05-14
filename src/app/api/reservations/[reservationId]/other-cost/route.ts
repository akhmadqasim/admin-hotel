// Next Imports
import {NextRequest} from "next/server";

// Prisma Imports
import {prisma} from "@/helper/prisma";

export const GET = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
  try {
    const {reservationId} = await params;

    const otherCost = await prisma.otherCost.findMany({
      where: {
        reservationId
      },
    })

    if (!otherCost) {
      return Response.json({message: 'Other cost not found'}, {status: 404})
    }

    return Response.json({otherCost})
  } catch (e) {
    prisma.errorLog.create({
      data: {
        message: e.message,
        stack: e,
      }
    })

    return Response.json({message: 'Internal server error'}, {status: 500})
  }
}

export const POST = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
  try {
    const body = await req.json();
    const {reservationId} = await params;

    const otherCost = await prisma.otherCost.create({
      data: {
        reservationId,
        costName: body.costName,
        costAmount: body.costAmount,
      },
    })

    if (!otherCost) {
      return Response.json({message: 'Other cost not found'}, {status: 404})
    }

    return Response.json({otherCost})
  } catch (e) {
    prisma.errorLog.create({
      data: {
        message: e.message,
        stack: e,
      }
    })

    return Response.json({message: 'Internal server error'}, {status: 500})
  }
}