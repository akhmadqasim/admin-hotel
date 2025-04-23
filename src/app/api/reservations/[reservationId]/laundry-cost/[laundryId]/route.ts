// Next Imports
import {NextRequest} from "next/server";

// Prisma Imports
import {prisma} from "@/helper/prisma";

export const GET = async (req: NextRequest, {params}: { params: Promise<{ laundryId: string }> }) => {
  const {laundryId} = await params;

  const laundry = await prisma.laundryCost.findUnique({
    where: {
      id: laundryId,
    }
  })

  if (!laundry) {
    return Response.json({message: 'Laundry not found'}, {status: 404})
  }

  return Response.json({laundry})
}

export const DELETE = async (req: NextRequest, {params}: { params: Promise<{ laundryId: string }> }) => {
  const {laundryId} = await params;

  const laundry = await prisma.laundryCost.delete({
    where: {
      id: laundryId,
    }
  })

  if (!laundry) {
    return Response.json({message: 'Laundry not found'}, {status: 404})
  }

  return Response.json({laundry})
}

export const PATCH = async (req: NextRequest, {params}: { params: Promise<{ laundryId: string }> }) => {
  const {laundryId} = await params;

  const body = await req.json();

  const laundry = await prisma.laundryCost.update({
    where: {
      id: laundryId,
    },
    data: {
      laundryType: body.laundryType,
      laundryCost: body.laundryCost,
    }
  })

  if (!laundry) {
    return Response.json({message: 'Laundry not found'}, {status: 404})
  }

  return Response.json({laundry})
}