// Next Imports
import {NextRequest} from "next/server";

// Prisma Imports
import {prisma} from "@/helper/prisma";

export const GET = async (req: NextRequest, {params}: { params: Promise<{ otherCostId: string }> }) => {
  try {
    const {otherCostId} = await params;

    const otherCost = await prisma.otherCost.findUnique({
      where: {
        id: otherCostId,
      }
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

export const DELETE = async (req: NextRequest, {params}: { params: Promise<{ otherCostId: string }> }) => {
  try {
    const {otherCostId} = await params;

    const otherCost = await prisma.otherCost.delete({
      where: {
        id: otherCostId,
      }
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

export const PATCH = async (req: NextRequest, {params}: { params: Promise<{ otherCostId: string }> }) => {
  try {
    const {otherCostId} = await params;

    const body = await req.json();

    const otherCost = await prisma.otherCost.update({
      where: {
        id: otherCostId,
      },
      data: {
        costName: body.costName,
        costAmount: body.costAmount,
      }
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