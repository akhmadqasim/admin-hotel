// Next Imports
import {NextRequest} from "next/server";

// Prisma Imports
import {prisma} from "@/helper/prisma";

export const GET = async (req: NextRequest, {params}: { params: Promise<{ reservationId: string }> }) => {
  try {
    const {reservationId} = await params;

    const meals = await prisma.mealCost.findMany({
      where: {
        reservationId
      }
    })

    if (!meals) {
      return Response.json({message: 'Meal not found'}, {status: 404})
    }

    return Response.json({meals})
  } catch (e) {
    await prisma.errorLog.create({
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
    const {reservationId} = await params;
    const body = await req.json();

    const meal = await prisma.mealCost.create({
      data: {
        reservationId,
        mealType: body.mealType,
        mealCost: body.mealCost,
      }
    })

    if (!meal) {
      return Response.json({message: 'Meal not found'}, {status: 404})
    }

    return Response.json({meal})
  } catch (e) {
    await prisma.errorLog.create({
      data: {
        message: e.message,
        stack: e,
      }
    })

    return Response.json({message: 'Internal server error'}, {status: 500})
  }
}