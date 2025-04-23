// Next
import {NextResponse, NextRequest} from "next/server";

// Prisma
import {prisma} from "@/helper/prisma";

// Third-party
import * as v from "valibot";

const reservationSchema = v.object({
  memberId: v.string(),
  checkIn: v.optional(v.date()),
  checkOut: v.optional(v.date()),
  roomNumber: v.optional(v.string()),
  roomType: v.optional(v.string()),
  roomPrice: v.optional(v.number()),
  mealType: v.optional(v.string()),
  mealCost: v.optional(v.number()),
  laundryType: v.optional(v.string()),
  laundryCost: v.optional(v.number()),
  otherType: v.optional(v.string()),
  otherCost: v.optional(v.number()),
});

export const GET = async () => {
  const reservations = await prisma.reservation.findMany({
    include: {
      bookingPrice: true,
      mealCost: true,
      laundryCost: true,
      otherCost: true,
    }
  });

  if (!reservations) {
    return NextResponse.json({message: 'No reservations found'}, {status: 404})
  }

  return NextResponse.json({
    reservations
  });
}

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const data = v.parse(reservationSchema, {
      memberId: body.memberId,
      ...(body.checkIn ? {checkIn: new Date(body.checkIn)} : {}),
      ...(body.checkOut ? {checkOut: new Date(body.checkOut)} : {}),
      ...(body.roomNumber ? {roomNumber: body.roomNumber} : {}),
      ...(body.roomType ? {roomType: body.roomType} : {}),
      ...(body.roomPrice ? {roomPrice: body.roomPrice} : {}),
      ...(body.mealType ? {mealType: body.mealType} : {}),
      ...(body.mealCost ? {mealCost: body.mealCost} : {}),
      ...(body.laundryType ? {laundryType: body.laundryType} : {}),
      ...(body.laundryCost ? {laundryCost: body.laundryCost} : {}),
      ...(body.otherType ? {otherType: body.otherType} : {}),
      ...(body.otherCost ? {otherCost: body.otherCost} : {}),
    });

    const reservation = await prisma.reservation.create({
      data: {
        memberId: data.memberId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        roomNumber: data.roomNumber,
        ...(data.roomType ? {
          bookingPrice: {
            create: {
              roomType: data.roomType,
              roomPrice: data.roomPrice
            }
          }
        } : {}),
        ...(data.mealType ? {
          mealCost: {
            create: {
              mealType: '',
              mealCost: data.mealCost
            }
          },
        } : {}),
        ...(data.laundryType ? {
          laundryCost: {
            create: {
              laundryType: data.laundryType,
              laundryCost: data.laundryCost
            }
          }
        } : {}),
        ...(data.otherType ? {
          otherCost: {
            create: {
              costName: data.otherType,
              costAmount: data.otherCost
            }
          }
        } : {})
      }
    });

    return NextResponse.json({
      reservation
    });
  } catch (e) {
    return NextResponse.json({message: "Invalid data"}, {status: 400});
  }
}