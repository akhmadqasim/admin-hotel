// Next
import {NextResponse, NextRequest} from "next/server";

// Prisma
import {prisma} from "@/helper/prisma";

// Third-party
import * as v from "valibot";

const reservationSchema = v.object({
    memberId: v.string(),
    beginDate: v.optional(v.date()),
    endDate: v.optional(v.date()),
    roomNumber: v.optional(v.string()),
    price: v.optional(v.number()),
    mealCost: v.optional(v.number()),
    laundryCost: v.optional(v.number()),
    otherCost: v.optional(v.number()),
});

export const GET = async () => {
    const reservations = await prisma.reservation.findMany();

    return NextResponse.json({
        reservations
    });
}

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        const data = v.parse(reservationSchema, {
            memberId: body.memberId,
            ...(body.beginDate ? {beginDate: new Date(body.beginDate)} : {}),
            ...(body.endDate ? {endDate: new Date(body.endDate)} : {}),
            ...(body.roomNumber ? {roomNumber: body.roomNumber} : {}),
            ...(body.price ? {price: body.price} : {}),
            ...(body.mealCost ? {mealCost: body.mealCost} : {}),
            ...(body.laundryCost ? {laundryCost: body.laundryCost} : {}),
            ...(body.otherCost ? {otherCost: body.otherCost} : {}),
        });

        const reservation = await prisma.reservation.create({
            data: {
                memberId: data.memberId,
                beginDate: data.beginDate,
                endDate: data.endDate,
                roomNumber: data.roomNumber,
                price: data.price,
                mealCost: data.mealCost,
                laundryCost: data.laundryCost,
                otherCost: data.otherCost
            }
        });

        return NextResponse.json({
            reservation
        });
    } catch (e) {
        return NextResponse.json({message: "Invalid data"}, {status: 400});
    }
}