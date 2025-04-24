// Next Imports
import {NextRequest} from "next/server";

// Prisma Imports
import {prisma} from "@/helper/prisma";

export const GET = async (req: NextRequest, {params}: { params: Promise<{ mealId: string, reservationId: string }> }) => {
  const {mealId, reservationId} = await params;

  const meal = await prisma.mealCost.findUnique({
    where: {
      id: mealId,
      reservationId
    }
  })

  if (!meal) {
    return Response.json({message: 'Meal not found'}, {status: 404})
  }

  return Response.json({meal})
}

export const DELETE = async (req: NextRequest, {params}: { params: Promise<{ mealId: string, reservationId: string }> }) => {
  const {mealId, reservationId} = await params;

  const meal = await prisma.mealCost.delete({
    where: {
      id: mealId,
      reservationId
    }
  })

  if (!meal) {
    return Response.json({message: 'Meal not found'}, {status: 404})
  }

  return Response.json({meal})
}

export const PATCH = async (req: NextRequest, {params}: { params: Promise<{ mealId: string, reservationId: string }> }) => {
  const {mealId, reservationId} = await params;

  const body = await req.json();

  const meal = await prisma.mealCost.update({
    where: {
      id: mealId,
      reservationId
    },
    data: {
      mealType: body.mealType,
      mealCost: body.mealCost,
    }
  })

  if (!meal) {
    return Response.json({message: 'Meal not found'}, {status: 404})
  }

  return Response.json({meal})
}