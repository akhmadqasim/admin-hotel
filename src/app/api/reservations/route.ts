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
            ...(body.mealCost ? {mealCost: body.mealCost} : {}),
            ...(body.laundryCost ? {laundryCost: body.laundryCost} : {}),
            ...(body.otherCost ? {otherCost: body.otherCost} : {}),
        });

        const reservation = await prisma.reservation.create({
            data: {
                memberId: data.memberId,
                beginDate: data.beginDate,
                ...(data.endDate ? {endDate: data.endDate} : {}),
                ...(data.roomNumber ? {roomNumber: data.roomNumber} : {}),
                ...(data.mealCost ? {mealCost: data.mealCost} : {}),
                ...(data.laundryCost ? {laundryCost: data.laundryCost} : {}),
                ...(data.otherCost ? {otherCost: data.otherCost} : {})
            }
        });

        return NextResponse.json({
            reservation
        });
    } catch (e) {
        return NextResponse.json({message: "Invalid data"}, {status: 400});
    }
}